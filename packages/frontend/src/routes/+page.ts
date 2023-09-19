import SuperJSON from 'superjson';
import {trpcc} from '../lib/trpc.js';
import type {marketFulldata} from '@am/backend/types/market';
import type {TUser} from '@am/backend/types/user';

export const ssr = false;

export type TPageData = {
  searchResponse: {
    markets: marketFulldata[];
    users: Map<string, TUser | null>;
  }
}

export async function load() {
  var data: TPageData = {
    searchResponse: {
      markets: [],
      users: new Map(),
    }
  }

  try {
    data.searchResponse = (await trpcc.searchMarkets.query({
      term: "",
      limit: 10,
    })).opMarkets;
  } catch (err) {
    console.log("Couldn't search markets: ", err)
  }

  return SuperJSON.serialize(data);
}
