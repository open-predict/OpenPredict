<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import {
        IconBrightness,
        IconMoon,
        IconMenu2,
        IconLoader,
        IconUser,
    } from "@tabler/icons-svelte";
    import { web3Store } from "$lib/web3Store";
    import { toastsStore } from "$lib/toasts/toastsStore";
    import { PublicKey } from "@solana/web3.js";
    import MenuButton from "./menu_button.svelte";
    import { uiStore } from "$lib/uiStore";
    import Pill from "$lib/elements/pill.svelte";
    import { faker } from "@faker-js/faker";
    import WalletWidget from "./wallet_widget.svelte";
    import utils from "$lib/utils";
    $: ({ logout } = $web3Workspace);
    let mobileModal = false;
</script>

<MenuButton strategy="absolute">
    <button
        slot="target"
        on:click={() => {
            mobileModal = true;
        }}
        class="flex p-1.5 flex-nowrap items-center rounded-2xl ring-1 bg-white ring-gray-200 hover:bg-gray-200 hover:ring-gray-300 dark:bg-neutral-950 dark:ring-neutral-900 dark:text-neutral-300"
    >
        <div class="relative inline-block">
            <div class="w-7 h-7 rounded-xl overflow-hidden">
                {#if $web3Store?.solanaAddress}
                    <img
                        src={utils.mics.generateProfileImage(
                            $web3Store?.solanaAddress
                        )}
                        alt="profile"
                    />
                {:else}
                    <div
                        class="bg-indigo-500 text-white w-full h-full flex justify-center items-center"
                    >
                        <IconUser size={16} />
                    </div>
                {/if}
            </div>
            {#if $web3Store?.solanaAddress}
                <div
                    class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-white dark:ring-neutral-900"
                />
            {/if}
        </div>
        <div
            class="w-7 h-7 flex-col justify-center items-center gap-0 text-right pl-2 text-[10px] leading-3 pr-1.5 hidden md:flex"
        >
            <IconMenu2 size={16} />
        </div>
    </button>
    <div class="flex flex-col p-1.5 gap-3">
        <div
            class="flex justify-start items-start gap-3 hover:bg-neutral-800 rounded-xl p-1.5"
        >
            <div class="w-10 h-10 rounded-2xl overflow-hidden">
                <img
                    src={utils.mics.generateProfileImage(
                        "$web3Store.solanaAddress"
                    )}
                    alt="profile"
                />
            </div>
            <div>
                <p class="text-sm">
                    {faker.name.fullName()}
                </p>
                <span class="text-xs text-neutral-400">
                    {faker.internet.userName()}
                </span>
            </div>
        </div>
        <div
            class="w-full flex flex-nowrap items-center justify-items-stretch h-10"
        >
            <WalletWidget />
        </div>
        <button
            on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
            class="btn_primary w-52 m-1.5"
        >
            {`Fund account`}
        </button>
    </div>
    <div
        class="flex justify-between items-center border-y border-neutral-800 px-3 py-1 my-1.5 text-neutral-300 text-xs bg-neutral-800/50"
    >
        <p>Account</p>
    </div>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Notifications`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Positions`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Limit orders`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Questions`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Drafts`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Wallet`}
    </button>
    <div
        class="flex justify-between items-center border-y border-neutral-800 px-3 py-1 my-1.5 text-neutral-300 text-xs bg-neutral-800/50"
    >
        <p>Site</p>
    </div>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Leaderboard`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Learn`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Support / Discord`}
    </button>
    <div
        class="flex justify-between items-center border-y border-neutral-800 px-3 py-1 my-1.5 text-neutral-300 text-xs bg-neutral-800/50"
    >
        <p>Theme</p>
        <div class="text-neutral-700 dark:text-neutral-400">
            {#if $uiStore.theme === "light"}
                <IconBrightness size={12} />
            {:else if $uiStore.theme === "dark"}
                <IconMoon size={12} />
            {/if}
        </div>
    </div>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.toggleTheme()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Turn dark mode ${
            $uiStore.theme
                ? $uiStore.theme === "dark"
                    ? "off"
                    : "on"
                : uiStore.browserDefaultDark()
                ? "off"
                : "on"
        }`}
    </button>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Use browser defaults`}
    </button>
    <div
        class="flex justify-between items-center border-y border-neutral-800 px-3 py-1 my-1.5 text-neutral-300 text-xs bg-neutral-800/50"
    >
        <p>Auth</p>
    </div>
    <button
        on:click|stopPropagation|preventDefault={() => uiStore.setAuto()}
        class="flex items-center gap-1.5 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
    >
        {`Logout`}
    </button>
</MenuButton>
<!-- 
{#if $web3Store?.solanaAddress}
    <button
        on:click={() => {
            mobileModal = true;
        }}
        class="flex h-8 p-0.5 lg:h-11 lg:max-h-11 lg:p-1.5 flex-nowrap items-center rounded-full bg-gray-50 ring-1 ring-gray-200 hover:bg-gray-200 hover:ring-gray-300"
    >
        <div
            class="relative inline-block ring-1 ring-gray-300 rounded-full p-0.5"
        >
            <div
                class="flex overflow-hidden rounded-full w-6 h-6 lg:w-7 lg:h-7"
            >
                <img
                    src={generateProfileImage($web3Store.solanaAddress)}
                    alt="profile"
                />
            </div>
            <div
                class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white"
            />
        </div>
        <div
            class="flex-col gap-0 text-right pl-2 text-gray-600 text-[10px] leading-3 pr-1.5 hidden md:flex"
        >
            <IconMenu size={16} />
        </div>
    </button>
{:else if $web3Store?.solanaAddress === null}
    <button
        on:click={() => {
            modalStore.openModal(Modal.login);
        }}
        class="btn_secondary px-8"
    >
        FAQs
    </button>
    <button
        on:click={() => {
            modalStore.openModal(Modal.login);
        }}
        class="btn_primary px-8"
    >
        Signup
    </button>
{:else}
    <button
        disabled
        class="flex flex-nowrap items-center rounded-full bg-white ring-1 ring-gray-200 p-1.5 hover:shadow-md gap-2 divide-x divide-gray-300"
    >
        <IconLoader class="animate-spin" />
    </button>
{/if}

<Dialog
    open={mobileModal}
    on:close={() => (mobileModal = false)}
    class="modal_root"
>
    <DialogOverlay class="modal_overlay" />
    <div class="modal_card">
        <div class="p-14 pb-4">
            <DialogTitle
                as="h3"
                class="text-xl font-semibold leading-6 text-gray-900"
            >
                User options
            </DialogTitle>
        </div>
        <div class="flex flex-col gap-2.5 p-6">
            <button
                on:click={async () => {
                    if (!$web3Store.solanaAddress) {
                        modalStore.openModal(Modal.login);
                        return;
                    }
                    window.navigator.clipboard.writeText(
                        $web3Store.solanaAddress
                    );
                    toastsStore.create({
                        title: "Copied!",
                        message: readableAddress($web3Store.solanaAddress),
                        variant: "success"
                    })
                }}
                class="btn_secondary"
            >
                Copy public key
            </button>
            <button
                on:click={async () => {
                    if (!$web3Store.solanaUsdcAddress) {
                        modalStore.openModal(Modal.login);
                        return;
                    }
                    window.navigator.clipboard.writeText(
                        $web3Store.solanaUsdcAddress
                    );
                    toastsStore.create({
                        title: "Copied!",
                        message: readableAddress($web3Store.solanaUsdcAddress),
                        variant: "success"
                    })
                }}
                class="btn_secondary"
            >
                Copy USDC address
            </button>

            <button
                on:click={async () => {
                    await logout();
                    mobileModal = false;
                }}
                class="btn_primary"
            >
                Logout
            </button>
        </div>
    </div>
</Dialog> -->
