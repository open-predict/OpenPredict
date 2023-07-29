import { browser } from '$app/environment'
import { writable } from 'svelte/store';
import { PublicKey, type TokenAmount } from '@solana/web3.js';
import Cookies from 'js-cookie';
import { web3Workspace } from './web3Workspace';

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

function createWeb3Store() {

    const initialValueRaw = Cookies.get(web3StoreLsKey);
    const initialValueParsed = initialValueRaw ? JSON.parse(initialValueRaw) : undefined;
    const initialValue = initialValueParsed ? {
        ...initialValueParsed, 
        publicKey: initialValueParsed.publicKey ? new PublicKey(initialValueParsed.publicKey) : initialValueParsed.publicKey === null ? null : undefined,
        usdcAddress: initialValueParsed.usdcAddress ? new PublicKey(initialValueParsed.usdcAddress) : initialValueParsed.usdcAddress === null ? null : undefined,
    } : undefined;

    console.log("web3Store initialValue", initialValue);
    const { subscribe, set, update } = writable<TWeb3Store>((() => {
        web3Workspace.update(v => ({
            ...v,
            ...initialValue
        }))
        return initialValue;
    })())

    subscribe((value) => {
        if (browser && JSON.stringify(value) !== Cookies.get(web3StoreLsKey)) {
            console.log("web3Store subscription fired")
            Cookies.set(web3StoreLsKey, JSON.stringify(value))
            // set same properties in web3Workspace to avoid a refactor, remove it later
            if (value) {
                console.log("Updating values in web3Workspace")
                web3Workspace.update(v => ({
                    ...v,
                    ...value,
                }))
            }
        }
    })

    function upsertPublicKey(value: PublicKey | null) {
        console.log("web3Store upsertPublicKey", value)
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
        console.log("updateWalletKind", magic)
        update(wss => {
            if (!wss) {
                console.error("No web3Store. Perhaps not logged in.");
                return wss;
            }
            wss.magicWallet = magic;
            return wss
        })
    }

    function updateUsdcAddress(value: PublicKey | null) {
        console.log("web3Store updateUsdcAddress", value)
        update(wss => {
            if (!wss) {
                console.error("No web3Store. Perhaps not logged in.");
                return wss;
            }
            wss.usdcAddress = value;
            return wss;
        })
    }

    function updateUsdcBalance(value?: TokenAmount) {
        console.log("web3Store updateUsdcBalance", value)
        update(wss => {
            if (!wss) {
                console.error("No web3Store. Perhaps not logged in.");
                return wss;
            }
            wss.usdc = value;
            return wss;
        })
    }

    function updateSolBalance(value: number) {
        console.log("web3Store updateSolBalance", value)
        update(wss => {
            if (!wss) {
                console.error("No web3Store. Perhaps not logged in.");
                return wss;
            }
            wss.sol = value;
            return wss;
        })
    }

    function updateOpAuth(value: boolean) {
        console.log("web3Store updateOpAuth", value)
        update(wss => {
            if (!wss) {
                console.error("No web3Store. Perhaps not logged in.");
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