import {z} from 'zod';
import {procedure, router} from '../trpc.js';
import {commentSchemaV0, extMarketChaindata, getChallengeTxSchemaV0, getMarketAccountsSchemaV0, getUserMarketsSchemaV0, getUserProfilesSchemaV0, likeMarketSchemaV0, listCommentsSchemaV0, login2SchemaV0, marketFulldata, /*loginSchemaV0,*/ marketMetadataSchemaV0, marketUserChaindata} from '../../types/market.js';
import {TUser, userMetadataSchemaV0, usernameAvailableCheckSchemaV0} from '../../types/user.js';
import {getHelia, marketByAddress, searchMarkets} from '../../amclient/index.js'; import * as nodeCache from "node-cache"
import {createHash, randomBytes} from "crypto"
import * as web3 from "@solana/web3.js"
import * as cookie from "cookie"
import * as ed25519 from "@noble/ed25519"
import * as multiformats from "multiformats"
import base58 from 'bs58';

declare global {
	var loginChallengeCache: nodeCache
};

async function getUserId(opts: any) {
	if (!opts.ctx.req.headers.cookie) {
		opts.ctx.res.statusCode = 403
		return {
			error: "Please log in"
		}
	}
	const cookies = cookie.parse(opts.ctx.req.headers.cookie!)
	if (cookies['session'] == null) {
		opts.ctx.res.statusCode = 403
		return {
			error: "Please log in"
		}
	} else {
		var session: {
			id: string,
			secret: string,
		}
		try {
			session = JSON.parse(cookies['session'])
		} catch (err) {
			opts.ctx.res.statusCode = 400
			return {
				error: "Please log in"
			}
		}
		const cookie = await globalThis.chainCache.prisma.cookies.findUnique({
			where: {
				sessionId: session.id,
			},
			select: {
				sessionSecret: true,
				userKey: true,
			},
		})
		if (cookie == null || cookie.sessionSecret != createHash('sha256').update(Buffer.from(session.secret, 'hex')).digest('hex').toString()) {
			opts.ctx.res.statusCode = 403
			return {
				error: "Please log in"
			}
		} else {
			return {
				key: cookie.userKey
			}
		}
	}
}

