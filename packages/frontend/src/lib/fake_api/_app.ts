import type { marketFulldata, pmUserMap, marketUserChaindata } from '@am/backend/types/market';
import { faker } from '@faker-js/faker';
import { PublicKey } from '@solana/web3.js';
import type { TUser } from '@am/backend/types/user';
import type { CreateAccountResult, MarketSearchResult } from '@am/backend/server/routers/_app';
import { commentSchemaV0, getChallengeTxSchemaV0, getMarketAccountsSchemaV0, getPmMarket, getPmPriceHistorySchemaV0, getUserMarketsSchemaV0, getUserProfilesSchemaV0, likeMarketSchemaV0, listCommentsSchemaV0, login2SchemaV0, marketMetadataSchema2V0, marketMetadataSchemaV0 } from '@am/backend/types/market.js';
import { makeUsdcWalletSchemaV0, payUserTransactionSchemaV0, userMetadataSchemaV0, usernameAvailableCheckSchemaV0 } from '@am/backend/types/user.js';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import * as data from "./data";
import { randomBytes } from 'ethers6';
import * as z from "zod";

const t = initTRPC.context().create({
  allowOutsideOfServer: true,
  transformer: superjson,
})

// Base router and procedure helpers
const router = t.router;
const procedure = t.procedure;

export const fakeAppRouter = router({

  makeUsdcWallet: procedure.input(
    makeUsdcWalletSchemaV0,
  ).query(async (opts) => {
    let result: CreateAccountResult = {};
    const error = faker.datatype.boolean();
    if (error) {
      result.error = Error("FAKE error creating usdc wallet")
    } else {
      result.address = data.randomSolanaAddress()
      result.mint = data.randomSolanaAddress()
    }
    return result;
  }),

  sendOpenPredictTransaction: procedure.input(
    payUserTransactionSchemaV0,
  ).query(async (opts) => {
    if (faker.datatype.boolean()) {
      return {
        tx_id: data.randomEvmAddress()
      }
    } else {
      return {
        error: "FAKE error sending transaction"
      }
    }
  }),

  like: procedure.input(
    likeMarketSchemaV0,
  ).query(async (opts) => {
    if (faker.datatype.boolean()) {
      return {}
    } else {
      return {
        error: "FAKE liking market"
      }
    }
  }),

  checkUsername: procedure.input(
    usernameAvailableCheckSchemaV0,
  ).query(async (opts) => {
    return faker.datatype.boolean()
  }),

  getUser: procedure.input(
    getUserProfilesSchemaV0,
  ).query(async (opts) => {
    var ret = new Map<string, TUser>();
    ret = Array.from(data.users.entries()).slice(0, opts.input.userId.length).reduce((acc, val) => { acc.set(val[0], val[1]); return acc; }, new Map<string, TUser>())
    return ret;
  }),

  getUserMarkets: procedure.input(
    getUserMarketsSchemaV0,
  ).query(async (opts) => {
    const map = data.opMarkets.reduce((acc, val) => { acc.set(new PublicKey(val.data.data.AmmAddress).toBase58(), val); return acc }, new Map<string, marketFulldata>())
    return map
  }),

  getPmPriceHistory: procedure.input(
    getPmPriceHistorySchemaV0,
  ).query(async (opts) => {
    return data.pmTokenPricePoints
  }),

  getMarketAccounts: procedure.input(
    getMarketAccountsSchemaV0,
  ).query(async (opts) => {
    return data.opMarkets.reduce((acc, val) => {
      acc.set(new PublicKey(val.data.data.AmmAddress).toBase58(), { account: Array.from(val.data.UserAccounts.values())[0], market: val })
      return acc;
    }, new Map<string, {
      market: marketFulldata,
      account: marketUserChaindata,
    }>())
  }),

  listComments: procedure.input(
    listCommentsSchemaV0
  ).query(async (opts) => {
    const comments = data.comments;
    return {
      comments: comments.map(v => {
        return {
          createdAt: v.createdAt,
          userKey: v.userKey,
          content: v.content,
        }
      }),
      users: data.users,
    }
  }),

  comment: procedure.input(
    commentSchemaV0,
  ).mutation(async (opts) => {
    if (faker.datatype.boolean()) {
      return {}
    } else {
      return {
        error: "FAKE error can't comment"
      }
    }
  }),

  login2: procedure.input(
    login2SchemaV0,
  ).mutation(async (opts) => {
    if (faker.datatype.boolean()) {
      return {}
    } else {
      return {
        error: "FAKE error can't login"
      }
    }
  }),

  getLoginChallenge: procedure.input(
    getChallengeTxSchemaV0,
  ).mutation(async (_) => {
    const challenge = Buffer.from(randomBytes(32)).toString('hex')
    return {
      challenge: challenge,
    };
  }),

  storeUserProfileIpfs: procedure.input(
    userMetadataSchemaV0,
  ).mutation(async (opts) => {
    const cid = randomBytes(32)
    return {
      cid,
    }
  }),

  storeMarketPrivate: procedure.input(
    marketMetadataSchema2V0,
  ).mutation(async (opts) => {
    return {}
  }),

  storeMarketIpfs: procedure.input(
    marketMetadataSchemaV0
  ).mutation(async (opts) => {
    const cid = randomBytes(32)
    return {
      cid,
    }
  }),

  searchMarkets: procedure.input(
    z.object({
      term: z.string().nullable(),
      skip: z.number().nullable(),
      limit: z.number().nullable(),
    }),
  ).query(async (opts) => {
    const results: MarketSearchResult[] = [];
    data.opMarkets.forEach(market => {
      results.push({
        numNativeLikes: market.data.Likes.size,
        numNativeComments: market.data.CommentCount,
        opMarket: market
      })
    })

    data.pmMarkets.forEach(market => {
      results.push({
        numNativeComments: faker.datatype.number({ min: 0, max: 20 }),
        numNativeLikes: faker.datatype.number({ min: 0, max: 20 }),
        pmMarket: market
      })
    })

    return <{
      markets: MarketSearchResult[],
      opUsers: Map<string, TUser>,
      pmMarketUsers: pmUserMap,
    }>{
        markets: results,
        opUsers: data.users,
        pmMarketUsers: data.pmUsers,
      }
  }),

  getMarket: procedure.input(
    z.object({
      id: z.string().min(32).max(44),
    }),
  ).query(async (opts) => {
    return {
      market: data.opMarkets[0],
      comments: data.comments,
      users: data.users,
      likes: Array.from(data.users.keys())
    }
  }),

  getPmMarket: procedure.input(
    getPmMarket,
  ).query(async (opts) => {
    return {
      market: data.pmMarkets[0] ?? undefined,
      data: {
        userM: data.pmUsers,
        data: data.pmMarkets[0]
      },
      comments: data.comments,
      likes: Array.from(data.users.keys())
    }
  }),

});

export type FakeAppRouter = typeof fakeAppRouter