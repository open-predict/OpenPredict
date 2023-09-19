import type {PublicKey} from "@solana/web3.js";
import type {extMarketChaindata, marketChaindata} from "@am/backend/types/market";
import {createAvatar} from '@dicebear/core';
import * as shapes from '@dicebear/shapes';
import {PUBLIC_FEE_PAYER_KEY} from "$env/static/public"

export const USDC_PER_DOLLAR = 1000000;
const fee_payer = new web3.PublicKey(PUBLIC_FEE_PAYER_KEY);

export enum Errors {
  LOGGED_OUT = "LOGGED_OUT",
  NO_CONNECTION = "NO_CONNECTION",
  INSUFFICENT_SOL = "INSUFFICENT_SOL",
  INSUFFICENT_USDC = "INSUFFICENT_USDC",
  UNABLE_TO_SWAP = "UNABLE_TO_SWAP",
  NO_WALLET = "NO_WALLET",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
  CHECK_CONSOLE = "CHECK_CONSOLE"
}

export enum TxStatus {
  SIGNING = "SIGNING",
  SENDING = "SENDING",
  SWAPPING = "SWAPPING",
  CONFIRMING = "CONFIRMING",
  COMPLETE = "COMPLETE"
}

export type TLinkDef = {href: string, name: string, Icon: any}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const solFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 1,
  maximumFractionDigits: 9,
});

export const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  dateStyle: "short",
});

export function autoresizeTextarea(node: any) {
  const handleInput = (e: Event) => {
    node.style.height = "0"
    node.style.height = node.scrollHeight + "px";
  };
  document.addEventListener("input", handleInput, false);
  document.addEventListener("focus", handleInput, false);
  return {
    destroy() {
      document.removeEventListener("click", handleInput, false);
      document.removeEventListener("focus", handleInput, false);
    },
  };
}

export function getUserShares(marketData: extMarketChaindata, publicKey?: PublicKey | null): {shares: bigint, sharesUI: number, valueCents: number} {
  let ret = {shares: 0n, sharesUI: 0, valueCents: 0};
  if (!publicKey) return ret;
  const current = marketData.UserAccounts.get(publicKey.toBase58());
  const centsPerYes = 100 * getChance(marketData.data.Yes, marketData.data.No);
  ret.shares = current ? current.Shares : 0n
  ret.sharesUI = current ? Math.round((Number(ret.shares) / USDC_PER_DOLLAR) * 100) / 100 : 0;
  const resolvedInFavor = marketData.data.Resolved === null ? null : (marketData.data.Resolved && ret.sharesUI > 0) || (!marketData.data.Resolved && ret.sharesUI < 0)
  if (marketData.data.Resolved) {
    ret.valueCents = resolvedInFavor ? Math.abs(ret.sharesUI) * 100 : 0;
  } else {
    ret.valueCents = ret.sharesUI > 0 ? centsPerYes * Math.abs(ret.sharesUI) : (100 - centsPerYes) * Math.abs(ret.sharesUI);
  }
  return ret;
}

export function getChance(yes: bigint, no: bigint) {
  return Number(yes + no) !== 0 ? Number((no * 10000n) / (no + yes)) / 10000 : .50
}

export function generateProfileImage(publicKey: string) {
  const full = ["ellipse", "ellipseFilled", "line", "polygon", "polygonFilled", "rectangle", "rectangleFilled"];
  const shapeColors = ["0284c7", "4f46e5", "4338ca"]
  return createAvatar(shapes, {
    seed: publicKey,
    backgroundType: ["gradientLinear"],
    backgroundColor: ["c4b5fd", "7dd3fc", "67e8f9"],
    shape1Color: shapeColors,
    shape2Color: shapeColors,
    shape3Color: shapeColors,
    shape1: ["ellipse", "line"],
    shape2: ["ellipse", "line"],
    shape3: ["ellipse", "line"]
  }).toDataUriSync();
}

export function readablePublicKey(publicKey: PublicKey) {
  const publicKeyString = publicKey.toBase58();
  return `${publicKeyString.substring(0, 4)}...${publicKeyString.slice(-4)}`;
}

export function timeAgo(date: Date) {
  const formatter = new Intl.RelativeTimeFormat('en-US');
  const ranges: Record<string, number> = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1
  };
  type RelativeTimeFormatUnit =
    | "year" | "years"
    | "quarter" | "quarters"
    | "month" | "months"
    | "week" | "weeks"
    | "day" | "days"
    | "hour" | "hours"
    | "minute" | "minutes"
    | "second" | "seconds"
    ;
  const units: RelativeTimeFormatUnit[] = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"]; // order matters here.
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  let i = 0;
  for (let key in ranges) {
    i++;
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), units[i - 1]);
    }
  }
}

