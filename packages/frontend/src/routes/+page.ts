import SuperJSON from 'superjson';
import type { marketFulldata, pmMarketData } from '@am/backend/types/market';
import type { TUser } from '@am/backend/types/user.js';
import { browser } from '$app/environment';

export type TBook = {
  asks: [number, number][];
  bids: [number, number][];
}

export type TBooks = Map<string, TBook>;

export type TPageData = {
  searchResponse: {
    opMarkets: {
      markets: marketFulldata[];
      users: Map<string, TUser | null>;
    },
    pmMarkets: {
      markets: pmMarketData[]
      books: TBooks
    }
  }
}

export async function load() {

  const trpc = browser 
    ? (await import("$lib/trpc.js")).trpcc 
    : (await import("$lib/btrpc.js")).btrpc;

  var data: TPageData = {
    searchResponse: {
      opMarkets: {
        markets: [],
        users: new Map(),
      },
      pmMarkets: {
        markets: [],
        books: new Map()
      }
    }
  }

  try {
    data.searchResponse = (await trpc.searchMarkets.query({
      term: "",
      limit: 10,
    }))
  } catch (err) {
    console.log("Couldn't search markets: ", err)
  }

  return SuperJSON.serialize(data);
}