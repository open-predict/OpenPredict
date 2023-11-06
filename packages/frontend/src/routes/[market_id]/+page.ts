import type { marketFulldata } from '@am/backend/types/market.js';
import type { pmMarketFulldata } from '@am/backend/types/market.js';
import { superjson } from '$lib/superjson.js';
import { api } from '$lib/api.js';
import type { TComment, TUsers } from '$lib/types.js';

export type TMarketIdPageData = {
  id: string,
  pmMarket?: pmMarketFulldata,
  opMarket?: marketFulldata,
  pmUsers?: any,
  opUsers?: TUsers,
  comments?: TComment[],
  likes?: Buffer[]
}

export async function load({ params }) {

  let data: TMarketIdPageData = {
    id: params.market_id ?? "",
  }

  if (params.market_id.startsWith("0x")) {
    const res = await api.getPmMarket.query({ condition_id: params.market_id });
    if(res.data !== null){
      data.pmMarket = res.data ?? undefined;
      data.comments = res.comments;
      data.pmUsers = res.pmUsers;
      data.likes = res.likes.map(l => l.userKey);
    }
  } else {
    const res = await api.getMarket.query({ id: params.market_id });
    if(res.resp !== null){
      data.opMarket = res.market;
      data.comments = res.comments;
      // data.opUsers = res.users;
      data.likes = res.likes.map(l => l.userKey);
    }
  }

  return superjson.serialize(data);
}
