import { Extension, Magic, type MagicSDKExtensionsOption } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana"
import { PUBLIC_MAGIC_PUBLISHABLE_API_KEY } from "$env/static/public"

export type TMagic = {
  auth: Magic['auth'],
  user: Magic['user'],
  preload: Magic['preload'],
  solana: SolanaExtension,
  wallet: Magic['wallet'],
  apiKey: Magic['apiKey'],
  rpcProvider: Magic['rpcProvider'],
  testMode: Magic['testMode'],
  nft: Magic['nft']
}

let magic: TMagic;

export default function createMagic(rpcUrl: string) {
  if(!PUBLIC_MAGIC_PUBLISHABLE_API_KEY) return null;
  magic = magic || new Magic(PUBLIC_MAGIC_PUBLISHABLE_API_KEY, {
    extensions: [
      new SolanaExtension({
        rpcUrl,
      }),
    ],
  });
  magic.preload;
  return magic;
}