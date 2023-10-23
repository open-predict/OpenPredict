import * as helia from "helia"
import * as pb from './oppb.js'
import base58 from 'bs58'
import { extMarketChaindata, marketFulldata, marketMetadataSchemaV0, pmMarketFulldata, pmUserMap, profileChaindata } from '../types/market.js'
import './globals.js'
import * as multiformats from "multiformats"
import { json as hJson, JSON as hJsonI } from "@helia/json"
import { FsBlockstore } from 'blockstore-fs'
import { FsDatastore } from 'datastore-fs'
import { Mutex } from 'async-mutex'
import { TUser, userMetadataSchemaV0 } from "../types/user.js"
import { msearch } from "../index.js"

declare global {
  var _helia: any
  var helia: hJsonI | null
  var heliaBlockstore: FsBlockstore | null
  var heliaDatastore: FsDatastore | null
  var heliaM: Mutex
  var heliaCache: Map<string, unknown>
}

async function getHelia() {
  await globalThis.heliaM.runExclusive(async () => {
    if (globalThis.helia == null) {
      globalThis.heliaBlockstore = new FsBlockstore('/opt/ipfs/blocks')
      globalThis.heliaDatastore = new FsDatastore('/opt/ipfs/data')
      globalThis._helia = await helia.createHelia({
        blockstore: globalThis.heliaBlockstore!,
        datastore: globalThis.heliaDatastore!,
      })
      globalThis._helia.libp2p.services.dht.setMode("server");
      globalThis.helia = hJson(globalThis._helia);
    }
    console.log("helia addresses", globalThis._helia.libp2p.getMultiaddrs());
  })
  return globalThis.helia!;
}

export async function heliaAdd(data: unknown): Promise<multiformats.CID> {
  return getHelia().then(helia => helia.add(data, {
    signal: AbortSignal.timeout(500),
  }))
}

export async function heliaGet(cid: multiformats.CID): Promise<unknown> {
  if (globalThis.heliaCache.has(cid.toString())) {
    return globalThis.heliaCache.get(cid.toString())
  }
  return getHelia().then(helia => helia.get(cid, {
    signal: AbortSignal.timeout(500)
  }))
}

export async function marketByAddress(amm_address: string): Promise<[marketFulldata, Map<string, {
  username: string | null,
}>] | null> {
  const data = chainCache.markets.get(amm_address)
  if (!data) {
    return null
  };
  var users = new Map<string, { username: string | null }>
  users.set(data.data.OperatorKey.toBase58(), {
    username: globalThis.chainCache.usernames.get(data.data.OperatorKey.toBase58()) ?? null
  })
  const entries = data.UserAccounts.entries()
  for (var entry of entries) {
    users.set(entry[0], {
      username: globalThis.chainCache.usernames.get(entry[0]) ?? null
    })
  }
  const mfcid = multiformats.CID.decode(data.data.IPFS_Cid)
  const result = await heliaGet(mfcid)
  const metadata = await marketMetadataSchemaV0.safeParseAsync(result);
  return [{
    data: data,
    metadata: metadata.success ? metadata.data : null,
  }, users]
}

export async function profileByUsername(username: string): Promise<profileChaindata | undefined> {
  return chainCache.profiles.get(username)
}

export async function alertNewConfirmedTransaction(sig: string) {
  const retrieved = new Date()
  const tx = await chainCache.w3conn.getTransaction(sig, {
    commitment: "finalized",
    maxSupportedTransactionVersion: 1,
  })
  if (tx) {
    tx.transaction.message.compiledInstructions.map((v, i) => {
      if (tx.transaction.message.staticAccountKeys[v.programIdIndex] == mainProgramId) {
        var inst = pb.openpredict.Instruction.decode(v.data);
        if (inst.buyShares) {
          var bs = inst.buyShares;
          var ammAddress = bs.ammAddress! //Must have to be finalized
          chainCache.markets.get(base58.encode(ammAddress))?.Trades
          return [
            chainCache.prisma.marketTrade.create({
              data: {
                txId: Buffer.from(base58.decode(sig)),
                instructionNo: i,
                ammAddress: Buffer.from(ammAddress),
                expectedShares: BigInt(bs.expectedAmount!.toString()),
                drift: BigInt(bs.drift!.toString()),
                microUSDC: BigInt(bs.microUsdc!.toString()),
                blockTime: tx.blockTime!,
                direction: bs.direction!,
                slot: tx.slot,
                retrievalTime: retrieved,
                userKey: tx.transaction.message.staticAccountKeys[v.accountKeyIndexes[0]].toBuffer(),
              },
            }),
          ]
        }
      }
      return []
    }).reduce((prev, cur) => [...prev, ...cur])
  }
}

