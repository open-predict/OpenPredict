import type { marketFulldata } from '@am/backend/types/market.js';
import type { pmMarketFulldata } from '@am/backend/types/market.js';
import { superjson } from '$lib/superjson.js';
import { api } from '$lib/api.js';
import type { TComment, TOpMarket, TPmMarket, TUsers } from '$lib/types.js';

export type TMarketIdPageData = {
  id: string,
  pmMarket?: TPmMarket,
  opMarket?: TOpMarket,
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
      data.pmMarket = {...res.data, likeNo: res.likes.length, commentNo: res.comments.length}
      data.comments = res.comments;
      data.pmUsers = res.pmUsers;
      data.opUsers = res.opUsers;
      data.likes = res.likes.map(l => l.userKey);
    }
  } else {
    const res = await api.getMarket.query({ id: params.market_id });
    if(res.market !== null){
      data.opMarket = {...(res.market as marketFulldata), likeNo: res.likes?.length ?? 0, commentNo: res.comments?.length ?? 0};
      data.comments = res.comments;
      // data.opUsers = res.users;
      data.likes = res.likes?.map(l => l.userKey) ?? []
    }
  }

  return superjson.serialize(data);
}
