import { api } from '$lib/api';
import { superjson } from '$lib/superjson';
import type { MarketSearchResult } from '@am/backend/server/routers/_app';
import type { pmUserMap } from '@am/backend/types/market';
import type { TUser } from '@am/backend/types/user';

export type TPageData = {
  error?: any,
  markets?: MarketSearchResult[];
  opUsers?: Map<string, TUser | null>;
  pmMarketUsers?: pmUserMap;
}

export const ssr = true;

export async function load() {
  const data: TPageData = {}

  await api.searchMarkets.query({
    "orderBy": "recent", 
    "limit": 10, 
    "term": "", 
    "skip": 0
  }).then(r => {
    // data
  }).catch((e: any) => {
    console.error(e);
    data.error = e
  
  })


  console.log("data",data)

  if (data.markets) {
    data.markets.sort((a, b) => Number(b.numNativeLikes - a.numNativeLikes))
  }

  return superjson.serialize(data);
}