export const appRouter = router({
	like: procedure.input(
		likeMarketSchemaV0,
	).query(async (opts) => {
		const resp = await getUserId(opts)
		if (resp.error != null) {
			return {
				error: resp.error,
			}
		} else {
			var maybe_market = globalThis.chainCache.markets.get(opts.input.ammAddress);
			if (maybe_market != null) {
				if (opts.input.liked) {
					const start = new Date();
					const x = await globalThis.chainCache.prisma.marketLike.upsert({
						where: {
							ammAddress_userKey: {
								userKey: resp.key,
								ammAddress: Buffer.from(base58.decode(opts.input.ammAddress)),
							},
						},
						update: {},
						create: {
							userKey: resp.key,
							ammAddress: Buffer.from(base58.decode(opts.input.ammAddress)),
						},
					})
					if (start < x.createdAt) {
						maybe_market.Likes.add(base58.encode(resp.key));
					}
				} else {
					const res = await globalThis.chainCache.prisma.marketLike.deleteMany({
						where: {
							ammAddress: Buffer.from(base58.decode(opts.input.ammAddress)),
							userKey: resp.key,
						},
					})
					if (res.count > 0) {
						maybe_market.Likes.delete(base58.encode(resp.key));
					}
				}
			}
		}
	}),

	checkUsername: procedure.input(
		usernameAvailableCheckSchemaV0,
	).query(async (opts) => {
		return globalThis.chainCache.usernames.has(opts.input.name)
	}),

	getUser: procedure.input(
		getUserProfilesSchemaV0,
	).query(async (opts) => {
		var ret = new Map<string, TUser>();
		console.log("Starting getUser request", opts.input.userId)
		const helia = await getHelia()
		await Promise.allSettled(opts.input.userId.map(async (v: string) => {
			var maybe_username = globalThis.chainCache.usernames.get(v);
			console.log("Got following username for user ", v, ":", maybe_username)
			if (maybe_username != null) {
				var maybe_profile = globalThis.chainCache.profiles.get(maybe_username!);
				console.log("Got following profile for user ", v, ":", maybe_profile)
				if (maybe_profile != null) {
					var js;
					try {
						js = await helia.get(multiformats.CID.decode(maybe_profile.IPFS_Cid))
					} catch (err) {
						console.log("Couldn't get ipfs data: ", err)
						return;
					}
					console.log("Got the following helia ipfs data: ", js);
					const metadata = userMetadataSchemaV0.safeParse(js)
					if (metadata.success) {
						ret.set(maybe_profile.UserKey.toBase58(), {
							username: maybe_username,
							metadata: metadata.data
						})
					} else {
						console.log("Couldnt parse ipfs data: ", metadata.error);
					}

				}
			}
		}))
		return ret;
	}),

	getUserMarkets: procedure.input(
		getUserMarketsSchemaV0,
	).query(async (opts) => {
		var key = new web3.PublicKey(opts.input.userId)
		var _map = new Map<string, extMarketChaindata>()
		chainCache.markets.forEach(v => {
			if (v.data.OperatorKey.equals(key)) {
				_map.set(base58.encode(v.data.AmmAddress), v)
			}
		})
		var map = new Map<string, marketFulldata>();
		const helia = await getHelia();
		await Promise.allSettled([..._map.entries()].map(async ([k, v]) => {
			const js = await helia.get(multiformats.CID.decode(v.data.IPFS_Cid))
			const metadata = marketMetadataSchemaV0.safeParse(js)
			if (metadata.success) {
				map.set(k, {
					data: v,
					metadata: metadata.data
				})
			}
		}))
		return map

	}),

	getMarketAccounts: procedure.input(
		getMarketAccountsSchemaV0,
	).query(async (opts) => {
		var map = new Map<string, {
			market: marketFulldata,
			account: marketUserChaindata,
		}>()
		chainCache.markets.forEach(v => {
			var maybe_account = v.UserAccounts.get(opts.input.userId);
			if (maybe_account != null) {
				map.set(base58.encode(v.data.AmmAddress), {
					market: {
						data: v,
						metadata: null,
					},
					account: maybe_account!
				});
			}
		})
		const helia = await getHelia();
		await Promise.allSettled([...map.entries()].map(async ([k, v]) => {
			const js = await helia.get(multiformats.CID.decode(v.market.data.data.IPFS_Cid))
			const metadata = marketMetadataSchemaV0.safeParse(js)
			if (metadata.success) {
				v.market.metadata = metadata.data;
				map.set(k, v)
			}
		}))
		return map
	}),

	listComments: procedure.input(
		listCommentsSchemaV0
	).query(async (opts) => {
		const comments = await globalThis.chainCache.prisma.marketComment.findMany({
			where: {
				ammAddress: Buffer.from(base58.decode(opts.input.ammAddress)),
			},
		})
		var users = new Map<string, TUser | null>();
		const helia = await getHelia()
		comments.forEach(v => users.set(base58.encode(v.userKey), null))
		await Promise.allSettled([...users.keys()].map(async (k: string) => {
			var maybe_username = globalThis.chainCache.usernames.get(k);
			if (maybe_username != null) {
				var maybe_profile = globalThis.chainCache.profiles.get(maybe_username!);
				if (maybe_profile != null) {
					var js;
					try {
						js = await helia.get(multiformats.CID.decode(maybe_profile.IPFS_Cid))
					} catch (err) {
						console.log("Couldn't get ipfs data: ", err)
						return;
					}
					console.log("Got the following helia ipfs data: ", js);
					const metadata = userMetadataSchemaV0.safeParse(js)
					if (metadata.success) {
						users.set(maybe_profile.UserKey.toBase58(), {
							username: maybe_username,
							metadata: metadata.data
						})
					} else {
						console.log("Couldnt parse ipfs data: ", metadata.error);
					}
				}
			}
		}))
		return {
			comments: comments.map(v => {
				return {
					createdAt: v.createdAt,
					userKey: base58.encode(v.userKey),
					content: v.content,
				}
			}),
			users: users,
		}
	}),

	comment: procedure.input(
		commentSchemaV0,
	).mutation(async (opts) => {
		const resp = await getUserId(opts)
		if (resp.error != null) {
			return {
				error: resp.error,
			}
		} else {
			var maybe_market = globalThis.chainCache.markets.get(opts.input.ammAddress)
			if (maybe_market == null) {
				opts.ctx.res.statusCode = 404
				return {
					error: "No such market"
				}
			} else {
				await globalThis.chainCache.prisma.marketComment.create({
					data: {
						userKey: resp.key,
						ammAddress: Buffer.from(base58.decode(opts.input.ammAddress)),
						content: opts.input.content,
					},
				})
				maybe_market!.CommentCount += 1;
				globalThis.chainCache.markets.set(opts.input.ammAddress, maybe_market!);
			}
		}
	}),

	/*login: procedure.input(
		loginSchemaV0,
	).mutation(async (opts) => {
		const tx = web3.Transaction.from(opts.input.signedTx)
		if (tx.instructions.length != 1 || tx.signatures.length > 1) {
			throw new Error("bad challenge tx")
		}
		if (!tx.verifySignatures()) {
			throw new Error("bad challenge tx")
		}
		const challenge = tx.instructions[0].data.toString('hex')
		if (globalThis.loginChallengeCache.del(challenge) >= 1) {
			const sessionId = randomBytes(32).toString('hex')
			const cookieSecret = randomBytes(32).toString('hex')
			await globalThis.chainCache.prisma.cookies.create({
				data: {
					sessionId: sessionId,
					sessionSecret: createHash('sha256').update(Buffer.from(cookieSecret, 'hex')).digest('hex'),
					userKey: tx.signature!,
				}
			})
			opts.ctx.res.setHeader("Set-Cookie", cookie.serialize("session", JSON.stringify({"id": sessionId, "secret": cookieSecret}), {
				secure: false,
				sameSite: "none",
				maxAge: new Date().getTime() + (10 * 365 * 24 * 60 * 60)
			}))
			return {
				error: null,
			}
		} else {
			return {
				error: "wrong or expired challenge bytes"
			}
		}
	}),*/

	login2: procedure.input(
		login2SchemaV0,
	).mutation(async (opts) => {
		const key = new web3.PublicKey(opts.input.key)
		const message = Buffer.from(opts.input.message);
		if (!await ed25519.verifyAsync(
			Buffer.from(opts.input.signature),
			message,
			key.toBytes()
		)) {
			return {
				error: "Invalid signature"
			}
		}
		if (globalThis.loginChallengeCache.del(message.toString('hex')) >= 1) {
			const sessionId = randomBytes(32).toString('hex')
			const cookieSecret = randomBytes(32).toString('hex')
			await globalThis.chainCache.prisma.cookies.create({
				data: {
					sessionId: sessionId,
					sessionSecret: createHash('sha256').update(Buffer.from(cookieSecret, 'hex')).digest('hex'),
					userKey: key.toBuffer(),
				}
			})
			opts.ctx.res.setHeader("Set-Cookie", cookie.serialize("session", JSON.stringify({"id": sessionId, "secret": cookieSecret}), {
				secure: false,
				sameSite: "none",
				maxAge: new Date().getTime() + (10 * 365 * 24 * 60 * 60)
			}))
			return {
				error: null,
			}
		} else {
			return {
				error: "wrong or expired challenge bytes"
			}
		}
	}),

	getLoginChallenge: procedure.input(
		getChallengeTxSchemaV0,
	).mutation(async (_) => {
		const challenge = randomBytes(32).toString('hex')
		globalThis.loginChallengeCache.set(challenge, "", 600)
		return {
			challenge: challenge,
		};
	}),

	storeUserProfileIpfs: procedure.input(
		userMetadataSchemaV0,
	).mutation(async (opts) => {
		const helia = await getHelia();
		const result = await helia.add(opts.input);
		return {
			cid: result.toV1().bytes,
		}
	}),

	storeMarketIpfs: procedure.input(
		marketMetadataSchemaV0
	).mutation(async (opts) => {
		const result = await (await getHelia()).add(opts.input);
		return {
			cid: result.toV1().bytes,
		}
	}),

	searchMarkets: procedure.input(
		z.object({
			term: z.string().nullable(),
			limit: z.number().nullable(),
		}),
	).query(async (opts) => {
		const markets = await searchMarkets({
			term: opts.input.term ? opts.input.term : undefined,
			limit: opts.input.limit ? opts.input.limit : undefined,
			orderBy: "recent",
		})
		const helia = await getHelia()
		var users = new Map<string, TUser | null>()
		await Promise.allSettled(markets.map(async (m) => {
			var v = m.data.data.OperatorKey.toBase58()
			var maybe_username = globalThis.chainCache.usernames.get(v);
			if (maybe_username != null) {
				var maybe_profile = globalThis.chainCache.profiles.get(maybe_username!);
				if (maybe_profile != null) {
					var js;
					try {
						js = await helia.get(multiformats.CID.decode(maybe_profile.IPFS_Cid))
					} catch (err) {
						console.log("error getting ipfs data: ", err)
					}
					const metadata = userMetadataSchemaV0.safeParse(js)
					if (metadata.success) {
						users.set(maybe_profile.UserKey.toBase58(), {
							username: maybe_username,
							metadata: metadata.data
						})
					} else {
						users.set(v, null)
					}

				}
			} else {
				users.set(v, null)
			}
		}))
		return {
			markets: markets,
			users: users,
		}
	}),

	getMarket: procedure.input(
		z.object({
			id: z.string().min(32).max(44),
		}),
	).query(async (opts) => {
		const resp = await marketByAddress(opts.input.id)
		if (resp == null) {
			return {
				resp: null,
			}
		} else {
			return {
				resp: {
					market: resp[0],
					users: resp[1],
				}
			}
		}
	}),

});

// export type definition of API
export type AppRouter = typeof appRouter;