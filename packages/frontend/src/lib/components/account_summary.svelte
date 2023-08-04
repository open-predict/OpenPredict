<script lang="ts">
    import { getUserShares, readablePublicKey, usdFormatter } from "$lib/utils";
    import { web3Store } from "$lib/web3Store";
    import CopyButton from "../elements/copy_button.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import IconRefresh from "@tabler/icons-svelte/dist/svelte/icons/IconRefresh.svelte";
    import IconSend from "@tabler/icons-svelte/dist/svelte/icons/IconSend.svelte";
    import IconDown from "@tabler/icons-svelte/dist/svelte/icons/IconChevronDown.svelte";
    import IconCoins from "@tabler/icons-svelte/dist/svelte/icons/IconCoins.svelte";
    import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader.svelte";
    import { web3Workspace } from "$lib/web3Workspace";
    import { trpcc } from "$lib/trpc";
    import { onMount } from "svelte";
    export let shrink = false;

    let loading = false;

    let positions = { active: 0, redeemable: 0 };

    async function getUserPositions(): Promise<{
        active: number;
        redeemable: number;
    }> {
        let ret = { active: 0, redeemable: 0 };
        if (!$web3Store.publicKey) return ret;
        const positions = await trpcc.getMarketAccounts.query({
            userId: $web3Store.publicKey.toBase58(),
        });
        positions.forEach((p) => {
            const us = getUserShares(p.market.data, $web3Store.publicKey);
            if (p.market.data.data.Resolved) {
                ret.redeemable = ret.redeemable + us.valueCents;
            } else {
                ret.active = ret.active + us.valueCents;
            }
        });
        return ret;
    }

    onMount(() => {
        getUserPositions().then((r) => {
            positions = r;
        });
    });
</script>

<div class="flex flex-col gap-6 px-8 pt-8 w-full">
    <!-- <p class="text-gray-800 text-sm">Positions:</p> -->
    <div class="flex justify-between items-center">
        <h4 class="text-lg">Account Summary</h4>
        <button
            on:click={async () => {
                loading = true;
                await $web3Workspace.refreshKeys();
                await $web3Workspace.refreshBalances();
                await getUserPositions().then((r) => {
                    positions = r;
                });
                loading = false;
            }}
            class="action_icon h-6 w-6"
        >
            {#if loading}
                <IconLoader size={18} class="animate-spin" />
            {:else}
                <IconRefresh size={18} />
            {/if}
        </button>
    </div>
    <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
            <p class="text-xs font-semibold">Balances</p>
                <button
                    on:click={() => {
                        modalStore.closeModal(Modal.account_summary)
                        modalStore.openModal(Modal.swap)
                    }}
                    class="btn_secondary h-5 text-xs px-3"
                >
                    Swap
                </button>
        </div>
        <div class="divide-y divide-gray-200 text-sm">
            <div />
            <div class="flex justify-end items-center py-2 gap-2">
                <p class="text-gray-500 mr-auto">USDC</p>
                <p class="">
                    {usdFormatter.format($web3Store?.usdc?.uiAmount ?? 0)}
                </p>
            </div>
            <div class="flex justify-between items-center py-2">
                <p class="text-gray-500">SOL</p>
                <p class="">
                    {$web3Store?.sol ? $web3Store.sol.toFixed(2) : 0}
                </p>
            </div>
        </div>
    </div>
    {#if !shrink}
        <div class="flex flex-col gap-2">
            <p class="text-xs font-semibold text-left">Positions</p>
            <div class="divide-y divide-gray-200 text-sm">
                <div />
                <div class="flex justify-end items-center py-2 gap-2">
                    <p class="text-gray-500 mr-auto">Active</p>
                    <p class="">
                        {usdFormatter.format(positions.active / 100)}
                    </p>
                </div>
                <div class="flex justify-between items-center py-2">
                    <p class="text-gray-500">Redeemable</p>
                    <p class="">
                        {usdFormatter.format(positions.redeemable / 100)}
                    </p>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-2 mb-8">
            <p class="text-xs font-semibold text-left">Addresses</p>
            <div class="divide-y divide-gray-200 text-sm">
                <div />
                {#if $web3Store?.usdcAddress}
                    <div class="flex items-center py-2">
                        <p class="text-gray-500 mr-auto">USDC</p>
                        <CopyButton
                            value={$web3Store?.usdcAddress.toBase58()}
                        />
                        <p class="ml-2">
                            {readablePublicKey($web3Store?.usdcAddress)}
                        </p>
                    </div>
                {/if}
                <div class="flex justify-between items-center py-2">
                    <p class="text-gray-500 mr-auto">SOL</p>
                    <CopyButton
                        value={$web3Store?.publicKey
                            ? $web3Store.publicKey.toBase58()
                            : ""}
                    />
                    <p class=" ml-2">
                        {$web3Store?.publicKey
                            ? readablePublicKey($web3Store.publicKey)
                            : ""}
                    </p>
                </div>
            </div>
        </div>
    {/if}
</div>
<div class="px-5 pb-5 flex flex-col gap-2.5 w-full">
    {#if !shrink}
        <button
            on:click={() => {
                modalStore.openModal(Modal.low_sol);
            }}
            class="btn_secondary"
        >
            <IconCoins size={16} />
            Fund Account
        </button>
        <button
            on:click={() => modalStore.openModal(Modal.send_funds)}
            class="btn_secondary"
        >
            <IconSend size={16} />
            Export Funds
        </button>
        <button
            on:click={() => (shrink = true)}
            class="btn_secondary bg-white hover:bg-gray-100 hidden md:flex ring-0"
        >
            <IconDown size={20} stroke={2.2} class="rotate-180" />
            Hide
        </button>
    {:else}
        <button
            on:click={() => (shrink = false)}
            class="btn_secondary bg-white hover:bg-gray-100 hidden md:flex ring-0"
        >
            <IconDown size={20} stroke={2.2} />
            Show more
        </button>
    {/if}
</div>
