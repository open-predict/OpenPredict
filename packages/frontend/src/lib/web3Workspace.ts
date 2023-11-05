import {writable} from 'svelte/store'
import type {TransactionInstruction, Connection, PublicKey, TokenAmount, VersionedTransaction, Transaction, TransactionError} from '@solana/web3.js';
import type {TWeb3Store} from './web3Store';
import type { EVM, SOL, Web3 } from './network';
import type { ClobClient } from '$lib/clob';
import type { Errors } from '$lib/errors';

export enum TxStatus {
  SIGNING = "SIGNING",
  SENDING = "SENDING",
  SWAPPING = "SWAPPING",
  CONFIRMING = "CONFIRMING",
  COMPLETE = "COMPLETE"
}

export type TsignAndSendTxResponse = {txId: string, slot: number, error: null} | {error: unknown, txId: null, slot: null}

export type TWeb3Workspace = {

  login: (email: string) => Promise<boolean>,
  logout: () => Promise<void>,

  web3Evm: EVM,
  web3Sol: SOL,

  polyClob: ClobClient,
  refreshBalances: () => Promise<void>,
  refreshKeys: () => Promise<void>,

  handleTransaction: (
    instructions: TransactionInstruction[],
    onStatus?: (status: TxStatus) => void,
    onComplete?: (slot: number, hash: string) => void,
    onError?: (e: Error | Errors) => void,
  ) => void,
  makeAuthenticatedRequest: (request: () => Promise<boolean>) => Promise<boolean>

};

export const web3Workspace = writable<TWeb3Workspace & TWeb3Store>(undefined);
