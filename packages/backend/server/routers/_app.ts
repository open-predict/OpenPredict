import { z } from 'zod';
import { procedure, router } from '../trpc.js';
import { commentSchemaV0, extMarketChaindata, getChallengeTxSchemaV0, getMarketAccountsSchemaV0, getUserMarketsSchemaV0, getUserProfilesSchemaV0, likeMarketSchemaV0, listCommentsSchemaV0, login2SchemaV0, marketFulldata, /*loginSchemaV0,*/ marketMetadataSchemaV0, marketUserChaindata } from '../../types/market.js';
import { makeUsdcWalletSchemaV0, payUserTransactionSchemaV0, TUser, userMetadataSchemaV0, usernameAvailableCheckSchemaV0 } from '../../types/user.js';
import { getHelia, marketByAddress, searchMarkets } from '../../amclient/index.js';
import * as nodeCache from "node-cache"
import { createHash, randomBytes } from "crypto"
import * as web3 from "@solana/web3.js"
import * as cookie from "cookie"
import * as ed25519 from "@noble/ed25519"
import * as multiformats from "multiformats"
import * as spl from "@solana/spl-token"
import base58 from 'bs58';
import SuperJSON from 'superjson';

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

type CreateAccountResult = {
  error: Error;
} | {
  address: web3.PublicKey;
  mint: web3.PublicKey;
}

export async function createAccounts(
  connection: web3.Connection,
  feePayer: web3.Keypair,
  accounts: {
    address: web3.PublicKey;
    mint: web3.PublicKey;
  }[]
): Promise<CreateAccountResult[]> {
  let results: CreateAccountResult[] = [];

  for (const account of accounts) {
    let error: Error | null = null;
    try {
      await spl.createAssociatedTokenAccount(
        connection,
        feePayer,
        account.mint,
        account.address,
      );
    } catch (e) {
      console.error(e);
      error = e as Error;
    }

    if (error) {
      results.push({ error })
    } else {
      results.push({ ...account })
    }
  }

  return results;
}

// Check that a transaction is basically valid, sign it, and serialize it, verifying the signatures
// This function doesn't check if payer fee was transferred (instead, use validateTransfer) or
// instruction signatures do not include fee payer as a writable account (instead, use validateInstructions).
export async function validateTransaction(
  connection: web3.Connection,
  transaction: web3.Transaction,
  feePayer: web3.Keypair,
  maxSignatures: number,
  lamportsPerSignature: number
): Promise<{ signature: web3.TransactionSignature; rawTransaction: Buffer }> {
  // Check the fee payer and blockhash for basic validity
  if (!transaction.feePayer?.equals(feePayer.publicKey)) throw new Error('invalid fee payer');
  if (!transaction.recentBlockhash) throw new Error('missing recent blockhash');

  // TODO: handle nonce accounts?

  // Check Octane's RPC node for the blockhash to make sure it's synced and the fee is reasonable
  const feeCalculator = await connection.getFeeCalculatorForBlockhash(transaction.recentBlockhash);
  if (!feeCalculator.value) throw new Error('blockhash not found');
  if (feeCalculator.value.lamportsPerSignature > lamportsPerSignature) throw new Error('fee too high');

  // Check the signatures for length, the primary signature, and secondary signature(s)
  if (!transaction.signatures.length) throw new Error('no signatures');
  if (transaction.signatures.length > maxSignatures) throw new Error('too many signatures');

  const [primary, ...secondary] = transaction.signatures;
  if (!primary.publicKey.equals(feePayer.publicKey)) throw new Error('invalid fee payer pubkey');
  if (primary.signature) throw new Error('invalid fee payer signature');

  for (const signature of secondary) {
    if (!signature.publicKey) throw new Error('missing public key');
    if (!signature.signature) throw new Error('missing signature');
  }

  // Add the fee payer signature
  transaction.partialSign(feePayer);

  // Serialize the transaction, verifying the signatures
  const rawTransaction = transaction.serialize();

  // Return the primary signature (aka txid) and serialized transaction
  return { signature: base58.encode(transaction.signature!), rawTransaction };
}

// Prevent draining by making sure that the fee payer isn't provided as writable or a signer to any instruction.
// Throws an error if transaction contain instructions that could potentially drain fee payer.
async function validateInstructions(transaction: web3.Transaction, feePayer: web3.Keypair): Promise<void> {
  for (const instruction of transaction.instructions) {
    for (const key of instruction.keys) {
      if ((key.isWritable || key.isSigner) && key.pubkey.equals(feePayer.publicKey))
        throw new Error('invalid account');
    }
  }
}

export const appRouter = router({
  makeUsdcWallet: procedure.input(
    makeUsdcWalletSchemaV0,
  ).query(async (opts) => {
    const user = new web3.PublicKey(opts.input.user)
    const res = await createAccounts(globalThis.chainCache.w3conn, globalThis.feePayer, [{
      address: user,
      mint: globalThis.usdcMintAddr,
    }])
    return res[0]
  }),

  sendOpenPredictTransaction: procedure.input(
    payUserTransactionSchemaV0,
  ).query(async (opts) => {
    //Decode transaction
    let transaction: web3.Transaction;
    try {
      transaction = web3.Transaction.from(base58.decode(opts.input.transaction));
    } catch (e) {
      throw "Can't decode transaction: " + e
    }

    //Make sure all instructions are using our program id
    if (transaction.instructions.some(v => !v.programId.equals(globalThis.mainProgramId))) {
      throw "Included instruction not using our program id!"
    }

    //Make sure instructions don't access feePayer balance (& validate other metadata)
    let signature: string
    try {
      await validateInstructions(transaction, globalThis.feePayer)
      signature = (await validateTransaction(globalThis.chainCache.w3conn, transaction, globalThis.feePayer, 2, 10000)).signature
    } catch (e) {
      throw "Bad transaction: " + e
    }

    //FIXME (when broken): Better anti-ddos
    if (globalThis.feeMeta.paidTxs.has(signature)) {
      return {
        error: "Transaction already requested"
      }
    }
    globalThis.feeMeta.paidTxs.add(signature);

    var address = opts.ctx.req.socket.remoteAddress;
    if (address != null) {
      var latest = globalThis.feeMeta.ipLatest.get(address)
      if (latest != null && (new Date()).getTime() - latest.getTime() < 2) {
        return {
          error: "Too many requests"
        }
      }
      globalThis.feeMeta.ipLatest.set(address, new Date())
    }

    //Simulate transaction to make sure it works
    try {
      const sim = await globalThis.chainCache.w3conn.simulateTransaction(transaction)
      if (sim.value.err != null) {
        throw sim.value.err;
      }
    } catch (e) {
      throw "Couldn't simulate transaction: " + SuperJSON.stringify(e)
    }

    transaction.addSignature(globalThis.feePayer.publicKey, Buffer.from(base58.decode(signature)))

    const txid = await web3.sendAndConfirmRawTransaction(
      globalThis.chainCache.w3conn,
      transaction.serialize(),
      { commitment: 'confirmed' }
    );

    return {
      tx_id: txid,
    }
  }),

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
      opts.ctx.res.setHeader("Set-Cookie", cookie.serialize("session", JSON.stringify({ "id": sessionId, "secret": cookieSecret }), {
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
