<script lang="ts">
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader2.svelte";
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import WalletButton from "$lib/wallets/WalletButton.svelte";
    import type { WalletName } from "@solana/wallet-adapter-base";
    import { PUBLIC_MAGIC_PUBLISHABLE_API_KEY } from "$env/static/public";

    let maxNumberOfWallets = 15;

    $: ({ loginToMagic } = $web3Workspace);

    $: ({ wallet, connect, select } = $walletStore);

    let showMoreOptions = false;
    let loading = false;
    let email = "";

    $: numberOfWalletsShown = showMoreOptions
        ? $walletStore.wallets.length
        : maxNumberOfWallets;

    $: walletsAvailable = $walletStore.wallets.filter(
        (wallet) => wallet.readyState === "Installed"
    ).length;

    function toggleMoreOptions() {
        showMoreOptions = !showMoreOptions;
    }

    async function handleLogin() {
        loading = true;
        if (loginToMagic) {
            const res = await loginToMagic(email);
            if (!res) alert("Unable to start login process. Please try again.");
        }
        loading = false;
    }

    async function connectWallet(event: WalletName<string>) {
        close();
        await select(event);
        await connect();
    }

    function close() {
        modalStore.closeModal(Modal.login);
    }
</script>

<div class="items-center text-center">
    {#if $web3Store?.publicKey === null}
        <h3 class="font-semibold text-gray-800 text-xl">Join OpenPredict</h3>
        <div class="mt-2">
            <p class="text-gray-500">
                {PUBLIC_MAGIC_PUBLISHABLE_API_KEY
                    ? "Connect a solana wallet or login with a Magic email link"
                    : "Connect a solana wallet to login"}
            </p>
            {#if PUBLIC_MAGIC_PUBLISHABLE_API_KEY}
                <div class="my-4 mt-8 flex flex-col gap-4">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        class="block text-sm w-full rounded-full border-0 py-2 px-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:leading-6"
                        placeholder="you@email.com"
                        on:keypress={(e) => {
                            if (e.key === "Enter") handleLogin();
                        }}
                        bind:value={email}
                    />
                    <button
                        on:click={handleLogin}
                        disabled={loading}
                        class={`btn_primary`}
                    >
                        {#if loading}
                            <IconLoader class="animate-spin text-white" />
                        {:else}
                            Login
                        {/if}
                    </button>
                </div>
                <div class="relative my-8 mx-10">
                    <div
                        class="absolute inset-0 flex items-center"
                        aria-hidden={true}
                    >
                        <div class="w-full border-t border-gray-300" />
                    </div>
                    <div class="relative flex justify-center">
                        <span class="bg-white px-2 text-sm text-gray-500"
                            >or connect a wallet</span
                        >
                    </div>
                </div>
            {:else}
                <div class="relative my-8 mx-10" />
            {/if}
            <div class="flex flex-wrap justify-center items-center gap-2">
                {#each $walletStore.wallets.slice(0, numberOfWalletsShown) as { adapter: { name, icon, url }, readyState }}
                    <WalletButton
                        on:click={() => connectWallet(name)}
                        status={readyState === "Installed" ? "Detected" : ""}
                    >
                        {name}
                        <svelte:fragment slot="start-icon">
                            <img src={icon} alt={`${name} icon`} />
                        </svelte:fragment>
                    </WalletButton>
                {/each}
            </div>

            {#if $walletStore.wallets.length > maxNumberOfWallets}
                <button
                    class="wallet-adapter-modal-list-more"
                    style="justify-content: space-between;"
                    class:wallet-adapter-modal-collapse-button-active={showMoreOptions}
                    on:click={() => toggleMoreOptions()}
                >
                    <span>
                        {showMoreOptions ? "Less" : "More"} options
                    </span>

                    <svg
                        width="13"
                        height="7"
                        viewBox="0 0 13 7"
                        xmlns="http://www.w3.org/2000/svg"
                        class:wallet-adapter-modal-list-more-icon-rotate={showMoreOptions}
                        ><path
                            d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z"
                        /></svg
                    >
                </button>
            {/if}
        </div>
    {:else if $web3Store?.publicKey === undefined}
        <IconLoader class="animate-spin text-gray-400" />
        <p class="text-gray-500 text-center">
            {"Loading..."}
        </p>
    {:else}
        <h3 class="font-semibold text-gray-900 text-xl">Already connected!</h3>
        <p class="text-xl text-gray-500 mt-3">
            {#if $web3Store.magicWallet}
                <div>
                    {`You're currently logged in with email.`}
                </div>
            {:else}
                <div>
                    {`You're currently connected with ${wallet?.name}`}
                </div>
            {/if}
        </p>
    {/if}
</div>
