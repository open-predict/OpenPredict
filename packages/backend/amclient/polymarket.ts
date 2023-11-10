import {Chain, ClobClient} from "@polymarket/clob-client";
import {pmMarketData, pmMarketFulldata, pmTokenFilledOrder} from "../types/market.js";
import {WebSocket} from "ws";
import fetch from "node-fetch";
import {ethers} from "ethers";
import {msearch} from "../index.js";

const tempwallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
const pmclient = new ClobClient(process.env.CLOB_HOST || "https://polyclob.openpredict.org", Chain.POLYGON, tempwallet);

class PmChainCache {
  marketData: Map<string, pmMarketData> = new Map()

  users: Map<string, {
    name: string,
    profileImage: string,
  }> = new Map()

  filledOrders: Map<string, Map<string, pmTokenFilledOrder>> = new Map()

  positions: Map<string, Map<string, {
    position: number, //Dollars
  }> | null> = new Map()

  orderBooks: Map<string, {
    asks: [number, number][],
    bids: [number, number][],
  } | null> = new Map()


  private pushClientRequest<T>(x: Promise<T>, y: (v: T) => Promise<void>, z: (e: Error) => Promise<void>): void {
    this.clientRequestNeck.push([x, y, z])
    this.drainClientRequests().then(_ => {})
  }

  clientRequestNeck: [Promise<any>, (x: any) => Promise<void>, (e: Error) => Promise<void>][] = []
  currentClientRequests: Promise<number>[] = []
  usingClientRequestNeck = false

  private async drainClientRequests() {
    if (!this.usingClientRequestNeck) {
      this.usingClientRequestNeck = true
      while (this.clientRequestNeck.length > 0) {
        while (this.currentClientRequests.length < 10 && this.clientRequestNeck.length > 0) {
          var [p, a, b] = this.clientRequestNeck[0]
          this.currentClientRequests.push(p.then(a, b).then(_ => this.currentClientRequests.length))
          this.clientRequestNeck = this.clientRequestNeck.slice(1)
        }
        const idx = await Promise.race(this.currentClientRequests)
        this.currentClientRequests = [...this.currentClientRequests.slice(0, idx), ...this.currentClientRequests.slice(idx + 1)]
      }
      this.usingClientRequestNeck = false
    }
  }

