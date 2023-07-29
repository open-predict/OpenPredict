import {z} from "zod";
import * as web3 from "@solana/web3.js"

export const likeMarketSchemaV0 = z.object({
	ammAddress: z.string().min(32).max(44),
	liked: z.boolean(),
})

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
	ammAddress: z.string().min(32).max(44),
})

export const commentSchemaV0 = z.object({
	ammAddress: z.string().min(32).max(44),
	content: z.string().max(2000),
})

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

export type TMarketMetadataSchemaV0 = z.infer<typeof marketMetadataSchemaV0>;

export type marketFulldata = {
	data: extMarketChaindata,
	metadata: TMarketMetadataSchemaV0 | null,
}

export type extMarketChaindata = {
	data: marketChaindata,
	CommentCount: number,
	Likes: Set<string>,
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

	microUSDC: BigInt,
	direction: Boolean,
	expectedShares: BigInt,
	drift: BigInt,
}

export type profileChaindata = {
	Version: 1,
	IPFS_Cid: Buffer,
	UserKey: web3.PublicKey,
}