export async function getMarketFulldata(data: extMarketChaindata): Promise<marketFulldata> {
  var ipfs_ln = data.data.IPFS_Cid.length;
  if (globalThis.instanceId == null || data.data.AmmAddress.slice(0, 16).equals(globalThis.instanceId!)) {
    try {
      if (ipfs_ln > 0) {
        const mfcid = multiformats.CID.decode(data.data.IPFS_Cid)
        const result = await heliaGet(mfcid)
        const metadata = await marketMetadataSchemaV0.safeParseAsync(result);
        if (metadata.success) {
          return {
            data: data,
            metadata: metadata.data,
          }
        } else {
          throw "errParsingMetadata";
        }
      } else {
        const meta = await globalThis.chainCache.prisma.marketMeta.findUnique({
          where: {
            ammAddress: data.data.AmmAddress,
          },
          select: {
            meta: true,
          },
        })
        if (meta != null) {
          const metadata = await marketMetadataSchemaV0.safeParseAsync(meta!.meta);
          if (metadata.success) {
            return {
              data: data,
              metadata: metadata.data,
            }
          } else {
            throw "errParsingMetadata";
          }
        } else {
          return {
            data: data,
            metadata: null,
          }
        }
      }
    } catch (e) {
      return {
        data: data,
        metadata: null,
      }
    }
  } else {
    return {
      data: data,
      metadata: null,
    }
  }
}

export type _MarketSearchResult = {
  pmMarket: pmMarketFulldata,
  opMarket: undefined,
} | {
  pmMarket: undefined,
  opMarket: marketFulldata,
}

