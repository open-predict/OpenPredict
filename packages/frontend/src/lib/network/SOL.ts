
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { Network } from "./networks"
import { Web3 } from "./web3"
import { PUBLIC_FEE_PAYER_KEY, PUBLIC_SOLANA_RPC_URL, PUBLIC_USDC_MINT_ADDR } from "$env/static/public";
import { SolanaWallet } from "@web3auth/solana-provider";
import * as web3spl from "@solana/spl-token";
import { trpcc } from "$lib/trpc";

const usdcMintAddr = new PublicKey(PUBLIC_USDC_MINT_ADDR);
const payerKey = new PublicKey(PUBLIC_FEE_PAYER_KEY);

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

  public async getBalance(): Promise<bigint | undefined> {
    const address = this.getAddress();
    if (!address) {
      return;
    }
    const balance = await this.connection.getBalance(new PublicKey(address))
    return BigInt(balance);
  }

  public async getUsdcBalance(): Promise<bigint | undefined> {
    const address = await this.getUsdcAddress();
    if (!address) {
      console.error("Cannot get solana usdc account balance, no account")
    }
    const balance = await this.connection.getTokenAccountBalance(new PublicKey(address!));
    return BigInt(balance.value.amount)
  }

  public async getAddress(): Promise<string | undefined> {
    if (!this.solanaWallet) {
      return;
    }
    try {
      const acc = await this.solanaWallet.requestAccounts();
      if (acc.length > 0) {
        return acc[0];
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public async getUsdcAddress(): Promise<string | undefined> {
    const address = await this.getAddress();
    if (!address || !this.connection) {
      console.error("Can't get usdc address, not logged in.")
      return;
    }
    const pubKey = new PublicKey(address);
    try {
      const accountPubKey = await web3spl.getAssociatedTokenAddress(
        usdcMintAddr,
        pubKey,
        false
      );
      const account = await web3spl.getAccount(this.connection, accountPubKey);
    } catch (err: unknown) {
      if (err instanceof web3spl.TokenAccountNotFoundError) {
        const res = await trpcc.makeUsdcWallet.query({
          user: pubKey.toBase58(),
        });
        if (res.error || !res.address) {
          console.error("Unable to create USDC wallet", res.error);
        } else {
          return res.address.toBase58()
        }
      } else {
        console.error("Unable to create USDC wallet", err);
      }
    }
  }

  public async signTransaction(instructions: TransactionInstruction[]): Promise<Transaction | undefined> {
    if (!this.solanaWallet) {
      console.error("No solana wallet")
      return;
    }
    let transaction = new Transaction({
      feePayer: payerKey,
      recentBlockhash: (await this.connection.getLatestBlockhash()).blockhash,
    });
    transaction.add(...instructions);
    const signedTx = await this.solanaWallet.signTransaction(transaction);
    return transaction;
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