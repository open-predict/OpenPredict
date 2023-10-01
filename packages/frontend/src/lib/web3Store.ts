import { browser } from '$app/environment'
import { writable } from 'svelte/store';
import type { PublicKey, TokenAmount } from '@solana/web3.js';
import Cookies from 'js-cookie';
import { web3Workspace } from './web3Workspace';
import log from './log';
import SuperJSON from 'superjson';
import type { ApiKeyCreds } from './clob';

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
    polyClobApiKeys?: ApiKeyCreds;
}

export const web3StoreLsKey = 'wallet_state';
const FILE = "web3Store";

function createWeb3Store() {

    const initialValueRaw = Cookies.get(web3StoreLsKey);
    const initialValueParsed = initialValueRaw ? SuperJSON.parse<TWeb3Store>(initialValueRaw) : undefined;
    const initialValue = initialValueParsed ? {
        ...initialValueParsed
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
        if (browser && SuperJSON.stringify(value) !== Cookies.get(web3StoreLsKey)) {
            log("debug", FILE, "setting cookies...")
            Cookies.set(web3StoreLsKey, SuperJSON.stringify(value))
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
        update(store => {
            if (!store) {
                log("error", FILE, "no store, not logged in?")
                return store;
            }
            store.authedWithBackend = value;
            return store;
        })
    }

    function updatePolyClobApiKeys(keys: ApiKeyCreds){
        update(store => {
            return {
                ...store,
                polyClobApiKeys: keys
            }
        })
    }

    function clear() {
        update(v => {
            return {};
        })
    }

    return {
        clear,
        subscribe,
        upsertAddress,
        upsertBalance,
        updateAuthedWithBackend,
        updatePolyClobApiKeys
    }

}

export const web3Store = createWeb3Store()