import * as web3 from '@solana/web3.js'
import {MarketDataSnapshot, PrismaClient} from "@prisma/client"
import * as helia from 'helia'
import {extMarketChaindata, marketChaindata, marketPricePoint, profileChaindata} from '../types/market.js'
import NodeCache from 'node-cache';
import {Mutex} from "async-mutex";
import base58 from 'bs58';

export type ChainCache = {
	markets: Map<string, extMarketChaindata>,
	profiles: Map<string, profileChaindata>,
	usernames: Map<string, string>,
	ipfs_data: Map<string, Buffer>,
	ipfsc: helia.HeliaInit | null,
	w3conn: web3.Connection,
	prisma: PrismaClient
}

declare global {
	var chainCache: ChainCache;
};

async function handleAccountChanges(accounts: web3.AccountInfo<Buffer>[], retrieved: Date) {
	console.log("Handling account changes...")
	if (accounts.length > 0) {
		const toMarket = (vdata: Buffer): [Buffer, marketChaindata] => {
			var Version = vdata.readUInt8(1);
			if (Version != 1) {
				throw "unsupported market data version"
			}
			console.log(vdata)
			var ipfs_len = vdata.readUint8(3 + 8 * 3);
			var amm_address = vdata.slice(1 + 1 + 1 + 8 * 3 + 1 + ipfs_len + 32, 1 + 1 + 1 + 8 * 3 + 1 + ipfs_len + 32 + 32)
			var newData: marketChaindata = {
				Version: 1,
				AmmAddress: amm_address,
				Resolved: vdata.readUInt8(2) == 0 ? null : vdata.readUint8(2) == 2,
				Subsidy: vdata.readBigUint64LE(3),
				Yes: vdata.readBigUInt64LE(3 + 8),
				No: vdata.readBigUint64LE(3 + 8 + 8),
				IPFS_Cid: vdata.slice(3 + 8 * 3 + 1, 3 + 8 * 3 + 1 + ipfs_len),
				OperatorKey: new web3.PublicKey(vdata.slice(3 + 8 * 3 + 1 + ipfs_len, 3 + 8 * 3 + 1 + ipfs_len + 32)),
			}
			console.log(base58.encode(amm_address), newData.Subsidy, newData.No, newData.Yes);
			return [amm_address, newData]
		}
		const marketAccounts = accounts.filter(v => v.data.readUInt8(0) == 1)
		var newMarketAccounts: [Buffer, marketChaindata][] = []
		var updateMarketAccounts: [Buffer, marketChaindata][] = []
		marketAccounts.forEach(v => {
			var [amm_address, newData] = toMarket(v.data)
			var maybe_market = globalThis.chainCache.markets.get(base58.encode(amm_address));
			if (maybe_market) {
				if (newData != maybe_market.data) {
					updateMarketAccounts.push([amm_address, newData]);
				}
			} else {
				newMarketAccounts.push([amm_address, newData])
			}
		})
		if (newMarketAccounts.length > 0 || updateMarketAccounts.length > 0) {
			var snapshots = new Map<string, marketPricePoint[]>();
			if (newMarketAccounts.length > 0) {
				const resp = await globalThis.chainCache.prisma.$transaction([
					...newMarketAccounts.map(([ammAddress, _]) => {
						return globalThis.chainCache.prisma.marketComment.count({where: {ammAddress: ammAddress}})
					}),
					...newMarketAccounts.map(([ammAddress, _]) => {
						return globalThis.chainCache.prisma.marketLike.findMany({where: {ammAddress: ammAddress}, select: {userKey: true}})
					}),
					globalThis.chainCache.prisma.marketDataSnapshot.findMany({
						where: {
							ammAddress: {
								in: newMarketAccounts.map(v => v[0]),
							},
						},
					}),
				]);
				var mdsnapshots: MarketDataSnapshot[] = <MarketDataSnapshot[]>resp[resp.length - 1]
				mdsnapshots.forEach(v => {
					const newPoint = {
						Yes: v.yes,
						No: v.no,
						Subsidy: v.subsidy,
						At: v.retrievalTime
					}
					var _snapshots = snapshots.get(base58.encode(v.ammAddress));
					if (_snapshots == null) {
						snapshots.set(base58.encode(v.ammAddress), [newPoint])
					} else {
						snapshots.set(base58.encode(v.ammAddress), [..._snapshots, newPoint])
					}
				});
				var commentCounts: number[] = <number[]>resp.slice(0, newMarketAccounts.length)
				var likes: {userKey: Buffer}[][] = <{userKey: Buffer}[][]>resp.slice(0, resp.length - 1)
				newMarketAccounts.forEach(([ammAddress, newData], i) => {
					const _snapshots = snapshots.get(base58.encode(ammAddress));
					globalThis.chainCache.markets.set(base58.encode(ammAddress), {
						data: newData,
						CommentCount: commentCounts[i],
						Likes: likes[newMarketAccounts.length + i].reduce((prev, cur) => prev.add(base58.encode(cur.userKey)), new Set<string>()),
						UserAccounts: new Map(),
						PriceHistory: _snapshots ? _snapshots.sort((a, b) => a.At.getTime() - b.At.getTime()) : [],
						Trades: [],
					})

				})
			}
			updateMarketAccounts.forEach(([ammAddress, newData]) => {
				var data = globalThis.chainCache.markets.get(base58.encode(ammAddress))!
				data.data = newData
				var priceHistory = data.PriceHistory
				priceHistory.push({
					Yes: data.data.Yes,
					No: data.data.No,
					Subsidy: data.data.Subsidy,
					At: retrieved,
				})
				data.PriceHistory = priceHistory
				globalThis.chainCache.markets.set(base58.encode(ammAddress), data)
			})
			await globalThis.chainCache.prisma.$transaction([
				...newMarketAccounts.map(([amm_address, newData]) => globalThis.chainCache.prisma.marketDataSnapshot.create({
					data: {
						ammAddress: amm_address,
						retrievalTime: retrieved,

						version: 1,
						resolved: newData.Resolved,

						subsidy: newData.Subsidy,
						yes: newData.Yes,
						no: newData.No,

						ipfsCid: newData.IPFS_Cid,
						operatorKey: newData.OperatorKey.toBuffer(),
					},
				})),
				...newMarketAccounts.map(([amm_address, newData]) => globalThis.chainCache.prisma.marketData.upsert({
					where: {
						ammAddress: amm_address,
					},
					update: {
						ammAddress: amm_address,

						version: 1,
						resolved: newData.Resolved,

						subsidy: newData.Subsidy,
						yes: newData.Yes,
						no: newData.No,

						ipfsCid: newData.IPFS_Cid,
						operatorKey: newData.OperatorKey.toBuffer(),
					},
					create: {
						ammAddress: amm_address,

						version: 1,
						resolved: newData.Resolved,

						subsidy: newData.Subsidy,
						yes: newData.Yes,
						no: newData.No,

						ipfsCid: newData.IPFS_Cid,
						operatorKey: newData.OperatorKey.toBuffer(),
					},
				})),
				...updateMarketAccounts.map(([amm_address, newData]) => globalThis.chainCache.prisma.marketDataSnapshot.create({
					data: {
						ammAddress: amm_address,
						retrievalTime: retrieved,

						version: 1,
						resolved: newData.Resolved,

						subsidy: newData.Subsidy,
						yes: newData.Yes,
						no: newData.No,

						ipfsCid: newData.IPFS_Cid,
						operatorKey: newData.OperatorKey.toBuffer(),
					},
				})),
				...updateMarketAccounts.map(([amm_address, newData]) => globalThis.chainCache.prisma.marketData.update({
					where: {
						ammAddress: amm_address,
					},
					data: {
						ammAddress: amm_address,

						version: 1,
						resolved: newData.Resolved,

						subsidy: newData.Subsidy,
						yes: newData.Yes,
						no: newData.No,

						ipfsCid: newData.IPFS_Cid,
						operatorKey: newData.OperatorKey.toBuffer(),
					},
				})),
			])
		}
		accounts.filter(v => v.data.readUInt8(0) == 2).forEach(v => {
			var vdata = v.data;
			var Version = vdata.readUInt8(1);
			if (Version != 1) {
				throw "unsupported market user account data version"
			}
			var user: web3.PublicKey = new web3.PublicKey(vdata.slice(2, 2 + 32));
			var amm_address = vdata.slice(2 + 32 + 8, 2 + 32 + 8 + 32);
			globalThis.chainCache.markets.get(base58.encode(amm_address))!.UserAccounts.set(user.toBase58(), {
				Version: 1,
				Shares: vdata.readBigInt64LE(2 + 32),
			})
		})
		accounts.filter(v => v.data.readUInt8(0) == 3).forEach(v => {
			var vdata = v.data;
			var Version = vdata.readUint8(1);
			if (Version != 1) {
				throw "unsupported user profile account data version"
			}
			var _key = vdata.slice(2, 2 + 32)
			const key = new web3.PublicKey(_key);
			var ipfs_len = vdata.readUint8(2 + 32);
			var cid = vdata.slice(2 + 32 + 1, 2 + 32 + 1 + ipfs_len)
			var username_len = vdata.readUint8(2 + 32 + 1 + ipfs_len)
			var username = vdata.slice(2 + 32 + 1 + ipfs_len + 1, 2 + 32 + 1 + ipfs_len + 1 + username_len).toString('utf8')
			globalThis.chainCache.profiles.set(username, {
				Version: 1,
				IPFS_Cid: cid,
				UserKey: key,
			})
			globalThis.chainCache.usernames.set(key.toBase58(), username)
			console.log("New profiles: ", globalThis.chainCache.profiles, globalThis.chainCache.usernames);
		})
	}
}

