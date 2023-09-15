import SuperJSON from 'superjson';
import {trpcc} from '../../lib/trpc.js';
import type {marketFulldata} from '@am/backend/types/market.js';
import type {TUser} from '@am/backend/types/user.js';

export const ssr = false;

export type TMarketIdPageData = {
  id: string,
  marketData?: {
    market: marketFulldata;
    users: Map<string, {
      username: string | null;
    }>;
  },
  users?: Map<string, TUser>,
  commentsRes: {
    comments: {
      createdAt: Date;
      userKey: string;
      content: string;
    }[];
    users: Map<string, TUser | null>;
  }
}

export async function load({params}) {

  const data: TMarketIdPageData = {
    id: params.market_id ?? "",
    marketData: undefined,
    users: undefined,
    commentsRes: {
      comments: [],
      users: new Map(),
    },
  }

  console.log(params, params.market_id.length)

  try {
    var marketData = (await trpcc.getMarket.query({
      id: params.market_id,
    })).resp
    data.marketData = marketData != null ? marketData : undefined;
  } catch (err) {
    console.log("error getting market in trpc: ", err)
    return SuperJSON.serialize(data)
  }

  try {
    data.commentsRes = await trpcc.listComments.query({
      ammAddress: params.market_id,
    })
  } catch (err) {
    console.log("error listing comments in trpc: ", err)
    return SuperJSON.serialize(data)
  }
  if (data.commentsRes.comments) data.commentsRes.comments.reverse()

  try {
    data.users = data.marketData?.users ? await trpcc.getUser.query({
      userId: Array.from(data.marketData?.users.keys())
    }) : undefined;
  } catch (err) {
    console.log("error listing comments in trpc: ", err)
    return SuperJSON.serialize(data)
  }

  return SuperJSON.serialize(data);
}