export function getBuyShareAmount(data: marketChaindata, microUSDC: number, direction: boolean): {
  shares: BigInt,
  newRatio: number,
  newYes: BigInt,
  newNo: BigInt
} {
  var newData: {
    Yes: bigint,
    No: bigint,
    Subsidy: bigint,
  } = {
    Yes: data.Yes,
    No: data.No,
    Subsidy: data.Subsidy,
  };
  newData.No += BigInt(microUSDC);
  newData.Yes += BigInt(microUSDC);
  if (direction) {
    var init_yes = newData.Yes;
    newData.Yes = (newData.Subsidy * newData.Subsidy) / newData.No
    return {
      shares: init_yes - newData.Yes,
      newRatio: Number(newData.No * 1000n / (newData.Yes + newData.No)) / 1000,
      newYes: newData.Yes,
      newNo: newData.No
    }
  } else {
    var initNo = newData.No;
    newData.No = (newData.Subsidy * newData.Subsidy) / newData.Yes
    return {
      shares: initNo - newData.No,
      newRatio: Number(newData.No * 1000n / (newData.Yes + newData.No)) / 1000,
      newYes: newData.Yes,
      newNo: newData.No
    }
  }
}

function sqrt(value: bigint) {
  if (value < 0n) {
    throw 'square root of negative numbers is not supported'
  }

  if (value < 2n) {
    return value;
  }

  function newtonIteration(n: bigint, x0: bigint) {
    const x1 = ((n / x0) + x0) >> 1n;
    if (x0 === x1 || x0 === (x1 - 1n)) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(value, 1n);
}

export function getSellUsdcLimit(data: marketChaindata, userShares: bigint) {

  //  yes case
  // data.yes + D - userShares = S^2 / data.yes + D
  // console.log(userShares, data.Yes, data.No, data.Subsidy)

  userShares = -userShares;

  var y, n, z;
  if (userShares < 0) {
    y = data.Yes;
    n = data.No;
    z = -userShares;
  } else {
    y = data.No;
    n = data.Yes;
    z = userShares;
  }
  const rooted = BigInt(4) * data.Subsidy * data.Subsidy + n * n - BigInt(2) * n * (y + z) + (y + z) * (y + z);
  var root = sqrt(rooted);
  const re = (root - n - y + z) / BigInt(2)
  return re;
}

import * as web3 from "@solana/web3.js"
import * as web3spl from "@solana/spl-token"
import {openpredict} from './pb/oppb.js'

export async function swapCoinsInstructions(
  connection: web3.Connection,
  wallet: web3.PublicKey,
  inputMint: web3.PublicKey,
  outputMint: web3.PublicKey,
  amount: number,
  legacyTransaction?: boolean,
): Promise<[web3.TransactionInstruction[], web3.AddressLookupTableAccount[]?]> {
  const {data} = await (
    await fetch(`https://quote-api.jup.ag/v4/quote?inputMint=${inputMint.toString()}&outputMint=${outputMint.toString()}&amount=${amount}&swapMode=ExactOut&slippageBps=${1}&asLegacyTransaction=${legacyTransaction === true}&onlyDirectRoutes=${true}`)
  ).json();
  const routes = data;

  if (!routes || routes.length === 0) {
    throw new Error("No routes found")
  }

  // get serialized transactions for the swap
  const transactions = await (
    await fetch('https://quote-api.jup.ag/v4/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // route from /quote api
        route: routes[0],
        // user public key to be used for the swap
        userPublicKey: wallet.toString(),
        // auto wrap and unwrap SOL. default is true
        wrapUnwrapSOL: true,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // This is the ATA account for the output token where the fee will be sent to. If you are swapping from SOL->USDC then this would be the USDC ATA you want to collect the fee.
        // feeAccount: "fee_account_public_key"
        asLegacyTransaction: legacyTransaction === true,
      })
    })
  ).json();

  const {swapTransaction} = transactions;

  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  if (legacyTransaction !== true) {
    var transaction = web3.VersionedTransaction.deserialize(swapTransactionBuf);
    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new web3.AddressLookupTableAccount({
          key: lookup.accountKey,
          state: web3.AddressLookupTableAccount.deserialize(await connection.getAccountInfo(lookup.accountKey).then((res) => res!.data)),
        })
      }),
    )
    return [web3.TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts: addressLookupTableAccounts,
    }).instructions, addressLookupTableAccounts]
  } else {
    var trans = web3.Transaction.from(swapTransactionBuf);
    return [
      trans.instructions,
      undefined,
    ]
  }
}