  marketWsActive = false
  marketWs = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/market`)
  liveActivityWsActive = false
  liveActivityWs = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/live-activity`)

  constructor() {
    this.startLiveActivityWs();
  }

  private processActivityNotification(trade: any) {
    if (trade != null && trade['event_type'] === "TRADE") {
      var market = trade['market'];
      var user = trade['user'];
      var side = trade['side'];
      var size = trade['size'];
      var price = trade['price'];
      var timestamp_str = trade['timestamp'];
      var asset_id = market['asset_id'];
      var txhash = market['transaction_hash'];
      if (
        market != null &&
        user != null &&
        side != null &&
        size != null &&
        price != null &&
        timestamp_str != null &&
        asset_id != null &&
        txhash != null
      ) {
        var fulltrade: pmTokenFilledOrder = {
          maker: user['proxyAddress'],
          price: Number(price),
          size: Number(size),
          side: side,
          ts: Number(timestamp_str),
          taker: undefined,
        }
        this.users.set(user['proxyAddress'], {
          name: user['name'],
          profileImage: user['profileImage'],
        })
        if (this.filledOrders.has(asset_id)) {
          var m = this.filledOrders.get(asset_id)!
          m.set(txhash, fulltrade)
        } else {
          this.filledOrders.set(asset_id, new Map([txhash, fulltrade]))
        }
      }
    }
  }

  private trackOrderBooks(tokens: string[]) {
    var marketWs = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/market`);
    console.log("Tracking token ids: ", tokens)
    marketWs.on("open", () => {
      console.log("book ws opened")
      var restarted = false;
      this.marketWs.on("close", (code, reason) => {
        console.log("market ws closed: ", code, reason.toString(), this.marketWsActive)
        if (!restarted) {
          this.trackOrderBooks(tokens)
          restarted = true;
        }
      })
      this.marketWs.on("error", (err) => {
        console.log("market ws err: ", err)
        if (!restarted) {
          this.trackOrderBooks(tokens)
          restarted = true;
        }
      })
      this.marketWsActive = true
      const asset_ids = [...(new Set([
        ...[...this.marketData.values()].reduce(
          (p, v) => {
            if (v.active && !v.closed) {
              return [...p, ...v.tokens.map(v => v.token_id)]
            } else {
              return p;
            }
          }, <string[]>[]
        ),
      ])).values()]
      var sendingReq = JSON.stringify({
        auth: {},
        type: "market",
        markets: [] as string[],
        assets_ids: asset_ids,
      })
      this.marketWs.send(sendingReq)
      this.marketWs.onmessage = (msg: any) => {
        var resp: any
        try {
          resp = JSON.parse(msg.data)
        } catch {
          return;
        }
        if (resp['event_type'] instanceof String && resp['event_type'].toLowerCase() == 'book' && resp['asset_id'] != null && resp['buys'] != null && resp['sells'] != null) {
          this.orderBooks.set(resp['asset_id'], {
            asks: resp['asks'].map((ask: {size: string, price: string}) => [new Number(ask.price), new Number(ask.size)]),
            bids: resp['buys'].map((bid: {size: string, price: string}) => [new Number(bid.price), new Number(bid.size)]),
          })
        }
      };
    })
  }

  private startLiveActivityWs() {
    this.liveActivityWs.on("open", () => {
      this.liveActivityWsActive = true
      this.liveActivityWs.on("close", (code, reason) => {
        console.log("live activity ws closed: ", code, reason.toString())
        if (this.liveActivityWsActive) {
          this.liveActivityWsActive = false
          this.liveActivityWs = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/market`);
          this.startLiveActivityWs()
        }
      })
      this.liveActivityWs.on("error", (err) => {
        console.log("live activity ws err: ", err)
        if (this.liveActivityWsActive) {
          this.liveActivityWsActive = false
          this.liveActivityWs = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/market`);
          this.startLiveActivityWs()
        }
      })
      this.liveActivityWs.onmessage = (msg: any) => {
        var resp: any
        try {
          resp = JSON.parse(msg.data)
        } catch {
          return;
        }
        console.log("LiveActivity update: ", resp);
        if (resp instanceof Array) {
          for (var i = 0; i < resp.length; i++) {
            this.processActivityNotification(resp[i])
          }
        } else {
          this.processActivityNotification(resp)
        }
      };
    })
  }

  public setMarketData(data: pmMarketData[]) {
    var active = data.filter(v => v.active)
    var activeAndNew = active.filter(v => !this.marketData.has(v.condition_id))
    active.forEach(v => this.marketData.set(v.condition_id, v))

    //Add to search index
    msearch().index('markets').updateDocuments(activeAndNew.map(v => {
      return {
        id: v.condition_id,
        kind: "polymarket",
        title: v.question,
        description: v.description,
        tradable: v.active && !v.closed,
      }
    }), {
      "primaryKey": "id",
    }).catch(err => {
      console.log("meilisearch error updating pm documents: ", err)
    })

    var tradableTokens: string[] = []
    activeAndNew.forEach(v => {
      if (!v.accepting_orders || v.closed) {
        v.tokens.forEach(v => {
          this.orderBooks.set(v.token_id, null)
        })
      } else {
        tradableTokens.push(...(v.tokens.map(v => v.token_id)))
        this.pushClientRequest(fetch("https://polymarket.openpredict.org/api/holders?conditionId=" + v.condition_id), async (resp) => resp.json().then((resp) => {
          if (resp instanceof Array) {
            for (var i = 0; i < resp.length; i++) {
              var token = resp[i].token;
              if (token != null && resp[i].holders != null && resp[i].holders instanceof Array) {
                var holders = resp[i].holders.filter((holder: any) => holder != null &&
                  holder.amount != null &&
                  holder.name != null &&
                  holder.proxyWallet != null &&
                  holder.profileImage != null
                )
                holders.forEach((holder: any) => {
                  this.users.set(holder.proxyWallet, {
                    name: holder.name,
                    profileImage: holder.profileImage,
                  })
                })
                this.positions.set(token, new Map(holders.map((v: any) => [v.proxyWallet, {
                  position: v.amount,
                }])))
              }
            }
          }
        }), async (err) => {
          console.log("Error getting api holders for condition id: " + v.condition_id, err)
        })

        this.pushClientRequest(fetch("https://polyclob.openpredict.org/live-activity/events/" + v.condition_id), resp => resp.json().then((trades: any) => {
          if (trades instanceof Array) {
            for (var i = 0; i < trades.length; i++) {
              var trade: any = trades[i];
              this.processActivityNotification(trade)
            }
          }
        }), async (err) => {
          console.log("error in live-activity at condition id", v.condition_id, ": ", err)
        })
      }
    })

    var tradableTokensSet = new Set(tradableTokens)
    if (tradableTokensSet.size > 0) {
      this.trackOrderBooks([...tradableTokensSet.values()])
    }
  }

  public hasMarket(condition_id: string) {
    return this.marketData.has(condition_id)
  }

  public toFulldata(data: pmMarketData): pmMarketFulldata {
    return {
      data: data,
      orderdata: new Map(data.tokens.map(t => t.token_id).map(t => {
        var _filledOrders: any[] = []
        if (this.filledOrders.has(t)) {
          var __filledOrders = this.filledOrders.get(t)!;
          _filledOrders = [...__filledOrders.values()];
        }

        var _positions: any[] = []
        if (this.positions.has(t)) {
          var __positions = this.positions.get(t)!;
          [...__positions.entries()].forEach(([k, v]) => {
            _positions.push({
              address: k,
              position: v.position,
            })
          })
        }

        return [t, {
          filledOrders: _filledOrders,
          positions: _positions,
          book: this.orderBooks.get(t) ?? {asks: [], bids: []},
        }]
      })),
      meta: {
        volume: BigInt(0), //TODO: Get actual volume
      },
    }
  }

  public getMarket(condition_id: string) {
    var data = this.marketData.get(condition_id);
    if (data == null) {
      return null;
    } else {
      var _data = this.toFulldata(data);
      return _data;
    }
  }
}

declare global {
  var pmChainCache: PmChainCache
}

export async function startAndMaintainPmList() {
  global.pmChainCache = new PmChainCache()
  var markets = await pmclient.getMarkets()
  if (markets.data == null || markets.data.length == 0) {
    console.log("couldnt get markets: ", markets)
    return;
  }
  global.pmChainCache.setMarketData(markets.data)
  var i = 0;
  while (markets.next_cursor != "LTE=") {
    markets = await pmclient.getMarkets(markets.next_cursor);
    if (markets.data == null || markets.data.length == 0) {
      break;
    }
    global.pmChainCache.setMarketData(markets.data)
    i += markets.data.length;
    console.log("Set another batch (" + i.toString() + ")...")
  }
}
