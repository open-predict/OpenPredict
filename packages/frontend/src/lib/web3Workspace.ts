import {writable} from 'svelte/store'
import type {TransactionInstruction, Connection, PublicKey, TokenAmount, VersionedTransaction, Transaction, TransactionError} from '@solana/web3.js';
import type {TMagic} from './createMagic';
import type {Errors, TxStatus} from './utils';
import type {TWeb3Store} from './web3Store';

export type TsignAndSendTxResponse = {txId: string, slot: number, error: null} | {error: unknown, txId: null, slot: null}

export type TWeb3Workspace = {

	magic?: TMagic,
	loginToMagic?: (email: string) => Promise<boolean>,
	logout: () => Promise<void>,

	refreshBalances: () => Promise<void>,
	refreshKeys: () => Promise<void>,
	requestSol?: () => void,

	signTransaction: (transaction: TransactionInstruction[]) => Promise<{id?: string; error?: Errors | Error, signedTx?: VersionedTransaction | Transaction}>,
	sendTransaction: (txId: string, signedTx: VersionedTransaction | Transaction) => Promise<{id?: string; error?: Errors | Error}>,
	confirmTransaction: (id: string) => Promise<{slot?: number, txError?: TransactionError, error?: Errors | Error}>,
	handleTransaction: (
		instructions: TransactionInstruction[],
		onStatus?: (status: TxStatus) => void,
		onComplete?: (slot: number, hash: string) => void,
		onError?: (e: Error | Errors) => void,
		microUsdcToSwap?: number,
	) => void,
	makeAuthenticatedRequest: (request: () => Promise<boolean>) => Promise<boolean>

};

export const web3Workspace = writable<TWeb3Workspace & TWeb3Store>(undefined);
