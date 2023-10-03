import SuperJSON from 'superjson';
import type {marketFulldata, pmMarketData} from '@am/backend/types/market.js';
import type {TUser} from '@am/backend/types/user.js';
import { browser } from '$app/environment';
import type { TBooks } from '../+page.js';

export type TMarketIdPageData = {
  id: string,
  pmMarket?: {
    data: pmMarketData,
    book: TBooks
  },
  market?: {
    marketData?: marketFulldata;
    users?: Map<string, { username: string | null; }> | null,
    commentsRes: {
      comments: {
        createdAt: Date;
        userKey: string;
        content: string;
      }[];
      users: Map<string, TUser | null>;
    }
  }
}

export async function load({params}) {

  const trpc = browser 
    ? (await import("$lib/trpc.js")).trpcc 
    : (await import("$lib/btrpc.js")).btrpc;

  const data: TMarketIdPageData = {
    id: params.market_id ?? ""
  }

  try {
    var resp = (await trpc.getMarket.query({
      id: params.market_id,
    })).resp
    if(resp?.market){
      data.market = {
        marketData: undefined, 
        users: new Map(),
        commentsRes: {
          comments: [], 
          users: new Map()
        }
      };
      data.market.marketData = resp.market.market ? resp.market.market : undefined;
      data.market.users = resp.market.users
    } else if (resp?.pmMarket) {
      data.pmMarket = {
        data: resp.pmMarket[0],
        book: resp.pmMarket?.[1]
      }
    }
  } catch (err) {
    console.log("trpc error (market_id): ", err)
    return SuperJSON.serialize(data)
  }

  // try {
  //   data.commentsRes = await trpc.listComments.query({
  //     ammAddress: params.market_id,
  //   })
  // } catch (err) {
  //   console.log("error listing comments in trpc: ", err)
  //   return SuperJSON.serialize(data)
  // }

  // if (data.commentsRes.comments) data.commentsRes.comments.reverse()

  // try {
  //   data.users = data.marketData?.users ? await trpc.getUser.query({
  //     userId: Array.from(data.marketData?.users.keys())
  //   }) : undefined;
  // } catch (err) {
  //   console.log("error listing comments in trpc: ", err)
  //   return SuperJSON.serialize(data)
  // }

  return SuperJSON.serialize(data);
}