export async function subsidizeMarketInstruction(
  usdcMintAuthorityId: web3.PublicKey,
  mainProgramId: web3.PublicKey,
  publicKey: web3.PublicKey,
  amm_address: Uint8Array,
  subsidy: number,
) {
  if (amm_address.length != 32) {
    throw "Wrong amm address length";
  }
  const buf = openpredict.Instruction.encode({
    subsidizeMarket: {
      ammAddress: amm_address,
      subsidy: subsidy,
    },
  }).finish()

  const marketAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("data")], mainProgramId)[0];

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, publicKey),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: marketAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, marketAddress, true),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3spl.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}
export async function initMarketInstruction(
  usdcMintAuthorityId: web3.PublicKey,
  mainProgramId: web3.PublicKey,
  publicKey: web3.PublicKey,
  cid: Uint8Array,
  amm_address: Uint8Array,
  subsidy: number,
) {
  if (amm_address.length != 32) {
    throw "Wrong amm address length";
  }
  console.log("Cid length: ", cid.length);

  const buf = openpredict.Instruction.encode({
    initMarket: {
      ammAddress: amm_address,
      cid: cid,
      subsidy: subsidy,
    },
  }).finish()

  const marketAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("data")], mainProgramId)[0];

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, publicKey),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: marketAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, marketAddress, true),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: usdcMintAuthorityId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3spl.TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: web3spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}

export async function initMarketAccountInstruction(
  publicKey: web3.PublicKey,
  amm_address: Uint8Array,
  mainProgramId: web3.PublicKey,
) {

  if (amm_address.length != 32) {
    throw "Wrong amm address length";
  }

  const buf = openpredict.Instruction.encode({
    initMarketAccount: {
      ammAddress: amm_address,
    },
  }).finish()

  const marketDataAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("data")], mainProgramId)[0];
  const accountAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("users"), publicKey.toBuffer()], mainProgramId)[0];

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: marketDataAddress,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: accountAddress,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}

export async function buySharesInstruction(
  usdcMintAuthorityId: web3.PublicKey,
  mainProgramId: web3.PublicKey,
  publicKey: web3.PublicKey,
  amm_address: Uint8Array,
  micro_usdc: number,
  direction: boolean,
  expected_amount: number,
  drift: number,
) {

  if (amm_address.length != 32) {
    throw "Wrong amm address length";
  }

  console.log("nano usdc", micro_usdc)
  const buf = openpredict.Instruction.encode({
    buyShares: {
      ammAddress: amm_address,
      microUsdc: micro_usdc,
      direction: direction,
      expectedAmount: expected_amount,
      drift: drift,
    },
  }).finish()

  const marketDataAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("data")], mainProgramId)[0];
  const accountAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("users"), publicKey.toBuffer()], mainProgramId)[0];

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, publicKey, true),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: marketDataAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, marketDataAddress, true),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: accountAddress,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: web3spl.TOKEN_PROGRAM_ID,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}

export async function resolveMarketInstruction(
  publicKey: web3.PublicKey,
  mainProgramId: web3.PublicKey,
  amm_address: Uint8Array,
  direction: boolean,
) {
  if (amm_address.length != 32) {
    throw "Wrong amm address length";
  }
  const buf = openpredict.Instruction.encode({
    resolveMarket: {
      ammAddress: amm_address,
      direction: direction,
    },
  }).finish()

  const marketDataAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("data")], mainProgramId)[0];

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: marketDataAddress,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}

export async function createProfileInstruction(
  publicKey: web3.PublicKey,
  username: string,
  mainProgramId: web3.PublicKey,
  cid: Uint8Array,
) {
  console.log("Creating createProfileInstruction with username ", username, " for pubkey ", publicKey);
  const buf = openpredict.Instruction.encode({
    createAccount: {
      username: username,
      cid: cid,
    },
  }).finish()
  const usernameAccountAddress = web3.PublicKey.findProgramAddressSync([Buffer.from("username"), Buffer.from(username)], mainProgramId)[0];
  const profileAccountAddress = web3.PublicKey.findProgramAddressSync([Buffer.from("profile"), publicKey.toBuffer()], mainProgramId)[0];

  if (!usernameAccountAddress || !profileAccountAddress) {
    throw new Error("Either no usernameAccountAddress or profileAccountAddress")
  }

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: usernameAccountAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: profileAccountAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}

export async function redeemSharesInstruction(
  usdcMintAuthorityId: web3.PublicKey,
  mainProgramId: web3.PublicKey,
  publicKey: web3.PublicKey,
  amm_address: Uint8Array,
) {
  if (amm_address.length != 32) {
    throw "Wrong amm address length";
  }
  const buf = openpredict.Instruction.encode({
    redeemShares: {
      ammAddress: amm_address,
    },
  }).finish()

  const marketDataAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("data")], mainProgramId)[0];
  const accountAddress = web3.PublicKey.findProgramAddressSync([amm_address, Buffer.from("users"), publicKey.toBuffer()], mainProgramId)[0];

  return new web3.TransactionInstruction({
    keys: [
      {
        pubkey: publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: fee_payer,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, publicKey, true),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: marketDataAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3spl.getAssociatedTokenAddressSync(usdcMintAuthorityId, marketDataAddress, true),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: accountAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3spl.TOKEN_PROGRAM_ID,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    programId: mainProgramId,
    data: Buffer.from(buf),
  })
}
