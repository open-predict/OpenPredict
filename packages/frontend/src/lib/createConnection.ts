import { browser } from "$app/environment";
import { PUBLIC_SOLANA_RPC_URL } from "$env/static/public"
import { Connection } from "@solana/web3.js";

let connection: Connection;

export default function createConnection() {
  if(!browser) return null;
  return connection ?? new Connection(PUBLIC_SOLANA_RPC_URL, "confirmed");
}