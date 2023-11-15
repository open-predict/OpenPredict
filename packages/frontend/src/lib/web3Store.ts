import { browser } from '$app/environment'
import { writable } from 'svelte/store';
import Cookies from 'js-cookie';
import { web3Workspace } from '$lib/web3Workspace';
import log from '$lib/log';
import type { ApiKeyCreds } from '$lib/clob';
import { superjson } from '$lib/superjson';
import { usd } from './utils/format';
import _ from 'lodash';

export type TCurrency = "SOL" | "USDC" | "MATIC";

export type TAmount = {
    amount: bigint,
    decimals: number
}

export type TBalance = TAmount & {
    ui?: number,
    usd?: string
}

export type TBalances = Partial<Record<TCurrency, TBalance>>;

export type TAccount = {
    address: string,
    balances: TBalances
}

export type TAccountKey = "polygon" | "solana" | "polymarket" | "solanaUsdc";

export type TWeb3Store = Partial<Record<TAccountKey, TAccount | null>> & {
    authedWithBackend?: boolean;
    polyClobApiKeys?: ApiKeyCreds;
} | undefined;

export const web3StoreLsKey = 'web3storeV0';
const FILE = "web3Store";

function createWeb3Store() {

    const initialValueRaw = Cookies.get(web3StoreLsKey);
    const initialValueParsed = initialValueRaw ? superjson.parse<TWeb3Store>(initialValueRaw) : undefined;
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
        if (browser && superjson.stringify(value) !== Cookies.get(web3StoreLsKey)) {
            log("debug", FILE, "setting cookies...")
            Cookies.set(web3StoreLsKey, superjson.stringify(value))
        }
    })


    function upsertAddress(value: Partial<Record<TAccountKey, string | null>>) {
        update(store => {
            store = store ? _.clone(store) : {};
            for (const [_accountKey, address] of Object.entries(value)) {
                const accountKey = _accountKey as TAccountKey;
                if (accountKey) {
                    if (!address) {
                        delete store[accountKey];
                    } else {
                        if (store[accountKey]?.address !== address) {
                            store[accountKey] = {
                                address,
                                balances: {}
                            }
                        }
                    }
                }
            }
            return store
        })
    }

    function upsertBalance(value: Partial<Record<TAccountKey, TBalances>>) {
        update(store => {
            let ns = _.clone(store);
            if (ns) {
                for (const [_accountKey, balances] of Object.entries(value)) {
                    const accountKey = _accountKey as TAccountKey;
                    if (ns[accountKey] && ns[accountKey]?.balances) {
                        for (const [_currency, balance] of Object.entries(balances)) {
                            const currency = _currency as TCurrency;
                            if (currency && balance) {
                                const ui = Number((balance.amount*100n) / (10n ** BigInt(balance.decimals)))/100;
                                ((ns[accountKey] as TAccount).balances[currency] as TBalance) = {
                                    ...balance,
                                    ui
                                }
                                console.log(`Upserting ${accountKey} ${currency} to ${ui}...`);
                                switch (currency) {
                                    case "MATIC":
                                        ((ns[accountKey] as TAccount).balances[currency] as TBalance).usd = usd.format(ui * 0.5);
                                        break;
                                    case "SOL":
                                        ((ns[accountKey] as TAccount).balances[currency] as TBalance).usd = usd.format(ui * 15);
                                        break;
                                    case "USDC":
                                        ((ns[accountKey] as TAccount).balances[currency] as TBalance).usd = usd.format(ui * 1);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            return ns;
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

    function updatePolyClobApiKeys(keys: ApiKeyCreds) {
        update(store => {
            return {
                ...store,
                polyClobApiKeys: keys
            }
        })
    }

    function clear() {
        update(v => {
            return {
                solana: null,
                polygon: null,
                solanaUsdc: null,
                polymarket: null,
                authedWithBackend: false
            };
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