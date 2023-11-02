
import { ethers, BrowserProvider, type TransactionRequest, JsonRpcSigner } from "ethers6";
import { Web3 } from "./web3"
import type { Network } from "./networks"
import type { TransactionInstruction, Transaction } from "@solana/web3.js";
import { PUBLIC_POLYGON_USDC_ADDR } from "$env/static/public";
import type { TBalance } from "$lib/web3Store";
import { erc20Abi } from "$lib/abi/erc20Abi";

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

  public async getWallet(): Promise<JsonRpcSigner | null> {
    if (!this.rpc || !this.provider) {
      return null
    }
    return await this.rpc?.getSigner()
  }

  public async getBalance(address?: string): Promise<TBalance | undefined> {
    if (!this.provider || !this.rpc) {
      return;
    }
    try {
      const signer = await this.rpc.getSigner();
      if (!address) {
        address = await signer.getAddress();
      }
      const amount = await this.rpc.getBalance(address)
      return { amount, decimals: 18 };
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
      const address = signer.getAddress();
      return address;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public async getUsdcAddress(): Promise<string | undefined> {
    return await this.getAddress()
  }

  public async getUsdcBalance(address?: string): Promise<TBalance | undefined> {
    if (!this.provider || !this.rpc) {
      return;
    }
    try {
      if (!address) address = await this.getAddress();
      const contract = new ethers.Contract(PUBLIC_POLYGON_USDC_ADDR, erc20Abi, this.rpc);
      const amount = await contract.balanceOf(address)
      const decimals = Number(await contract.decimals());
      return { amount, decimals };
    } catch (e) {
      console.error(e);
      return;
    }
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