import { z } from "zod";

export const usernameAvailableCheckSchemaV0 = z.object({
	name: z.string().min(0).max(64),
})

export const checkoutWithChangenowSchemaV0 = z.object({
	publicKey: z.string(),
	amount: z.number()
})

export const makeUsdcWalletSchemaV0 = z.object({
	user: z.string(),
})

export const payUserTransactionSchemaV0 = z.object({
	transaction: z.string(),
})

export const userMetadataSchemaV0 = z.object({
	version: z.number().min(0).max(0),
	name: z.string().min(0).max(64).optional(),
	image: z.string().url().optional(),
	description: z.string().optional(),
	links: z.array(z.object({
		service: z.string().min(1).max(32),
		link: z.string().url(),
	})),
})

export type TUserMetadataSchemaV0 = z.infer<typeof userMetadataSchemaV0>;

export type TUser = {
	username: string,
	metadata: TUserMetadataSchemaV0,
}
