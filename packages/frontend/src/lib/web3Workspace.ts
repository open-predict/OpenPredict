import {writable} from 'svelte/store'
import type {TransactionInstruction, Connection, PublicKey, TokenAmount, VersionedTransaction, Transaction, TransactionError} from '@solana/web3.js';
import type {Errors, TxStatus} from './utils';
import type {TWeb3Store} from './web3Store';
import type { Web3 } from './network';
import type { ClobClient } from '$lib/clob';

export type TsignAndSendTxResponse = {txId: string, slot: number, error: null} | {error: unknown, txId: null, slot: null}

export type TWeb3Workspace = {

  login: (email: string) => Promise<boolean>,
  logout: () => Promise<void>,

  web3Evm: Web3,
  web3Sol: Web3,

  polyClob: ClobClient;

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
