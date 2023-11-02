<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import Trade from "$lib/modals/trade.svelte";
    import { TxStatus, web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import { usd } from "$lib/utils/format";
    import { getUserShares, redeemSharesInstruction } from "$lib/utils/op";
    // import {
    //     Dialog,
    //     DialogDescription,
    //     DialogOverlay,
    //     DialogTitle,
    // } from "@rgossiaux/svelte-headlessui";
    import {
        PUBLIC_OP_MAIN_PROGRAM_ADDR,
        PUBLIC_SOLANA_USDC_ADDR,
    } from "$env/static/public";
    import { PublicKey } from "@solana/web3.js";
    import LoadingOverlay from "./loading_overlay.svelte";
    import { IconCircleCheck, IconCircleX } from "@tabler/icons-svelte";

    export let market: marketFulldata;
    export let small = false;
    export let invertColor = false;
    export let updateMarket: (market: marketFulldata) => void;

    $: resolved = market.data.data.Resolved;
    $: isResolved = resolved !== null;

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";
    let tradeModal = false;
    let tradeYes = true;
    let redeemSharesModal = false;

    $: userShares = getUserShares(
        market.data,
        $web3Store?.solana?.address
            ? new PublicKey($web3Store.solana?.address)
            : null
    );
    $: canRedeem =
        isResolved && userShares.shares && resolved === userShares.shares > 0;

    async function redeemShares() {
        try {
            const publicKey = $web3Store?.solanaAddress;

            if (!publicKey) {
                errorMessage = "Missing user's public key.";
                return false;
            }

            loadingMessage = "Creating instructions...";

            const ammAddressBytes = new PublicKey(
                market.data.data.AmmAddress
            ).toBytes();

            const instructions = await redeemSharesInstruction(
                new PublicKey(PUBLIC_SOLANA_USDC_ADDR),
                new PublicKey(PUBLIC_OP_MAIN_PROGRAM_ADDR),
                new PublicKey(publicKey),
                ammAddressBytes
            );

            $web3Workspace.handleTransaction(
                [instructions],
                (s) => {
                    switch (s) {
                        case TxStatus.SIGNING:
                            loadingMessage = "Waiting for signature...";
                            break;
                        case TxStatus.SENDING:
                            loadingMessage = "Sending transaction...";
                            break;
                        case TxStatus.CONFIRMING:
                            loadingMessage = "Confirming transaction...";
                            break;
                    }
                },
                async (s, h) => {
                    completedMessage = "Redeemed your shares!";
                    market.data.UserAccounts.set(publicKey, {
                        Shares: 0n,
                        Version: 1,
                    });
                    updateMarket(market);
                    await $web3Workspace.refreshBalances();
                    await $web3Workspace.refreshKeys();
                },
                (e) => {
                    if (e instanceof Error) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = `Error redeemping shares: ${e}`;
                    }
                }
            );
        } catch (e) {
            console.error(e);
            errorMessage = `Couldn't increase the market's subsidy: ${e}. Please try again.`;
            return;
        }
    }

    const reactiveBtn = `btn_secondary w-full ${
        invertColor ? "bg-gray-700 text-white hover:bg-gray-600" : ""
    }`;
</script>

