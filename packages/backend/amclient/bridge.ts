import * as web3 from "@solana/web3.js"
import {Connection, Keypair, VersionedTransaction} from '@solana/web3.js';
import fetch from 'cross-fetch';
import {Wallet} from '@project-serum/anchor';
import bs58 from 'bs58';
import wormhole from "@certusone/wormhole-sdk"
import {Mutex} from "async-mutex";
import * as rubic from "rubic-sdk";
import * as spltoken from "@solana/spl-token"

const config: rubic.Configuration = {
  rpcProviders: {
    [rubic.BLOCKCHAIN_NAME.POLYGON]: {
      rpcList: ['https://polygon-rpc.com'],
    },
  }
};

const rubicSdk = await rubic.SDK.createSDK(config);

export async function balanceBridge() {
  var polygonAddressHex = process.env.POLYGON_BRIDGE_ADDRESS_HEX!;
  var polygonAddress = Buffer.from(polygonAddressHex, 'hex')
  var solanaBridgeAccountJS = process.env.SOLANA_BRIDGE_ACCOUNT;
  var solBridgeAcc: web3.Keypair
  if (solanaBridgeAccountJS == null) {
    solBridgeAcc = new web3.Keypair();
    console.log("Creating new sol bridge account: ", solBridgeAcc.publicKey);
  } else {
    solBridgeAcc = new web3.Keypair(JSON.parse(solanaBridgeAccountJS));
  }

  var solMut = new Mutex()
  async function convertSolUSDC() {
    return solMut.runExclusive(async () => {
      var currentL = (await globalThis.chainCache.w3conn.getAccountInfo(solBridgeAcc.publicKey))?.lamports
      if (currentL && currentL > 1000000000) {
        var conv = currentL - 1000000000
        rubicSdk.crossChainManager.calculateTrade({
          address: process.env.SOLANA_USDC_ADDRESS!,
          chain: "SOLANA",
        }, conv, {
          address: process.env.POLYGON_USDC_ADDRESS!,
          chain: "POLYGON",
        })
      }
    })
  }

  var solMut = new Mutex()
  async function convert

  convertSolUSDC().then(v => {})
  globalThis.chainCache.w3conn.onAccountChange(solBridgeAcc.publicKey, (accountInfo, ctx) => {
    convertSolUSDC().then(v => {})
  })
}
