// server.js
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import * as web3 from "@solana/web3.js"
import cors from "cors"
import {startMaintainingAccountState} from "./amclient/globals.js";
import {appRouter} from './server/routers/_app.js';
import {createContext} from './server/trpc.js';
import {webcrypto} from 'node:crypto';
import {startAndMaintainPmList} from './amclient/polymarket.js';
import * as meilisearch from 'meilisearch';
import fetch from 'cross-fetch';

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto

const port = 3000;

declare global {
  var mainProgramId: web3.PublicKey
  var usdcMintAddr: web3.PublicKey
  var feePayer: web3.Keypair
  var feeMeta: {
    paidTxs: Set<string>
    ipLatest: Map<string, Date>
  }
  var instanceId: Buffer | null //AMM address prefix that hints that this is the relevant instance.
};

export function msearch() {
  return new meilisearch.MeiliSearch({
    "host": process.env.MEILI_HTTP_ADDR ?? "localhost:7700",
    "apiKey": process.env.MEILI_API_KEY,
    "httpClient": ((host, init) => fetch(host, init).then(resp => resp.json()))
  });
}

// when using middleware `hostname` and `port` must be provided below

const start = async () => {
  const rpcUrl = process.env.RPC_URL ?? "http://127.0.0.1:8899";
  //const dev = process.env.NODE_ENV !== 'production' || rpcUrl.includes("127.0.0.1");
  if (process.env.FEE_PAYER_KEY) {
    globalThis.feePayer = web3.Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.FEE_PAYER_KEY)));
  } else {
    globalThis.feePayer = web3.Keypair.generate()
    console.log("Generated new fee payer key: ", globalThis.feePayer.publicKey.toString());
  }
  globalThis.feeMeta = {
    paidTxs: new Set(),
    ipLatest: new Map()
  }
  let mainProgramId = process.env.MAIN_PROGRAM_ID;
  let mint = process.env.USDC_MINT_ADDR;

  if (process.env.INSTANCE_ID != null) {
    globalThis.instanceId = Buffer.from(process.env.INSTANCE_ID!, 'hex');
  } else {
    globalThis.instanceId = null;
  }

  //Set filterable attributes for index
  msearch().index('markets').updateFilterableAttributes(["tradable"]).then(_ => {})

  if (!mint || !mainProgramId) {
    throw new Error("need mint addr and main program addr if not running on localhost");
  }

  console.log("Local environment available")

  // give http server updated evns
  globalThis.mainProgramId = new web3.PublicKey(mainProgramId!);
  globalThis.usdcMintAddr = new web3.PublicKey(mint!);

  startAndMaintainPmList().then(_ => {})
  startMaintainingAccountState(rpcUrl).then((_: any) => {
    console.log("Chain cache initted; starting helia")
    const server = createHTTPServer({
      middleware: cors({
        origin: ["http://127.0.0.1:5173", "http://localhost:5173", "http://frontend:5173", "https://openpredict.org", /\.openpredict\.org$/],
        methods: ["GET", "POST"],
        credentials: true
      }),
      router: appRouter,
      createContext,
    })
    server.listen(port)
    console.log("TRPC server listening on " + port.toString())
  }, (err: any) => {
    console.error("Error initting chain cache: ", err)
    process.exit(1)
  })
}

start().catch(err => {
  console.error("error in main program loop: ", err)
  process.exit(1)
})
