<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader2.svelte";
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconMenu2.svelte";
    import { generateProfileImage, usdFormatter } from "$lib/utils";
    import {
        Dialog,
        DialogOverlay,
        DialogTitle,
        Popover,
        PopoverButton,
        PopoverPanel,
    } from "@rgossiaux/svelte-headlessui";
    import { web3Store } from "$lib/web3Store";
    $: ({ logout } = $web3Workspace);
    let mobileModal = false;
</script>

{#if $web3Store?.publicKey}
    <button
        on:click={() => {
            mobileModal = true;
        }}
        class="flex flex-nowrap items-center rounded-full bg-white ring-1 ring-gray-200 md:p-1.5 hover:shadow-md"
    >
        <div class="relative inline-block">
            <div
                class="flex overflow-hidden rounded-full bg-black text-white w-6 h-6 md:h-8 md:w-8"
            >
                <img
                    src={generateProfileImage($web3Store.publicKey)}
                    alt="profile"
                />
            </div>
            <div
                class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"
            />
        </div>
        <div
            class="flex-col gap-0 text-right pl-2 text-gray-600 text-[10px] leading-3 pr-2 hidden md:flex"
        >
            <IconMenu size={20} />

            <!-- <span>
                {`${
                    usdc.value?.uiAmount
                        ? usdFormatter.format(usdc.value.uiAmount)
                        : 0.0
                    }`}
                </span> -->
            <!-- <span>{`${sol.amount ? sol.amount.toFixed(2) : 0.0} SOL`}</span> -->
        </div>
    </button>
{:else if $web3Store?.publicKey === null}
    <!-- <button
        on:click={() => {
            modalStore.openModal(Modal.login);
        }}
        class="px-3.5 py-2.5 font-semibold w-1/2 transition bg-zinc-900 text-white rounded-full shadow-md hover:bg-zinc-700 hover:shadow-xl"
    >
        Signup
    </button> -->
{:else}
    <button
        disabled
        class="flex flex-nowrap items-center rounded-full bg-white ring-1 ring-zinc-200 p-1.5 hover:shadow-md gap-2 divide-x divide-zinc-300"
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
