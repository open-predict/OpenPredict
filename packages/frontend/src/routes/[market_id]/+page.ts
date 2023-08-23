import SuperJSON from 'superjson';
import {btrpcc} from '../../lib/btrpc.js';
import type {marketFulldata} from '@am/backend/types/market.js';
import type {TUser} from '@am/backend/types/user.js';

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
  console.log(params, params.market_id.length)

  var marketRes
  try {
    marketRes = await btrpcc.getMarket.query({
      id: params.market_id,
    })
  } catch (err) {
    console.log("error getting market in trpc: ", err)
    return null
  }

  var commentsRes
  try {
    commentsRes = await btrpcc.listComments.query({
      ammAddress: params.market_id,
    })
  } catch (err) {
    console.log("error listing comments in trpc: ", err)
    return null
  }
  if (commentsRes.comments) commentsRes.comments.reverse()

  var users
  try {
    users = marketRes.resp?.users ? await btrpcc.getUser.query({
      userId: Array.from(marketRes.resp?.users.keys())
    }) : undefined;
  } catch (err) {
    console.log("error listing comments in trpc: ", err)
    return null
  }

  const data: TMarketIdPageData = {
    id: params.market_id,
    marketData: marketRes.resp ?? undefined,
    users: users,
    commentsRes: commentsRes
  }

  return SuperJSON.serialize(data);
}
