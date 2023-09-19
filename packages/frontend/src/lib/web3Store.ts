import { browser } from '$app/environment'
import { writable } from 'svelte/store';
import { PublicKey, type TokenAmount } from '@solana/web3.js';
import Cookies from 'js-cookie';
import { web3Workspace } from './web3Workspace';
import log from './log';

export type TSol = { amount?: number };
export type TUsdc = { publicKey?: PublicKey | null, value?: TokenAmount };
export type TAddressKey = "polygonAddress" | "polygonUsdcAddress" | "solanaAddress" | "solanaUsdcAddress";

export type TWeb3Store = {
    polygonAddress?: string | null,
    solanaAddress?: string | null,
    polygonUsdcAddress?: string | null,
    solanaUsdcAddress?: string | null,
    authedWithBackend?: boolean;
    polygonUsdcBalance?: bigint,
    solanaUsdcBalance?: bigint,
    solanaBalance?: bigint,
    polygonBalance?: bigint,
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


    function upsertAddress(value: Partial<Record<TAddressKey, string | null>>) {
        update(store => {
            store = {
                ...store,
                ...value
            }
            return store
        })
    }

    function upsertBalance(value: Partial<Record<TAddressKey, bigint>>) {
        const balances = (Object.entries(value) as [TAddressKey, bigint][]).map(a => {
            let b;
            switch (a[0]) {
                case "polygonAddress":
                    b = { polygonBalance: a[1] }
                    break;
                case 'polygonUsdcAddress':
                    b = { polygonUsdcBalance: a[1] }
                    break;
                case 'solanaAddress':
                    b = { solanaBalance: a[1] }
                case 'solanaUsdcAddress':
                    b = { solanaUsdcBalance: a[1] }
                default:
                    break;
            }
            return b;
        })
        update(store => {
            store = {
                ...store,
                ...balances
            }
            return store
        })
    }

    function updateAuthedWithBackend(value: boolean) {
        update(wss => {
            if (!wss) {
                log("error", FILE, "no store, not logged in?")
                return wss;
            }
            wss.authedWithBackend = value;
            return wss;
        })
    }

    return {
        subscribe,
        upsertAddress,
        upsertBalance,
        updateAuthedWithBackend
    }

}

export const web3Store = createWeb3Store()