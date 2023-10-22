
import { ethers, BrowserProvider, type TransactionRequest } from "ethers6";
import { Web3 } from "./web3"
import type { Network } from "./networks"
import type { TransactionInstruction, Transaction } from "@solana/web3.js";

export class EVM extends Web3 {

  rpc: BrowserProvider | null = null

  public network: Network

  constructor(network: Network) {
    super()
    this.network = network
  }

  public initRPC(): void {
    this.rpc = new ethers.BrowserProvider(this.provider!);
  }

  public async getBalance(): Promise<bigint | undefined> {
    if (!this.provider || !this.rpc) {
      return;
    }
    try {
      const signer = await this.rpc.getSigner();
      const address = signer.getAddress();
      const balance = await this.rpc.getBalance(address)
      return balance;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public async getAddress(): Promise<string | undefined> {
    if (!this.provider || !this.rpc) {
      return;
    }
    try {
      const signer = await this.rpc.getSigner();
      console.log
      const address = signer.getAddress();
      return address;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public async getUsdcAddress(): Promise<string | undefined> {
    console.error("evm getUsdcAddress not implemented")
    return "abc";
  }

  public async getUsdcBalance(): Promise<bigint | undefined> {
    console.error("evm getUsdcBalance not implemented")
    return 0n;
  }

  public async signTransaction(tx: TransactionRequest): Promise<undefined | string> {
    if (!this.provider || !this.rpc) {
      return;
    }
    const signer = await this.rpc.getSigner();
    return await signer.signTransaction(tx)
  }

  public async signMessage(data: Uint8Array): Promise<Uint8Array | undefined> {
    if (!this.provider || !this.rpc) {
      return;
    }
    const signer = await this.rpc.getSigner();
    return Buffer.from(await signer.signMessage(data))
  }

  public async sendTransaction(tx: string | Transaction): Promise<boolean> {
    return false
  }

  public async confirmTransaction(tx: string): Promise<boolean> {
    return false
  }

}