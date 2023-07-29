<script lang="ts">
    import { walletStore, type WalletStore } from '@svelte-on-solana/wallet-adapter-core';
    import WalletButton from './WalletButton.svelte';
    import WalletConnectButton from './WalletConnectButton.svelte';
    import WalletModal from './WalletModal.svelte';
    import './styles.css';
    export let maxNumberOfWallets = 3;
    $: ({ publicKey, wallet, disconnect, connect, select } = $walletStore);
    let dropDrownVisible = false,
        modalVisible = false,
        copied = false;
    $: base58 = publicKey && publicKey?.toBase58();
    $: content = showAddressContent($walletStore);
    const copyAddress = async () => {
        if (!base58) return;
        await navigator.clipboard.writeText(base58);
        copied = true;
        setTimeout(() => (copied = false), 400);
    };
    const openDropdown = () => (dropDrownVisible = true);
    const closeDropdown = () => (dropDrownVisible = false);
    const openModal = () => {
        modalVisible = true;
        closeDropdown();
    };
    const closeModal = () => (modalVisible = false);
    function showAddressContent(store: WalletStore) {
        const base58 = store.publicKey?.toBase58();
        if (!store.wallet || !base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }
    async function connectWallet(event: CustomEvent<any>) {
        console.log("Trying to connect wallet")
        closeModal();
        await select(event.detail);
        await connect();
    }
    async function disconnectWallet(event: MouseEvent & {
    currentTarget: EventTarget & HTMLLIElement;
}) {
        closeDropdown();
        await disconnect();
    }
    interface CallbackType {
        (arg?: string): void;
    }
    function clickOutside(
        node: HTMLElement,
        callbackFunction: CallbackType,
    ): unknown {
        function onClick(event: MouseEvent) {
            if (
                node &&
                event.target instanceof Node &&
                !node.contains(event.target) &&
                !event.defaultPrevented
            ) {
                callbackFunction();
            }
        }
        document.body.addEventListener('click', onClick, true);
        return {
            update(newCallbackFunction: CallbackType) {
                callbackFunction = newCallbackFunction;
            },
            destroy() {
                document.body.removeEventListener('click', onClick, true);
            },
        };
    }
</script>

{#if !wallet}
    <WalletButton class="wallet-adapter-button-trigger" on:click={openModal}>
        <slot>Select Wallet</slot>
    </WalletButton>
{:else if !base58}
    <WalletConnectButton />
{:else}
    <div class="wallet-adapter-dropdown">
        <WalletButton
            on:click={openDropdown}
            class="wallet-adapter-button-trigger"
        >
            <svelte:fragment slot="start-icon">
                <img src={wallet.icon} alt={`${wallet.name} icon`} />
            </svelte:fragment>
            {content}
        </WalletButton>
        {#if dropDrownVisible}
            <ul
                aria-label="dropdown-list"
                class="wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active"
                role="menu"
            >
                <li
                    on:click={copyAddress}
                    on:keypress={e => {console.log(e)}}
                    class="wallet-adapter-dropdown-list-item"
                    role="menuitem"
                >
                    {copied ? 'Copied' : 'Copy address'}
                </li>
                <li
                    on:click={openModal}
                    on:keypress={e => {console.log(e)}}
                    class="wallet-adapter-dropdown-list-item"
                    role="menuitem"
                >
                    Connect a different wallet
                </li>
                <li
                    on:click={disconnectWallet}
                    on:keypress={e => {console.log(e)}}
                    class="wallet-adapter-dropdown-list-item"
                    role="menuitem"
                >
                    Disconnect
                </li>
            </ul>
        {/if}
    </div>
{/if}

{#if modalVisible}
    <WalletModal
        on:close={closeModal}
        on:connect={e => connectWallet(e)}
        {maxNumberOfWallets}
    />
{/if}