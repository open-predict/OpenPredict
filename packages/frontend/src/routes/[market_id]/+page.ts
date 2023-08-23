import SuperJSON from 'superjson';
import {btrpcc} from '../../lib/btrpc.js';
import type {marketFulldata} from '@am/backend/types/market.js';
import type {TUser} from '@am/backend/types/user.js';
import { browser } from '$app/environment';
import { trpcc } from '$lib/trpc.js';

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
    if(browser){
      marketRes = await trpcc.getMarket.query({
        id: params.market_id,
      })
    } else {
      marketRes = await btrpcc.getMarket.query({
        id: params.market_id,
      })
    }
  } catch (err) {
    console.log("error getting market in trpc: ", err)
    return null
  }

  var commentsRes
  try {
    if(browser){
      commentsRes = await trpcc.listComments.query({
        ammAddress: params.market_id,
      })
    } else {
      commentsRes = await btrpcc.listComments.query({
        ammAddress: params.market_id,
      })
    }
  } catch (err) {
    console.log("error listing comments in trpc: ", err)
    return null
  }
  if (commentsRes.comments) commentsRes.comments.reverse()

  var users
  try {
    if(browser){
      users = marketRes.resp?.users ? await trpcc.getUser.query({
        userId: Array.from(marketRes.resp?.users.keys())
      }) : undefined;
    } else {
      users = marketRes.resp?.users ? await btrpcc.getUser.query({
        userId: Array.from(marketRes.resp?.users.keys())
      }) : undefined;
    }
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
