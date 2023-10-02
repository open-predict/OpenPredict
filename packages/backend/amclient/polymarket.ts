import { Chain, ClobClient } from "@polymarket/clob-client";
import { pmMarketData } from "../types/market.js";
import { WebSocket } from "ws";

declare global {
  var pmChainCache: {
    markets: Map<string, pmMarketData>,
    assetBooks: Map<string, {
      asks: [number, number][],
      bids: [number, number][],
    }>
  }
}

export async function startAndMaintainPmList() {
  global.pmChainCache = {
    markets: new Map(),
    assetBooks: new Map(),
  }
  const env_url = process.env.CLOB_HOST || "https://polyclob.openpredict.org";
  const client = new ClobClient(env_url, Chain.POLYGON);
  var markets = await client.getMarkets()
  markets.data.forEach(v => global.pmChainCache.markets.set(v.condition_id, v))
  while (markets.next_cursor != "LTE=") {
    markets = await client.getMarkets(markets.next_cursor);
    if (markets.data == null || markets.data.length == 0) {
      break;
    }
    markets.data.forEach(v => global.pmChainCache.markets.set(v.condition_id, v))
  }
  var found = false;
  for (var market of globalThis.pmChainCache.markets.values()) {
    if (!market.active || !market.closed) {
      console.log("Non-active+closed market:", market)
      found = true;
    }
  }
  console.log("Found !active || !closed market: ", found)
  const ws_env_url = process.env.CLOB_WS_HOST || "wss://polyclob-ws.openpredict.org";
  var startWs = () => {
    var asset_ids: string[] = [...global.pmChainCache.markets.values()].filter(v => v.active == true).reduce((prev, cur) => [...prev, ...cur.tokens.map(v2 => v2.token_id)], <string[]>[]);
    let ws = new WebSocket(`${ws_env_url}/market`); // change to market for market, user for user
    console.log("Opened new PM websocket")
    ws.on("open", () => {
      ws.send(JSON.stringify({
        auth: {},
        type: "market",
        markets: [] as string[],
        assets_ids: asset_ids,
      }))
      setInterval(() => {
        ws.send("PING")
      }, 5000)
      ws.onmessage = function (msg: any) {
        var resp: any
        try {
          resp = JSON.parse(msg.data)
        } catch {
          return;
        }
        console.log("PM update: ", resp);
        if (resp['event_type'] == 'book') {
          globalThis.pmChainCache.assetBooks.set(resp['asset_id'], {
            asks: resp['asks'].map((v: {price: string, size: string}) => [new Number(v.price), new Number(v.size)]),
            bids: resp['bids'].map((v: {price: string, size: string}) => [new Number(v.price), new Number(v.size)]),
          })
        }
      };
    })
    ws.on("error", (err) => {
      console.log("ws err, reconnecting: ", err)
      startWs()
    })
  }
  startWs()
}

export function searchPmMarkets(options: {
  term?: string,
  limit?: number,
  tradable?: boolean,
  orderBy: "volume" | "recent",
}): {
  markets: pmMarketData[]
  assetBooks: Map<string, {
    asks: [number, number][],
    bids: [number, number][],
  }>
} {
  if (options.limit == null) {
    options.limit = 50;
  }
  var ret: pmMarketData[] = []
  const iter = pmChainCache.markets.values();
  while (true) {
    const nxt = iter.next();
    if (nxt.done) {
      break;
    } else {
      ret.push(
        nxt.value,
      )
    }
  }
  if (options.term != null) {
    ret = ret.filter(v => v.question.includes(options.term!))
  }
  if (options.tradable != null) {
    ret = ret.filter(v => options.tradable == !v.closed);
  }
  if (options.orderBy != null) {
    switch (options.orderBy) {
      case "volume":
        break;
      case "recent":
        ret.sort((a, b) => {
          return (new Date(a.end_date_iso)).getTime() - (new Date(b.end_date_iso)).getTime();
        });
        break;
    }
  }
  var ret2 = new Map()
  ret.forEach(v => {
    v.tokens.forEach(v => {
      var book = globalThis.pmChainCache.assetBooks.get(v.token_id)
      if (book != null) {
        ret2.set(v.token_id, book)
      }
    })
  })
  return {
    markets: ret,
    assetBooks: ret2,
  };
}
