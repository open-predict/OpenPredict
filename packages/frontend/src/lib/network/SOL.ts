
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { Network } from "./networks"
import { Web3 } from "./web3"
import { PUBLIC_OP_FEE_PAYER_ADDR, PUBLIC_SOLANA_RPC_URL, PUBLIC_SOLANA_USDC_ADDR } from "$env/static/public";
import { SolanaWallet } from "@web3auth/solana-provider";
import * as web3spl from "@solana/spl-token";
import type { TBalance } from "$lib/web3Store";
import { api } from "$lib/api";
// import { trpcc } from "$lib/trpc";

const usdcMintAddr = new PublicKey(PUBLIC_SOLANA_USDC_ADDR);
const payerKey = new PublicKey(PUBLIC_OP_FEE_PAYER_ADDR);

export class SOL extends Web3 {

  solanaWallet: SolanaWallet | null = null;

  public network: Network;
  private connection: Connection;

  constructor() {
    super()
    this.network = Network.Solana
    this.connection = new Connection(PUBLIC_SOLANA_RPC_URL, "confirmed")
  }

  public initRPC(): void {
    this.solanaWallet = new SolanaWallet(this.provider!)
  }

  public async getWallet(): Promise<SolanaWallet | null> {
    return this.solanaWallet
  }

  public async getBalance(): Promise<TBalance | undefined> {
    const address = await this.getAddress();
    if (!address) {
      console.error("Cannot get solana account balance, no account")
      return;
    }
    const balance = await this.connection.getBalance(new PublicKey(address));
    console.log("balance", address, balance)
    return { amount: BigInt(balance), decimals: 9 };
  }

  public async getUsdcBalance(): Promise<TBalance | undefined> {
    const address = await this.getUsdcAddress();
    if (!address) {
      console.error("Cannot get solana usdc account balance, no account")
      return;
    }
    const balance = await this.connection.getTokenAccountBalance(new PublicKey(address!));
    return { amount: BigInt(balance.value.amount), decimals: balance.value.decimals }
  }

  public async getAddress(): Promise<string | undefined> {
    try {
      if (!this.solanaWallet) throw new Error("No solana wallet")
      const acc = await this.solanaWallet.requestAccounts();
      if (acc.length === 0) throw new Error("No solana accounts");
      return acc[0];
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public async getUsdcAddress(): Promise<string | undefined> {
    try {
      const address = await this.getAddress();
      if (!address) throw new Error("No solana address");
      if (!this.connection) throw new Error("No solana connection");
      const pubKey = new PublicKey(address);
      try {
        const accountPubKey = await web3spl.getAssociatedTokenAddress(
          usdcMintAddr,
          pubKey,
          false
        );
        const account = await web3spl.getAccount(this.connection, accountPubKey);
        return account.address.toBase58()
      } catch (err: unknown) {
        if (err instanceof web3spl.TokenAccountNotFoundError) {
          const res = await api.makeUsdcWallet.query({
            user: pubKey.toBase58(),
          });
          if (res.error || !res.address) {
            console.error("Unable to create USDC wallet", res.error);
          } else {
            return res.address as unknown as string
          }
        } else {
          console.error("Unable to create USDC wallet", err);
        }
      }
    } catch (e) {
      console.error("Can't get usdc address", e)
      return;
    }
  }

  public async signTransaction(instructions: TransactionInstruction[]): Promise<Transaction | undefined> {
    if (!this.solanaWallet) {
      console.error("No solana wallet")
      return;
    }
    console.log("Signing transaction...")
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash("confirmed");
    console.log("blockhash:", blockhash, lastValidBlockHeight)
    let transaction = new Transaction({
      feePayer: payerKey,
      recentBlockhash: blockhash
    });
    transaction.add(...instructions);
    console.log("keys:", transaction.feePayer)
    const signedTx = await this.solanaWallet.signTransaction(transaction);
    console.log("transaction instructions:", transaction.instructions)
    return signedTx;
  }

  public async signMessage(data: Uint8Array): Promise<Uint8Array | undefined> {
    if (!this.solanaWallet) {
      console.error("No solana wallet")
      return;
    }
    const signed = await this.solanaWallet.signMessage(data);
    return signed;
  }

  public async sendTransaction(tx: string | Transaction): Promise<boolean> {
    return false
  }

  public async confirmTransaction(tx: string): Promise<boolean> {
    return false
  }

}

// const sendTransaction = async (
//   txId: string,
//   signedTx: VersionedTransaction | Transaction
// ): Promise<{ id?: string; error?: Errors | Error }> => {
//   try {
//     if (!connection) return { error: Errors.NO_CONNECTION };
//     let id = txId;
//     log("info", FILE, "sending transaction to connection...", id);
//     id = await connection.sendRawTransaction(signedTx.serialize());
//     log("info", FILE, "sent transaction to connection", id);
//     return { id };
//   } catch (e: any) {
//     log("error", FILE, e);
//     if (e instanceof Error) {
//       return {
//         error: e,
//       };
//     }
//     return {
//       error: new Error(e),
//     };
//   }
// };

// const confirmTransaction = async (
//   id: string
// ): Promise<{
//   slot?: number;
//   txError?: TransactionError;
//   error?: Errors | Error;
// }> => {
//   // TODO: Add timeout
//   if (!connection) return { error: Errors.NO_CONNECTION };
//   try {
//     let latestBlockhash = await connection.getLatestBlockhash();
//     const confirmation = await connection.confirmTransaction({
//       signature: id,
//       lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//       blockhash: latestBlockhash.blockhash,
//     });
//     if (confirmation.value.err) log("error", FILE, confirmation.value.err);
//     return {
//       txError: confirmation.value.err ?? undefined,
//       slot: confirmation.context.slot,
//     };
//   } catch (e: any) {
//     log("error", FILE, e);
//     if (e instanceof Error) {
//       return {
//         error: e,
//       };
//     }
//     return {
//       error: new Error(e),
//     };
//   }
// };