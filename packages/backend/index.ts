// server.js
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import * as spl from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import {promisify} from "util";
import cors from "cors"
import {exec} from "child_process"
import {startMaintainingAccountState} from "./amclient/globals.js";
import {appRouter} from './server/routers/_app.js';
import {createContext} from './server/trpc.js';
import {getHelia} from './amclient/index.js';
import {webcrypto} from 'node:crypto';
import {readFile} from 'fs/promises';

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
};

// when using middleware `hostname` and `port` must be provided below

const start = async () => {
  const rpcUrl = process.env.RPC_URL ?? "http://127.0.0.1:8899";
  const dev = process.env.NODE_ENV !== 'production' || rpcUrl.includes("127.0.0.1");
  if (process.env.FEE_PAYER_KEY) globalThis.feePayer = web3.Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.FEE_PAYER_KEY)));
  globalThis.feeMeta = {
    paidTxs: new Set(),
    ipLatest: new Map()
  }
  let mainProgramId = process.env.MAIN_PROGRAM_ID;
  let mint = process.env.USDC_MINT_ADDR;

  const isLocalRPC = rpcUrl.includes("127.0.0.1") || rpcUrl.includes("localhost");
  if (dev && isLocalRPC) {
    const {mint: _mint, mainProgramId: _mainProgramId, feePayerKey: _feePayerKey} = await setupLocalEnvironment(rpcUrl);
    if (_mint && _mainProgramId) {
      mint = _mint;
      mainProgramId = _mainProgramId
      if (_feePayerKey) globalThis.feePayer = _feePayerKey;
      console.log("[prebuild] > inserted newly generated env vars")
    } else {
      throw new Error("local deployment broken, check logs");
    }
  } else if (!mint || !mainProgramId) {
    throw new Error("need mint addr and main program addr if not running on localhost");
  }

  console.log("Local environment available")

  // give http server updated evns
  globalThis.mainProgramId = new web3.PublicKey(mainProgramId!);
  globalThis.usdcMintAddr = new web3.PublicKey(mint!);

  startMaintainingAccountState(rpcUrl).then((_: any) => {
    console.log("Chain cache initted; starting helia")
    getHelia().then(_ => {
      console.log("Helia up")
    })
    const server = createHTTPServer({
      middleware: cors({
        origin: dev ? "http://localhost:5173" : ["https://openpredict.org", /\.openpredict\.org$/],
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

async function setupLocalEnvironment(rpcUrl: string) {
  let tokenAccount = "";
  let mint = "";
  let mainProgramId = "";
  let feePayerKey: web3.Keypair | undefined;
  let redeploy = true;
  let feePayerKeyBalance: any;

  // find existing spl-token accounts
  const splTokenAccountsOutput = JSON.parse((await (promisify(exec))((`spl-token accounts --output json`))).stdout);
  const accounts = splTokenAccountsOutput['accounts']

  if (accounts.length > 0) {
    tokenAccount = accounts[0]['address'];
    mint = accounts[0]['mint'];
    redeploy = false;
    console.warn("[prebuild] > found existing custom tokens (usdc), will not redeploy contract")
  }

  async function setFeePayerFromFile() {
    try {
      const _feePayerKey = await readFile("fee_payer.json", 'utf-8').catch((e) => {
        return undefined;
      })
      if (_feePayerKey) {
        feePayerKey = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(_feePayerKey)))
        const lamports = JSON.parse((await promisify(exec)(`solana balance --keypair ./fee_payer.json --output json`)).stdout);
        if (!lamports?.lamports) {
          await promisify(exec)(`solana airdrop --keypair ./fee_payer.json 1`)
        }
        feePayerKeyBalance = (await promisify(exec)(`solana balance --keypair ./fee_payer.json`)).stdout;
        return true;
      }
      return false;
    } catch (e) {
      console.error(e)
      return false;
    }
  }

  if (!await setFeePayerFromFile()) {
    await promisify(exec)(`solana-keygen new --no-bip39-passphrase -o ./fee_payer.json`)
    const created = await setFeePayerFromFile();
    if (!created) {
      console.error("Unable to create and save local fee payer keypair")
    }
  }

  console.log(`[prebuild] > Set/Created Fee Payer: ${feePayerKey?.publicKey},,balance: ${feePayerKeyBalance}`)

  if (redeploy) {
    const createTokenOutput = JSON.parse((await promisify(exec)(`spl-token create-token --decimals 6 --output json`)).stdout)
    mint = createTokenOutput['commandOutput']['address'];

    // json format doesn't provide token account 
    const createTokenAccountOuput = (await promisify(exec)(`spl-token create-account ${mint}`)).stdout;
    tokenAccount = createTokenAccountOuput.split("\n").find(line => line.includes("Creating account"))!.split(" ")[2].trim();

    await promisify(exec)(`spl-token mint ${mint} 10000000000`)
  }

  console.log(`[prebuild] > Token Account: ${tokenAccount}\n[prebuild] > Mint: ${mint}\n[prebuild] > Redeploying: ${redeploy}`)

  if (redeploy) {
    await promisify(exec)('cargo build-sbf', {cwd: "./contracts", env: {...process.env, "USDC_MINT_AUTH_ADDR": mint, "USDC_PROGRAM_ADDR": spl.TOKEN_PROGRAM_ID.toString(), "FEE_PAYER_KEY": feePayerKey?.publicKey.toBase58()}},);
    const deployOutput = JSON.parse((await promisify(exec)(`solana program deploy ./target/deploy/openpredict.so -u ${rpcUrl} --output json`, {cwd: "./contracts"})).stdout)
    mainProgramId = deployOutput['programId']
  } else {
    const programShowOutput = JSON.parse((await promisify(exec)(`solana program show --programs --output json`)).stdout);
    console.log(programShowOutput)
    mainProgramId = programShowOutput['programs'][0]['programId'];
  }

  console.log(`[prebuild] > Main Program Id: ${mainProgramId}`)


  return {
    mainProgramId,
    tokenAccount,
    mint,
    feePayerKey
  }
}



start().catch(err => {
  console.error("error in main program loop: ", err)
  process.exit(1)
})