async function syncAccountState(conn: web3.Connection) {
	const retrieved = new Date();
	const accounts = await conn.getProgramAccounts(globalThis.mainProgramId, {
		withContext: false,
	});
	await handleAccountChanges(accounts.map(v => v.account), retrieved);
}

var maintainingAccountState = false;

export async function startMaintainingAccountState(rpcUrl: string) {
	globalThis.helia = null;
	globalThis.heliaDatastore = null;
	globalThis.heliaBlockstore = null;
	globalThis.heliaM = new Mutex();
	globalThis.loginChallengeCache = new NodeCache();
	globalThis.chainCache = {
		markets: new Map<string, extMarketChaindata>(),
		profiles: new Map<string, profileChaindata>(), //Username: profileAccountData
		ipfs_data: new Map<string, Buffer>(), //CID: profileAccountData
		usernames: new Map<string, string>(), //UserKey: username
		ipfsc: null,
		w3conn: new web3.Connection(rpcUrl),
		prisma: new PrismaClient(),
	}
	if (!maintainingAccountState) {
		maintainingAccountState = true
		await syncAccountState(chainCache.w3conn)

		//TODO: Race between syncAccountState and onProgramAccountChange here
		chainCache.w3conn.onProgramAccountChange(globalThis.mainProgramId, (keyedAccountInfo, _) => {
			console.log("Attempting to handle account changes...")
			handleAccountChanges([keyedAccountInfo.accountInfo], new Date()).catch(err => {
				console.log("bad error handling account state change: ", err)
			})
		}, "finalized")
	}
}
