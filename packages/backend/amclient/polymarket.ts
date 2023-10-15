import {Chain, ClobClient} from "@polymarket/clob-client";
import {pmMarketData, pmMarketFulldata, pmTokenFilledOrder, pmUserMap} from "../types/market.js";
import {WebSocket} from "ws";
import fetch from "node-fetch";
import {ethers} from "ethers";
//import {Mutex} from "async-mutex";

const tempwallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
const pmclient = new ClobClient(process.env.CLOB_HOST || "https://polyclob.openpredict.org", Chain.POLYGON, tempwallet);
/*var fullpmclient: ClobClient | null;
var mut = new Mutex();
async function getPmClient() {
  return await mut.runExclusive(async () => {
    if (fullpmclient == null) {
      fullpmclient = new ClobClient(process.env.CLOB_HOST || "https://polyclob.openpredict.org", Chain.POLYGON, tempwallet, await pmclient.createOrDeriveApiKey(0));
    }
    return fullpmclient!;
  })
}*/

class PmChainCache {
  marketData: Map<string, pmMarketData> = new Map()

  users: Map<string, {
    name: string,
    profileImage: string,
  }> = new Map()

  priceHistory: Map<string, {
    ts: number,
    price: number,
  }[] | null> = new Map()

  filledOrders: Map<string, pmTokenFilledOrder[]> = new Map()

  positions: Map<string, Map<string, {
    position: number, //Dollars
  }> | null> = new Map()

  orderBooks: Map<string, {
    asks: [number, number][],
    bids: [number, number][],
  } | null> = new Map()

