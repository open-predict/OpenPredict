import { writable } from 'svelte/store';

export enum Modal {
    login = "login",
    low_sol = "low_sol",
    swap = "swap",
    no_usdc_account = "no_usdc_account",
    search_markets = "search_markets",
    backend_auth = "backend_auth",
    send_funds = "send_funds", 
    redeem_shares = "redeem_shares",
    account_summary = "account_summary",
} 

type TModalStore = Record<Modal, boolean>;

function createModalStore() {
    const {subscribe, update, set} = writable<TModalStore>({
        login: false,
        low_sol: false, 
        swap: false,
        no_usdc_account: false,
        search_markets: false,
        backend_auth: false,
        send_funds: false,
        redeem_shares: false,
        account_summary: false,
    });

    function openModal(modal: Modal) {
        update(modals => {
            modals[modal] = true; 
            return modals;
        })
    }

    function closeModal(modal: Modal){
        update(modals => {
            modals[modal] = false; 
            return modals;
        })
    }

    return {
        subscribe,
        openModal, 
        closeModal
    }
}

export const modalStore = createModalStore()