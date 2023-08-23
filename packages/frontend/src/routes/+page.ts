import SuperJSON from 'superjson';
import {btrpcc} from '../lib/btrpc.js';
import type {marketFulldata} from '@am/backend/types/market';
import type {TUser} from '@am/backend/types/user';
import { browser } from '$app/environment';
import { trpcc } from '$lib/trpc.js';

export type TPageData = {
  searchResponse: {
    markets: marketFulldata[];
    users: Map<string, TUser | null>;
  }
}

export async function load({params: any}) {
  var data: TPageData = {
    searchResponse: {
      markets: [],
      users: new Map(),
    }
  }

  try {
    if(browser){
      data.searchResponse = await trpcc.searchMarkets.query({
        term: "",
        limit: 10,
      });
    } else {
      data.searchResponse = await btrpcc.searchMarkets.query({
        term: "",
        limit: 10,
      });
    }
  } catch (err) {
    console.log(err)
  }

  return SuperJSON.serialize(data);
}
