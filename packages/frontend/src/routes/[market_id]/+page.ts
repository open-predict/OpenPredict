import type { marketFulldata } from '@am/backend/types/market.js';
import type { TComments, TPmMarket, TUsers } from '$lib/types.js';
import { getComments, getMarket, users } from '$lib/api.js';
import { superjson } from '$lib/superjson.js';

export type TMarketIdPageData = {
  id: string,
  pmMarket?: TPmMarket,
  opMarket?: marketFulldata,
  users: TUsers,
  comments: TComments
}

export async function load({ params }) {

  // const trpc = browser
  //   ? (await import("$lib/trpc.js")).trpcc
  //   : (await import("$lib/btrpc.js")).btrpc;

  const data: TMarketIdPageData = {
    id: params.market_id ?? "",
    users,
    comments: params.market_id ? await getComments(params.market_id) : [],
  }

  const response = await getMarket(params.market_id);
  if(response.opMarket){
    data.opMarket = response.opMarket
  } else if (response.pmMarket){
    data.pmMarket = response.pmMarket
  }
  
  return superjson.serialize(data);
}
