<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader2.svelte";
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconMenu2.svelte";
    import { generateProfileImage, readablePublicKey, usdFormatter } from "$lib/utils";
    import {
        Dialog,
        DialogOverlay,
        DialogTitle,
        Popover,
        PopoverButton,
        PopoverPanel,
    } from "@rgossiaux/svelte-headlessui";
    import { web3Store } from "$lib/web3Store";
    import { toastsStore } from "$lib/toasts/toastsStore";
    import { PublicKey } from "@solana/web3.js";
    $: ({ logout } = $web3Workspace);
    let mobileModal = false;
</script>

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
    <!-- <button
        on:click={() => {
            modalStore.openModal(Modal.login);
        }}
        class="btn_secondary px-8"
    >
        FAQs
    </button> -->
    <!-- <button
        on:click={() => {
            modalStore.openModal(Modal.login);
        }}
        class="btn_primary px-8"
    >
        Signup
    </button> -->
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
                        message: readablePublicKey(new PublicKey($web3Store.solanaAddress)),
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
                        message: readablePublicKey(new PublicKey($web3Store.solanaUsdcAddress)),
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
</Dialog>
