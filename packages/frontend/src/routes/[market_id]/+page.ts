import type { marketFulldata } from '@am/backend/types/market.js';
import type { pmMarketFulldata } from '@am/backend/types/market.js';
import { superjson } from '$lib/superjson.js';
import { api } from '$lib/api.js';
import type { TComment, TUsers } from '$lib/types.js';

export type TMarketIdPageData = {
  id: string,
  pmMarket?: pmMarketFulldata,
  opMarket?: marketFulldata,
  users?: TUsers,
  comments?: TComment[],
  likes?: string[]
}

export async function load({ params }) {

  // const trpc = browser
  //   ? (await import("$lib/trpc.js")).trpcc
  //   : (await import("$lib/btrpc.js")).btrpc;

  let data: TMarketIdPageData = {
    id: params.market_id ?? "",
  }

  if (params.market_id.startsWith("0x")) {
    const res = await api.getPmMarket.query({ condition_id: params.market_id });
    data.pmMarket = res.data.data;
    data.comments = res.comments;
    data.users = res.data.users;
    data.likes;
  } else {
    const res = await api.getMarket.query({ id: params.market_id });
    data.opMarket = res.market;
    data.comments = res.comments;
    data.users = res.users;
    data.likes;
  }

  return superjson.serialize(data);
}
