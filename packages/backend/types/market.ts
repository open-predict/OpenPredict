import {z} from "zod";
import * as web3 from "@solana/web3.js"
import {PriceHistoryInterval} from "@polymarket/clob-client";

export const getPmMarket = z.object({
  condition_id: z.string()
})

export const searchMarketsSchemaV0 = z.object({
  term: z.string().optional(),
  skip: z.number().optional(),
  limit: z.number().optional(),
  orderBy: z.enum(["recent", "volume"]).optional(),
})

export const getMarketSchemaV0 = z.object({
  id: z.string().min(32).max(44),
})

export const getPmPriceHistorySchemaV0 = z.object({
  interval: z.enum([
    PriceHistoryInterval.ONE_HOUR,
    PriceHistoryInterval.SIX_HOURS,
    PriceHistoryInterval.ONE_DAY,
    PriceHistoryInterval.ONE_WEEK,
    PriceHistoryInterval.MAX,
  ]),
  start: z.date(),
  end: z.date().optional(),
  asset_id: z.string(),
})

export const likeMarketSchemaV0 = z.object({
  openPredictMarketAddress: z.string().min(32).max(44),
  polymarketConditionId: z.undefined(),
  liked: z.boolean(),
}).or(z.object({
  openPredictMarketAddress: z.undefined(),
  polymarketConditionId: z.string().max(44),
  liked: z.boolean(),
}))

export const getUserProfilesSchemaV0 = z.object({
  userId: z.string().min(32).max(44).array(),
})

export const getUserMarketsSchemaV0 = z.object({
  userId: z.string().min(32).max(44),
})

export const getMarketAccountsSchemaV0 = z.object({
  userId: z.string().min(32).max(44),
})

export const listCommentsSchemaV0 = z.object({
  openPredictMarketAddress: z.string().min(32).max(44),
  polymarketConditionId: z.undefined(),
}).or(z.object({
  openPredictMarketAddress: z.undefined(),
  polymarketConditionId: z.string().max(44),
}))

export const commentSchemaV0 = z.object({
  openPredictMarketAddress: z.string().min(32).max(44),
  polymarketConditionId: z.undefined(),
  content: z.string().max(2000),
}).or(z.object({
  openPredictMarketAddress: z.undefined(),
  polymarketConditionId: z.string().min(16).max(44),
  content: z.string().max(2000),
}))

export const loginSchemaV0 = z.object({
  signedTx: z.number().array(),
})

export const login2SchemaV0 = z.object({
  key: z.string().min(32).max(44),
  signature: z.number().array(),
  message: z.number().array(),
})

export const getChallengeTxSchemaV0 = z.object({})


export const marketMetadataSchemaV0 = z.object({
  version: z.number().min(0).max(0),
  title: z.string().min(2).max(200),
  description: z.string().min(0).max(2000)
})

export const marketMetadataSchema2V0 = z.object({
  ammAddress: z.number().array().length(16),
  meta: marketMetadataSchemaV0,
})

export type TMarketMetadataSchemaV0 = z.infer<typeof marketMetadataSchemaV0>;

export type TComment = {
  "content": string
  "createdAt": Date
  "userKey": string
}

//PM markets

export type pmMarketFulldata = {
  data: pmMarketData,
  orderdata: Map<string, pmTokenOrderdata>,
  meta: pmMarketSummarydata,
}

export type pmMarketSummarydata = {
  volume: BigInt,
}

export type pmUserMap = Map<string, {
  name: string,
  profileImage: string,
}>

export type pmTokenPriceHistoryPoint = {
  t: number,
  price: number,
}

export type pmTokenOrderdata = {
  book: pmTokenOrderBook,

  filledOrders: pmTokenFilledOrder[]

  positions: pmTokenPosition[],

}

export type pmTokenOrderBook = {
  asks: [number, number][],
  bids: [number, number][],
}

export type pmTokenFilledOrder = {
  ts: number,
  maker: string,
  taker: string | undefined,
  size: number,
  side: string,
  price: number,
}

export type pmTokenPosition = {
  address: string,
  position: number,
}

export type pmMarketData = {
  condition_id: string,
  question_id: string,
  tokens: pmTokenData[],

  active: boolean,
  closed: boolean,

  question: string,
  description: string,

  end_date_iso: string,

  categories: string[],
  parent_categories: string[],

  icon: string,
  image: string,

  fpmm: string,
  accepting_orders: boolean,
}

export type pmTokenData = {
  token_id: string,
  outcome: string,
  winner: boolean | undefined,
}

//SOL markets

export type marketFulldata = {
  data: extMarketChaindata,
  metadata: TMarketMetadataSchemaV0 | null,
}

export type extMarketChaindata = {
  data: marketChaindata,
  UserAccounts: Map<string, marketUserChaindata>
  PriceHistory: marketPricePoint[]
  Trades: marketTradeChaindata[]
}

export type marketPricePoint = {
  Yes: bigint,
  No: bigint,
  Subsidy: bigint,
  At: Date,
}

export type marketChaindata = {
  Version: 1,
  Resolved: boolean | null,
  Subsidy: bigint,
  Yes: bigint,
  No: bigint,
  IPFS_Cid: Buffer,
  OperatorKey: web3.PublicKey,
  AmmAddress: Buffer,
}

export type marketUserChaindata = {
  Version: 1,
  Shares: bigint,
}

export type marketTradeChaindata = {
  slot: number,
  blockTime: number,

  microUSDC: bigint,
  direction: Boolean,
  expectedShares: bigint,
  drift: bigint,
}

export type profileChaindata = {
  Version: 1,
  IPFS_Cid: Buffer,
  UserKey: web3.PublicKey,
}
