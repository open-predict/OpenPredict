import { browser } from '$app/environment'
import { writable } from 'svelte/store';
import { PublicKey, type TokenAmount } from '@solana/web3.js';
import Cookies from 'js-cookie';
import { web3Workspace } from './web3Workspace';
import log from './log';

export type TSol = { amount?: number };
export type TUsdc = { publicKey?: PublicKey | null, value?: TokenAmount };

export type TWeb3Store = {
    publicKey?: PublicKey | null,
    usdcAddress?: PublicKey | null;
    magicWallet?: boolean,
    oPauthed?: boolean;
    usdc?: TokenAmount,
    sol?: number,
}

export const web3StoreLsKey = 'wallet_state';
const FILE = "web3Store";

function createWeb3Store() {

    const initialValueRaw = Cookies.get(web3StoreLsKey);
    const initialValueParsed = initialValueRaw ? JSON.parse(initialValueRaw) : undefined;
    const initialValue = initialValueParsed ? {
        ...initialValueParsed, 
        publicKey: initialValueParsed.publicKey ? new PublicKey(initialValueParsed.publicKey) : initialValueParsed.publicKey === null ? null : undefined,
        usdcAddress: initialValueParsed.usdcAddress ? new PublicKey(initialValueParsed.usdcAddress) : initialValueParsed.usdcAddress === null ? null : undefined,
    } : undefined;

    const { subscribe, set, update } = writable<TWeb3Store>((() => {
        log("debug", FILE, "initializing web3store & updating web3workspace...")
        web3Workspace.update(v => ({
            ...v,
            ...initialValue
        }))
        return initialValue;
    })())

    subscribe((value) => {
        log("debug", FILE, "subscribe")
        if (browser && JSON.stringify(value) !== Cookies.get(web3StoreLsKey)) {
            log("debug", FILE, "setting cookies...")
            Cookies.set(web3StoreLsKey, JSON.stringify(value))
            // set same properties in web3Workspace to avoid a refactor, remove it later
            if (value) {
                log("debug", FILE, "updating workspace in subscribe...")
                web3Workspace.update(v => ({
                    ...v,
                    ...value,
                }))
            }
        }
    })

    function upsertPublicKey(value: PublicKey | null) {
        log("debug", FILE, "upsertPublicKey", value)
        update(wss => {
            if (!wss) {
                wss = { publicKey: value, magicWallet: false }
            } else {
                wss.publicKey = value;
            }
            return wss
        })
    }

    function updateWalletKind(magic: boolean) {
        log("debug", FILE, "updateWalletKind", magic)
        update(wss => {
            if (!wss) {
                log("error", FILE, "no store, not logged in?")
                return wss;
            }
            wss.magicWallet = magic;
            return wss
        })
    }

    function updateUsdcAddress(value: PublicKey | null) {
        log("debug", FILE, "updateUsdcAddress", value)
        update(wss => {
            if (!wss) {
                log("error", FILE, "no store, not logged in?")
                return wss;
            }
            wss.usdcAddress = value;
            return wss;
        })
    }

    function updateUsdcBalance(value?: TokenAmount) {
        log("debug", FILE, "updateUsdcBalance", value)
        update(wss => {
            if (!wss) {
                log("error", FILE, "no store, not logged in?")
                return wss;
            }
            wss.usdc = value;
            return wss;
        })
    }

    function updateSolBalance(value: number) {
        log("debug", FILE, "updateSolBalance", value)
        update(wss => {
            if (!wss) {
                log("error", FILE, "no store, not logged in?")
                return wss;
            }
            wss.sol = value;
            return wss;
        })
    }

    function updateOpAuth(value: boolean) {
        log("debug", FILE, "updateOpAuth", value)
        update(wss => {
            if (!wss) {
                log("error", FILE, "no store, not logged in?")
                return wss;
            }
            wss.oPauthed = value;
            return wss;
        })
    }

    return {
        subscribe,
        upsertPublicKey,
        updateWalletKind,
        updateUsdcAddress,
        updateSolBalance,
        updateUsdcBalance,
        updateOpAuth
    }

}

export const web3Store = createWeb3Store()