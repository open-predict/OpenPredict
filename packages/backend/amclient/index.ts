import * as helia from "helia"
import * as pb from './oppb.js'
import base58 from 'bs58'
import {extMarketChaindata, marketFulldata, marketMetadataSchemaV0, profileChaindata} from '../types/market.js'
import './globals.js'
import * as multiformats from "multiformats"
import {json as hJson, JSON as hJsonI} from "@helia/json"
import {FsBlockstore} from 'blockstore-fs'
import {FsDatastore} from 'datastore-fs'
import {Mutex} from 'async-mutex'

declare global {
  var _helia: any
  var helia: hJsonI | null
  var heliaBlockstore: FsBlockstore | null
  var heliaDatastore: FsDatastore | null
  var heliaM: Mutex
}

export async function getHelia() {
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

export async function marketByAddress(amm_address: string): Promise<[marketFulldata, Map<string, {
  username: string | null,
}>] | null> {
  const data = chainCache.markets.get(amm_address)
  if (!data) {
    return null
  };
  var users = new Map<string, {username: string | null}>
  users.set(data.data.OperatorKey.toBase58(), {
    username: globalThis.chainCache.usernames.get(data.data.OperatorKey.toBase58()) ?? null
  })
  const entries = data.UserAccounts.entries()
  for (var entry of entries) {
    users.set(entry[0], {
      username: globalThis.chainCache.usernames.get(entry[0]) ?? null
    })
  }
  const helia = await getHelia();
  const mfcid = multiformats.CID.decode(data.data.IPFS_Cid)
  const result = await helia.get(mfcid)
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
  const helia = await getHelia();
  var ipfs_ln = data.data.IPFS_Cid.length;
  if (globalThis.instanceId == null || data.data.AmmAddress.slice(0, 16).equals(globalThis.instanceId!)) {
    try {
      if (ipfs_ln > 0) {
        const mfcid = multiformats.CID.decode(data.data.IPFS_Cid)
        const result = await helia.get(mfcid, {
          signal: AbortSignal.timeout(500)
        })
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

export async function searchMarkets(options: {
  term?: string,
  limit?: number,
  orderBy: "volume" | "recent",
}): Promise<marketFulldata[]> {
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

  return Promise.allSettled(_ret).then(result => {
    var ret = result.filter(v => v.status == "fulfilled").map(v => (v as PromiseFulfilledResult<marketFulldata>).value);
    console.log(`Did not find metadata for ${ret.filter(r => r.metadata === null).length} of ${result.length} markets`)
    if (options.term != null) {
      ret = ret.filter(v => v.metadata && JSON.stringify(v.metadata).includes(options.term!))
    }
    if (options.orderBy != null) {
      switch (options.orderBy) {
        case "volume":
          ret.sort((a, b) => b.data.Trades.reduce((prev, cur) => prev + Number(cur.microUSDC), 0) - a.data.Trades.reduce((prev, cur) => prev + Number(cur.microUSDC), 0));
          break;
        case "recent":
          ret.sort((a, b) => {
            //TODO: Init date at market creation
            var a_date = 0;
            if (a.data.PriceHistory.length > 0) {
              a_date = a.data.PriceHistory[a.data.PriceHistory.length - 1].At.getTime();
            }
            var b_date = 0;
            if (b.data.PriceHistory.length > 0) {
              b_date = b.data.PriceHistory[b.data.PriceHistory.length - 1].At.getTime();
            }
            return b_date - a_date;
          });
          break;
      }
    }
    ret = ret.slice(0, options.limit != null && options.limit < 50 ? options.limit : 50);
    return ret;
  })

}

export async function alertNewTransaction(sig: string) {
  chainCache.w3conn.onSignature(sig, async (result, _) => {
    if (result.err == null) {
      await alertNewConfirmedTransaction(sig)
    }
  }, "finalized")
}

