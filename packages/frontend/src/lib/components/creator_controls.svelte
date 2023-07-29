<script lang="ts">
    import { PUBLIC_MAIN_PROGRAM_ID } from "$env/static/public";
    import { web3Workspace } from "$lib/web3Workspace";
    import { TxStatus, resolveMarketInstruction } from "$lib/utils";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import {
        Dialog,
        DialogDescription,
        DialogOverlay,
        DialogTitle,
    } from "@rgossiaux/svelte-headlessui";
    import LoadingOverlay from "./loading_overlay.svelte";

    export let updateMarket: (market: marketFulldata) => void;
    export let market: marketFulldata;

    let resolveMarketModal = false;
    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";

    $: creator =
        $web3Store?.publicKey &&
        $web3Store.publicKey.toBase58() ===
            new PublicKey(market.data.data.OperatorKey).toBase58();

    async function resolveMarket(direction: boolean) {
        try {
            const publicKey = $web3Store?.publicKey;

            if (!publicKey) {
                alert("Please login");
                return;
            }

            loadingMessage = "Preparing instructions...";

            const ammAddressBytes = new PublicKey(
                market.data.data.AmmAddress
            ).toBytes();

            const instructions = await resolveMarketInstruction(
                publicKey,
                new PublicKey(PUBLIC_MAIN_PROGRAM_ID),
                ammAddressBytes,
                direction
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
                (s, h) => {
                    loadingMessage = "";
                    completedMessage = "Market resolved!";
                    market.data.data.Resolved = direction;
                    updateMarket(market);
                    setTimeout(() => {
                        completedMessage = "";
                        resolveMarketModal = false;
                    }, 5000);
                },
                (e) => {
                    if (e instanceof Error) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = `Couldn't resolve the market: ${e}`;
                    }
                }
            );
        } catch (e) {
            console.error(e);
            alert("Error resolving your market. Please try again.");
            return;
        }
    }
</script>

{#if creator}
    <div class="bg-white ring-1 rounded-3xl ring-gray-200 flex flex-col">
        <div class="flex flex-col gap-2 divide-gray-200 p-8">
            <h4 class="text-lg">Market Settings</h4>
        </div>
        <div class="px-5 pb-5 flex flex-col gap-2.5">
            {#if market.data.data.Resolved === null}
                <button
                    on:click={() => (resolveMarketModal = true)}
                    class={`btn_secondary`}
                >
                    <!-- <IconPlus size={20} stroke={3} /> -->
                    Resolve market
                </button>
            {/if}
            <button class={`btn_secondary opacity-50`} disabled>
                <!-- <IconPlus size={20} stroke={3} /> -->
                Edit market
            </button>
        </div>
    </div>
{/if}

<Dialog
    open={resolveMarketModal}
    on:close={() => (resolveMarketModal = false)}
    class="fixed inset-0 z-10 overflow-y-auto flex min-h-full items-center justify-center text-center"
>
    <DialogOverlay
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    />
    <div
        class="relative transform overflow-hidden rounded-3xl bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-8 pt-14 flex flex-col items-center gap-4"
    >
        <LoadingOverlay
            {loadingMessage}
            {errorMessage}
            {completedMessage}
            onClose={() => {
                loadingMessage = "";
                errorMessage = "";
                completedMessage = "";
                if(!errorMessage){
                    resolveMarketModal = false;
                }
            }}
        />
        <DialogTitle as="h3" class="text-xl font-semibold">
            Resolve market
        </DialogTitle>
        <div class="mt-2">
            <DialogDescription as="p" class="text-gray-500 text-lg">
                {`Please resolve this market as accurately as you can. This is not reversible.`}
            </DialogDescription>
        </div>
        <div class="flex w-full gap-4 mt-10">
            <button
                on:click={() => resolveMarket(true)}
                disabled={!!loadingMessage}
                class="btn_primary w-full"
            >
                YES
            </button>
            <button
                on:click={() => resolveMarket(false)}
                disabled={!!loadingMessage}
                class="btn_primary w-full"
            >
                NO
            </button>
        </div>
    </div>
</Dialog>