export async function getAllMarketMeta(data: {
  results?: _MarketSearchResult[],
  pmMarkets?: pmMarketFulldata[],
  opMarkets?: marketFulldata[],
}): Promise<{
  pmUsers: pmUserMap,
  opUsers: Map<string, TUser>,
  commentNo: { [market_id: string]: number },
  likeNo: { [market_id: string]: number },
}> {
  var pmUsers: pmUserMap = new Map();
  var opUsers: Map<string, TUser> = new Map();

  var commentNo: { [market_id: string]: number } = {}
  var likeNo: { [market_id: string]: number } = {}

  var opMarkets: marketFulldata[] = data.opMarkets ?? []
  var pmMarkets: pmMarketFulldata[] = data.pmMarkets ?? []
  if (data.results != null) {
    for (var result of data.results) {
      if (result.opMarket != null) {
        opMarkets.push(result.opMarket);
      } else if (result.pmMarket) {
        pmMarkets.push(result.pmMarket);
      }
    }
  }
  var market_ids: Map<string, {
    id_str: string,
  }> = new Map();
  opMarkets.forEach(v => market_ids.set(v.data.data.AmmAddress.toString(), {
    id_str: base58.encode(v.data.data.AmmAddress),
  }));
  pmMarkets.forEach(v => {
    v.data.tokens.forEach((token) => {
      market_ids.set(Buffer.from(token.token_id.slice(2), 'hex').toString(), {
        id_str: token.token_id,
      })
    })
  })
  //Get all polymarket users
  //TODO: Get openpredict users from here too in allSettled
  pmMarkets.forEach((m) => {
    const getPmUser = (key: string) => {
      if (!pmUsers.has(key) && globalThis.pmChainCache.users.has(key)) {
        pmUsers.set(key, globalThis.pmChainCache.users.get(key)!);
      }
    }
    for (var orderMap of m.orderdata.values()) {
      orderMap.filledOrders.forEach(v => {
        getPmUser(v.maker)
        if (v.taker != null) {
          getPmUser(v.taker)
        }
      })
      orderMap.positions.forEach(v => {
        getPmUser(v.address);
      })
    }
  })


  var retrievingOpUser = new Set<string>()
  const getOpUser = async (key: string) => {
    if (!retrievingOpUser.has(key) && !opUsers.has(key)) {
      retrievingOpUser.add(key)
      var maybe_username = globalThis.chainCache.usernames.get(key);
      if (maybe_username != null) {
        var maybe_profile = globalThis.chainCache.profiles.get(maybe_username!);
        if (maybe_profile != null) {
          var js;
          try {
            js = await heliaGet(multiformats.CID.decode(maybe_profile.IPFS_Cid))
          } catch (err) {
            console.log("error getting ipfs data: ", err)
          }
          const metadata = userMetadataSchemaV0.safeParse(js)
          if (metadata.success) {
            opUsers.set(maybe_profile.UserKey.toBase58(), {
              username: maybe_username,
              metadata: metadata.data
            })
          }
        }
      }
    }
  }
  //Do all of this at once.
  await Promise.allSettled([
    //Get all openpredict users
    opMarkets.reduce((prev, m) => {
      return [
        ...prev,
        ...[...m.data.UserAccounts.keys()].map(v => getOpUser(v)),
        getOpUser(m.data.data.OperatorKey.toBase58()),
      ]
    }, <Promise<void>[]>[]),
    //Market comment counts
    globalThis.chainCache.prisma.marketComment.findMany({
      where: {
        ammAddress: {
          in: [...market_ids.keys()].map(v => Buffer.from(v)),
        }
      },
      select: {
        ammAddress: true,
      }
    }).then(resp => {
      for (var it of resp) {
        var val = market_ids.get(it.ammAddress.toString())!
        commentNo[val.id_str] = commentNo[val.id_str] + 1;
      }
    }),
    //Market likes
    globalThis.chainCache.prisma.marketLike.findMany({
      where: {
        ammAddress: {
          in: [...market_ids.keys()].map(v => Buffer.from(v)),
        }
      },
      select: {
        ammAddress: true,
      }
    }).then(resp => {
      for (var it of resp) {
        var val = market_ids.get(it.ammAddress.toString())!
        likeNo[val.id_str] = commentNo[val.id_str] + 1;
      }
    })
  ])
  return {
    pmUsers,
    opUsers,
    commentNo,
    likeNo,
  }
}

export async function searchMarkets(
  options: {
    term?: string,
    limit?: number,
    skip?: number,
    tradable?: boolean,
    orderBy?: "volume" | "recent",
  },
): Promise<_MarketSearchResult[]> {
  var _ret: Promise<marketFulldata>[] = []
  const iter = chainCache.markets.values();
  while (true) {
    const nxt = iter.next();
    if (nxt.done) {
      break;
    } else {
      _ret.push(
        getMarketFulldata(nxt.value),
      )
    }
  }
  var meilisearchResult = await msearch().index('markets').search(options.term, {
    limit: options.limit,
    offset: options.skip,
  })
  var results: Promise<_MarketSearchResult>[] = []
  if (meilisearchResult.hits != null) {
    for (var i = 0; i < meilisearchResult.hits.length; i++) {
      var data = meilisearchResult.hits[i];
      if (data['kind'] == "openpredict") {
        results.push(getMarketFulldata(globalThis.chainCache.markets.get(data['id'])!).then(fulldata => {
          return {
            opMarket: fulldata,
            pmMarket: undefined,
          }
        }))
      } else if (data['kind'] == 'polymarket') {
        results.push((async () => {
          return {
            opMarket: undefined,
            pmMarket: globalThis.pmChainCache.getMarket(data['id'])!,
          }
        })())
      }
    }
  }
  return Promise.all(results);
}

export async function alertNewTransaction(sig: string) {
  chainCache.w3conn.onSignature(sig, async (result, _) => {
    if (result.err == null) {
      await alertNewConfirmedTransaction(sig)
    }
  }, "finalized")
}

