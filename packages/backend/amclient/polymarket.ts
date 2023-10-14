import {Chain, ClobClient} from "@polymarket/clob-client";
import {pmMarketData, pmMarketFulldata} from "../types/market.js";
import {WebSocket} from "ws";
import fetch from "node-fetch";

const pmclient = new ClobClient(process.env.CLOB_HOST || "https://polyclob.openpredict.org", Chain.POLYGON);

class PmChainCache {
  marketData: Map<string, pmMarketData> = new Map()

  priceHistory: Map<string, {
    ts: number,
    price: number,
  }[] | null> = new Map()

  filledOrders: Map<string, {
    ts: number,
    maker: string,
    taker: string,
    size: BigInt,
    price: number,
  }[]> = new Map()

  positions: Map<string, Map<string, {
    name: string,
    position: number, //Dollars
    profileImage: string,
  }> | null> = new Map()

  orderBooks: Map<string, {
    asks: [number, number][],
    bids: [number, number][],
  } | null> = new Map()

  ws = new WebSocket(`${process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org"}/market`)
  wsActive = false

  clientRequestNeck: Promise<void>[] = []
  usingClientRequestNeck = false

  private async drainClientRequests() {
    if (!this.usingClientRequestNeck) {
      this.usingClientRequestNeck = true
      while (this.clientRequestNeck.length > 0) {
        const idx = await Promise.race(this.clientRequestNeck.slice(0, 10).map((v, i) => v.catch(_ => {}).then(_ => i)))
        this.clientRequestNeck = [...this.clientRequestNeck.slice(0, idx), ...this.clientRequestNeck.slice(idx + 1)]
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

    var prom: Promise<void>[] = []
    activeAndNew.forEach(v => {
      if (!v.accepting_orders || v.closed) {
        v.tokens.forEach(v => {
          this.orderBooks.set(v.token_id, null)
        })
      } else {
        tradableTokens.push(...v.tokens.map(v => v.token_id))
        prom.push(fetch("https://polymarket.openpredict.org/api/holders?conditionId=" + v.condition_id).then(resp => resp.json()).then((resp) => {
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
                this.positions.set(token, new Map(holders.map((v: any) => [v.proxyWallet, {
                  profileImage: v.profileImage,
                  name: v.name,
                  position: v.amount,
                }])))
                console.log("Positions: ", this.positions.get(token))
              }
            }
          }
        }).catch(err => {
          console.log("error in api-holders at condition id", v.condition_id, ": ", err)
        }))

        /*prom.push(fetch("https://polyclob.openpredict.org/live-activity/events/" + v.condition_id).then(resp => resp.json()).then((trades: any) => {
          if(trades instanceof Array) {
            var market_trades = new Map()
            for(var i = 0; i < trades.length; i++) {
              var trade: any = trades[i];
              if (trade != null && trade['event_type'] === "TRADE") {
                var market = trade['market'];
                var user = trade['user'];
                var side = trade['side'];
                var size = trade['size'];
                var price = trade['price'];
                var timestamp_str = trade['timestamp'];
                if (market != null && user != null && side != null && size != null && timestamp_str != null && market['asset_id'] != null) {
                  var asset_id = market['asset_id'];
                  var fulltrade = {
                    user: {
                      name: user['name'],
                      profileImage: user['profileImage'],
                      proxyAddress: user['proxyAddress'],
                    },
                    price: Number(trade['price']),
                    size: Number(trade['size']),
                    side: trade['side'],
                    timestamp: Number(timestamp_str),
                  }
                  if (market_trades.has(asset_id)) {
                    market_trades.set(asset_id, market_trades.get(asset_id).push(fulltrade))
                  } else {
                    market_trades.set(asset_id, [fulltrade])
                  }
                }
              }
            }
          }
        }).catch(err => {
          console.log("error in live-activity at condition id", v.condition_id, ": ", err)
        }))*/
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

        prom.push(pmclient.getOrderBook(t).then(sum => {
          if (!("error" in sum) && sum.asks != null && sum.bids != null) {
            this.orderBooks.set(t, {
              asks: sum.asks.map(v => [Number(v.price), Number(v.size)]),
              bids: sum.bids.map(v => [Number(v.price), Number(v.size)]),
            })
            console.log("order book for ", t, ":", this.orderBooks.get(t));
          }
        }))
      }
      this.clientRequestNeck.push(...prom)
    }
    if (prom.length > 0) {
      this.drainClientRequests().then(_ => {})
    }
  }

  public searchMarkets(options: {
    term?: string,
    limit?: number,
    tradable?: boolean,
    orderBy: "volume" | "recent",
  }): pmMarketFulldata[] {
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
    return marketData.map(data => {
      return {
        data: data,
        orderdata: new Map(data.tokens.map(t => t.token_id).map(t => {
          var _filledOrders = this.filledOrders.get(t)
          var _positions = this.positions.get(t)
          return [t, {
            filledOrders: _filledOrders == null ? [] : _filledOrders,
            positions: _positions == null ? [] : [..._positions.entries()].map(([k, v]) => {
              return {
                proxyWallet: k,
                ...v,
              }
            }),
            book: this.orderBooks.get(t) ?? {asks: [], bids: []},
          }]
        })),
        meta: {
          volume: BigInt(0),
        },
      }
    })
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