{#if isResolved}
    <div
        class={`${
            resolved
                ? "bg-green-300/25 text-green-700"
                : "bg-red-500/10 text-red-700"
        } px-4 py-2.5 rounded-2xl flex items-center gap-4 w-full`}
    >
        {#if resolved}
            <IconCircleCheck class={"stroke-green-500"} />
        {:else}
            <IconCircleX class={"stroke-red-600"} />
        {/if}
        <p class="text-sm">
            {`Market resolved to ${resolved ? "'yes'" : "'no'"}`}
        </p>
    </div>
{/if}
{#if canRedeem}
    <button
        disabled={!!loadingMessage}
        on:click|stopPropagation|preventDefault={(e) => {
            redeemSharesModal = true;
        }}
        class={reactiveBtn}
    >
        {`Redeem ${usd.format(userShares.valueCents / 100)}`}
    </button>
{/if}
{#if !isResolved}
    {#if userShares.sharesUI >= 0}
        <button
            disabled={isResolved}
            on:click|stopPropagation|preventDefault={(e) => {
                tradeYes = true;
                tradeModal = true;
                e.stopPropagation();
            }}
            class={reactiveBtn}
        >
            Buy
            <span class="text-emerald-500">
                {"'Yes'"}
            </span>
        </button>
        {#if userShares.sharesUI > 0}
            <button
                disabled={isResolved}
                on:click|stopPropagation|preventDefault={(e) => {
                    tradeYes = false;
                    tradeModal = true;
                    e.stopPropagation();
                }}
                class={reactiveBtn}
            >
                Sell
                <span class="text-rose-500">
                    {"'Yes'"}
                </span>
                {#if !small}
                    <span class="font-normal text-xs">
                        {`($${(userShares.valueCents / 100).toFixed(2)})`}
                    </span>
                {/if}
            </button>
        {/if}
    {/if}
    {#if userShares.sharesUI <= 0}
        {#if userShares.sharesUI < 0}
            <button
                disabled={isResolved}
                on:click|stopPropagation|preventDefault={(e) => {
                    tradeYes = true;
                    tradeModal = true;
                    e.stopPropagation();
                }}
                class={reactiveBtn}
            >
                Sell
                <span class="text-emerald-500">
                    {"'No'"}
                </span>
                {#if !small}
                    <span class="font-normal text-xs">
                        {`($${(userShares.valueCents / 100).toFixed(2)})`}
                    </span>
                {/if}
            </button>
        {/if}
        <button
            disabled={isResolved}
            on:click|stopPropagation|preventDefault={(e) => {
                tradeYes = false;
                tradeModal = true;
                e.stopPropagation();
            }}
            class={reactiveBtn}
        >
            Buy
            <span class="text-rose-500">
                {"'No'"}
            </span>
        </button>
    {/if}
{/if}
<!-- 
<Dialog
    open={tradeModal}
    on:close={() => (tradeModal = false)}
    class="fixed inset-0 z-10 overflow-y-auto flex min-h-full items-center justify-center text-center"
>
    <DialogOverlay
        class="fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity"
    />

    <Trade
        {market}
        direction={tradeYes}
        onClose={() => (tradeModal = false)}
        {updateMarket}
    />
</Dialog>

{#if redeemSharesModal}
    <Dialog
        open={redeemSharesModal}
        on:close={() => (redeemSharesModal = false)}
        class="modal_root"
    >
        <DialogOverlay class="modal_overlay" />
        <div class="modal_card">
            <LoadingOverlay
                {loadingMessage}
                {errorMessage}
                {completedMessage}
                onClose={() => {
                    loadingMessage = "";
                    completedMessage = "";
                    if (!errorMessage) {
                        redeemSharesModal = false;
                    }
                    errorMessage = "";
                }}
            />
            <div class="py-4 px-6 pt-14">
                <div class="px-8">
                    <DialogTitle as="h3" class="text-xl font-semibold"
                        >Redeem your shares!</DialogTitle
                    >
                    <div class="mt-2">
                        <DialogDescription as="p" class="text-gray-500 text-lg">
                            {`This market has resolved in your favor. Get your USDC below.`}
                        </DialogDescription>
                    </div>
                </div>
            </div>
            <div class="flex w-full gap-4 mt-4 p-6">
                <button
                    on:click={() => redeemShares()}
                    class="inline-flex w-full justify-center rounded-full bg-black px-3 py-2 font-semibold text-white shadow-sm hover:bg-gray-800 hover:shadow-md"
                >
                    {`Redeem $${Math.abs(
                        Number(userShares.shares / 1000000n)
                    ).toFixed(2)}`}
                </button>
            </div>
        </div>
    </Dialog>
{/if} -->
