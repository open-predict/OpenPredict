import SuperJSON from 'superjson';
import { trpcc } from '../lib/trpc.js';
import type { marketFulldata, pmMarketData } from '@am/backend/types/market';
import type { TUser } from '@am/backend/types/user.js';

export const ssr = false;

export type TPageData = {
  searchResponse: {
    opMarkets: {
      markets: marketFulldata[];
      users: Map<string, TUser | null>;
    },
    pmMarkets: {
      markets: pmMarketData[]
      books: any
    }
  }
}

export async function load() {
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
    data.searchResponse = (await trpcc.searchMarkets.query({
      term: "",
      limit: 10,
    }))
  } catch (err) {
    console.log("Couldn't search markets: ", err)
  }

  return SuperJSON.serialize(data);
}