  ws = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/market`)
  wsActive = false

  private pushClientRequest<T>(x: Promise<T>, y: (v: T) => Promise<void>): void {
    this.clientRequestNeck.push([x, y])
    this.drainClientRequests().then(_ => {})
  }

  clientRequestNeck: [Promise<any>, (x: any) => Promise<void>][] = []
  currentClientRequests: Promise<number>[] = []
  usingClientRequestNeck = false

  private async drainClientRequests() {
    if (!this.usingClientRequestNeck) {
      this.usingClientRequestNeck = true
      while (this.clientRequestNeck.length > 0) {
        while (this.currentClientRequests.length < 10 && this.clientRequestNeck.length > 0) {
          var [p, a] = this.clientRequestNeck[0]
          this.currentClientRequests.push(p.then(a).then(_ => this.currentClientRequests.length))
          this.clientRequestNeck = this.clientRequestNeck.slice(1)
        }
        const idx = await Promise.race(this.currentClientRequests)
        this.currentClientRequests = [...this.currentClientRequests.slice(0, idx), ...this.currentClientRequests.slice(idx + 1)]
      }
      this.usingClientRequestNeck = false
    }
  }

  private startWs() {
    this.ws.on("open", () => {
      this.wsActive = true
      const asset_ids = [...(new Set([
        ...[...this.marketData.values()].reduce(
          (p, v) => [...p, ...v.tokens.map(v => v.token_id)], <string[]>[]
        ),
      ])).values()]
      this.ws.send(JSON.stringify({
        auth: {},
        type: "market",
        markets: [] as string[],
        assets_ids: asset_ids,
      }))
      setInterval(() => {
        this.ws.send("PING")
      }, 5000)
      this.ws.onmessage = (msg: any) => {
        var resp: any
        try {
          resp = JSON.parse(msg.data)
        } catch {
          return;
        }
        console.log("PM update: ", resp);
        if (resp['event_type'] == 'book' && resp['asset_id'] != null && resp['asks'] != null && resp['bids'] != null) {
          this.orderBooks.set(resp['asset_id'], {
            asks: resp['asks'].map((v: {price: string, size: string}) => [new Number(v.price), new Number(v.size)]),
            bids: resp['bids'].map((v: {price: string, size: string}) => [new Number(v.price), new Number(v.size)]),
          })
        }
      };
    })
    this.ws.on("error", (err) => {
      this.wsActive = false
      console.log("ws err, reconnecting: ", err)
      this.startWs()
    })
  }

  constructor() {
    this.startWs()
  }

  public setMarketData(data: pmMarketData[]) {
    var active = data.filter(v => v.active)
    var activeAndNew = active.filter(v => !this.marketData.has(v.question_id))
    active.forEach(v => this.marketData.set(v.question_id, v))

    var tradableTokens: string[] = []

    activeAndNew.forEach(v => {
      if (!v.accepting_orders || v.closed) {
        v.tokens.forEach(v => {
          this.orderBooks.set(v.token_id, null)
        })
      } else {
        tradableTokens.push(...v.tokens.map(v => v.token_id))
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
                console.log("Positions: ", this.positions.get(token))
              }
            }
          }
        }).catch(err => {
          console.log("error in api-holders at condition id", v.condition_id, ": ", err)
        }))

        this.pushClientRequest(fetch("https://polyclob.openpredict.org/live-activity/events/" + v.condition_id), resp => resp.json().then((trades: any) => {
          if (trades instanceof Array) {
            for (var i = 0; i < trades.length; i++) {
              var trade: any = trades[i];
              if (trade != null && trade['event_type'] === "TRADE") {
                var market = trade['market'];
                var user = trade['user'];
                var side = trade['side'];
                var size = trade['size'];
                var price = trade['price'];
                var timestamp_str = trade['timestamp'];
                var asset_id = market['asset_id'];
                if (market != null && user != null && side != null && size != null && price != null && timestamp_str != null && asset_id != null) {
                  var fulltrade: pmTokenFilledOrder = {
                    maker: user['proxyAddress'],
                    price: Number(price),
                    size: Number(size),
                    ts: Number(timestamp_str),
                    taker: undefined,
                  }
                  this.users.set(user['proxyAddress'], {
                    name: user['name'],
                    profileImage: user['profileImage'],
                  })
                  if (this.filledOrders.has(asset_id)) {
                    this.filledOrders.set(asset_id, [...this.filledOrders.get(asset_id)!, fulltrade])
                  } else {
                    this.filledOrders.set(asset_id, [fulltrade])
                  }
                }
              }
            }
          }
        }).catch(err => {
          console.log("error in live-activity at condition id", v.condition_id, ": ", err)
        }))
      }
    })

    tradableTokens = [...(new Set(tradableTokens))]
    if (tradableTokens.length > 0) {
      console.log("New tokens: ", tradableTokens)
      if (this.wsActive) {
        this.ws.send(JSON.stringify({
          auth: {},
          type: "market",
          markets: [] as string[],
          assets_ids: tradableTokens,
        }))
      }

      for (var i = 0; i < tradableTokens.length; i++) {
        var t = tradableTokens[i];

        this.pushClientRequest(pmclient.getOrderBook(t), async (sum) => {
          if (!("error" in sum) && sum.asks != null && sum.bids != null) {
            this.orderBooks.set(t, {
              asks: sum.asks.map(v => [Number(v.price), Number(v.size)]),
              bids: sum.bids.map(v => [Number(v.price), Number(v.size)]),
            })
            console.log("order book for ", t, ":", this.orderBooks.get(t));
          }
        })
      }
    }
  }

  public searchMarkets(options: {
    term?: string,
    limit?: number,
    tradable?: boolean,
    orderBy: "volume" | "recent",
  }): {
    markets: pmMarketFulldata[],
    users: pmUserMap,
  } {
    if (options.limit == null) {
      options.limit = 50;
    }
    var marketData: pmMarketData[] = []
    const iter = pmChainCache.marketData.values();
    while (true) {
      const nxt = iter.next();
      if (nxt.done) {
        break;
      } else {
        marketData.push(
          nxt.value,
        )
      }
    }
    if (options.term != null) {
      marketData = marketData.filter(v => v.question.includes(options.term!))
    }
    if (options.tradable != null) {
      marketData = marketData.filter(v => options.tradable == !v.closed);
    }
    if (options.orderBy != null) {
      switch (options.orderBy) {
        case "volume":
          break;
        case "recent":
          marketData.sort((a, b) => {
            return (new Date(a.end_date_iso)).getTime() - (new Date(b.end_date_iso)).getTime();
          });
          break;
      }
    }
    var userMap = new Map()
    const addUser = (address: string) => {
      if (!userMap.has(address) && this.users.has(address)) {
        userMap.set(address, this.users.get(address)!)
      }
    }
    return {
      users: userMap,
      markets: marketData.map(data => {
        return {
          data: data,
          orderdata: new Map(data.tokens.map(t => t.token_id).map(t => {
            var _filledOrders: any[] = []
            if (this.filledOrders.has(t)) {
              var __filledOrders = this.filledOrders.get(t)!;
              __filledOrders.forEach(v => {
                if (v.taker != null) {
                  addUser(v.taker);
                }
                addUser(v.maker);
              })
              _filledOrders = __filledOrders;
            }

            var _positions: any[] = []
            if (this.positions.has(t)) {
              var __positions = this.positions.get(t)!;
              [...__positions.entries()].forEach(([k, v]) => {
                addUser(k)
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
      })
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
  while (markets.next_cursor != "LTE=") {
    markets = await pmclient.getMarkets(markets.next_cursor);
    if (markets.data == null || markets.data.length == 0) {
      break;
    }
    global.pmChainCache.setMarketData(markets.data)
  }
}
