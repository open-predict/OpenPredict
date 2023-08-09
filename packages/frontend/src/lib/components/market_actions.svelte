<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import Trade from "$lib/modals/trade.svelte";
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import {
    TxStatus,
        getUserShares,
        redeemSharesInstruction,
        usdFormatter,
    } from "$lib/utils";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import {
        Dialog,
        DialogDescription,
        DialogOverlay,
        DialogTitle,
    } from "@rgossiaux/svelte-headlessui";
    import {
        PUBLIC_MAIN_PROGRAM_ID,
        PUBLIC_USDC_MINT_ADDR,
    } from "$env/static/public";
    import { PublicKey } from "@solana/web3.js";
    import IconX from "@tabler/icons-svelte/dist/svelte/icons/IconCircleX.svelte";
    import IconCheck from "@tabler/icons-svelte/dist/svelte/icons/IconCircleCheck.svelte";

    export let market: marketFulldata;
    export let small = false;
    export let invertColor = false;
    export let updateMarket: (market: marketFulldata) => void;

    $: resolved = market.data.data.Resolved;
    $: isResolved = resolved !== null;

    let loadingMessage = "";

    let tradeModal = false;
    let tradeYes = true;

    $: userShares = getUserShares(market.data, $web3Store?.publicKey);
    $: console.log("userShares changed", userShares);
    $: canRedeem =
        isResolved && userShares.shares && resolved === userShares.shares > 0;

    async function redeemShares() {
        try {
            const publicKey = $web3Store?.publicKey;
            if (!publicKey) {
                alert("Please login");
                return false;
            }

            const ammAddressBytes = new PublicKey(
                market.data.data.AmmAddress
            ).toBytes();

            if (ammAddressBytes.length !== 32) {
                throw Error("Incorrect ammAddress length");
            }

            const instructions = await redeemSharesInstruction(
                new PublicKey(PUBLIC_USDC_MINT_ADDR),
                new PublicKey(PUBLIC_MAIN_PROGRAM_ID),
                publicKey,
                ammAddressBytes
            );

            $web3Workspace.handleTransaction(
                [instructions],
                (s) => {
                    switch (s) {
                        case TxStatus.SIGNING:
                            loadingMessage = "signing";
                            break;
                        case TxStatus.SENDING:
                            loadingMessage = "sending";
                            break;
                        case TxStatus.CONFIRMING:
                            loadingMessage = "confirming";
                            break;
                    }
                },
                (s, h) => {
                    $web3Workspace.refreshBalances()
                    $web3Workspace.refreshKeys()
                },
                (e) => alert(e)
            );

        } catch (e) {
            console.error(e);
            alert("Error redeeming your shares. Please try again.");
            return false;
        }
    }

    const reactiveBtn = `btn_secondary w-full ${
        invertColor ? "bg-gray-700 text-white hover:bg-gray-600" : ""
    }`;
</script>

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

{#if isResolved}
    {#if canRedeem}
        <button
            disabled={!!loadingMessage}
            on:click|stopPropagation|preventDefault={(e) => {
                redeemShares();
            }}
            class={reactiveBtn}
        >
            {`Redeem ${usdFormatter.format(userShares.valueCents / 100)}`}
        </button>
    {:else}
        <div
            class={`${
                resolved
                    ? "bg-green-300/25 text-green-700"
                    : "bg-red-500/10 text-red-300"
            } px-4 py-2.5 rounded-2xl flex items-center gap-4 w-full`}
        >
            {#if resolved}
                <IconCheck class={"stroke-green-500"} />
            {:else}
                <IconX class={"stroke-red-600"} />
            {/if}
            <p class="text-sm">
                {`Market resolved to ${resolved ? "'yes'" : "'no'"}`}
            </p>
        </div>
    {/if}
{:else}
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
                        {`($${(userShares.valueCents / 100).toFixed(
                            2
                        )})`}
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
                        {`($${(userShares.valueCents / 100).toFixed(
                            2
                        )})`}
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

{#if isResolved && canRedeem}
    <Dialog
        open={$modalStore.redeem_shares}
        on:close={() => modalStore.closeModal(Modal.redeem_shares)}
        class="fixed inset-0 z-10 overflow-y-auto flex min-h-full items-center justify-center text-center"
    >
        <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
        <div
            class="relative transform overflow-hidden rounded-3xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-8 pt-14 flex flex-col items-center gap-4"
        >
            <DialogTitle as="h3" class="text-xl font-semibold"
                >Redeem your shares!</DialogTitle
            >
            <div class="mt-2">
                <DialogDescription as="p" class="text-gray-500 text-lg">
                    {`This market has resolved in your favor. Get your USDC below.`}
                </DialogDescription>
            </div>
            <div class="flex w-full gap-4 mt-10">
                <button
                    on:click={redeemShares}
                    class="inline-flex w-full justify-center rounded-full bg-black px-3 py-2 font-semibold text-white shadow-sm hover:bg-gray-800 hover:shadow-md"
                >
                    {`Redeem $${Math.abs(
                        Number(userShares.shares / 1000000n)
                    ).toFixed(2)}`}
                </button>
            </div>
        </div>
    </Dialog>
{/if}
