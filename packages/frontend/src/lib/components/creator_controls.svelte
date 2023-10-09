<script lang="ts">
    import {
        PUBLIC_MAIN_PROGRAM_ID,
        PUBLIC_USDC_MINT_ADDR,
    } from "$env/static/public";
    import { web3Workspace } from "$lib/web3Workspace";
    import {
        USDC_PER_DOLLAR,
        resolveMarketInstruction,
        subsidizeMarketInstruction,
    } from "$lib/web3_utils";
    import { TxStatus, usdFormatter } from "$lib/utils";
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
    let editMarketModal = false;
    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";
    let microUsdc: number = 0;

    $: creator =
        $web3Store?.solanaAddress &&
        $web3Store.solanaAddress === market.data.data.OperatorKey.toBase58();

    async function increaseSubsidy() {
        try {
            const publicKey = $web3Store?.solanaAddress;

            if (!publicKey) {
                alert("Please login");
                return;
            }

            loadingMessage = "Preparing instructions...";

            const ammAddressBytes = new PublicKey(
                market.data.data.AmmAddress
            ).toBytes();

            const instructions = await subsidizeMarketInstruction(
                new PublicKey(PUBLIC_USDC_MINT_ADDR),
                new PublicKey(PUBLIC_MAIN_PROGRAM_ID),
                new PublicKey($web3Store.solanaAddress!),
                ammAddressBytes,
                microUsdc
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
                    completedMessage = "Market subsidy increased!";
                    market.data.data.Subsidy += BigInt(microUsdc);
                    updateMarket(market);
                    setTimeout(() => {
                        completedMessage = "";
                        editMarketModal = false;
                    }, 5000);
                },
                (e) => {
                    if (e instanceof Error) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = `Couldn't increase the subsidy: ${e}`;
                    }
                }
            );
        } catch (e) {
            console.error(e);
            errorMessage = `Couldn't increase the market's subsidy: ${e}. Please try again.`;
            return;
        }
    }

    async function resolveMarket(direction: boolean) {
        try {
            const publicKey = $web3Store?.solanaAddress;

            if (!publicKey) {
                alert("Please login");
                return;
            }

            loadingMessage = "Preparing instructions...";

            const ammAddressBytes = new PublicKey(
                market.data.data.AmmAddress
            ).toBytes();

            const instructions = await resolveMarketInstruction(
                new PublicKey(publicKey),
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
            errorMessage = `Error resolving your market: ${e}. Please try again.`;
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
                    on:click={() => (editMarketModal = true)}
                    class={`btn_secondary`}
                >
                    <!-- <IconPlus size={20} stroke={3} /> -->
                    Increase subsidy
                </button>
                <button
                    on:click={() => (resolveMarketModal = true)}
                    class={`btn_secondary`}
                >
                    <!-- <IconPlus size={20} stroke={3} /> -->
                    Resolve market
                </button>
            {/if}
        </div>
    </div>
{/if}

<Dialog
    open={resolveMarketModal}
    on:close={() => (resolveMarketModal = false)}
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
                errorMessage = "";
                completedMessage = "";
                if (!errorMessage) {
                    resolveMarketModal = false;
                }
            }}
        />
        <div class="py-4 px-6 pt-14">
            <div class="px-8">
                <DialogTitle as="h3" class="text-xl font-semibold">
                    Resolve market
                </DialogTitle>
                <div class="mt-2">
                    <DialogDescription as="p" class="text-gray-500 text-lg">
                        {`Please resolve this market as accurately as you can. This is not reversible.`}
                    </DialogDescription>
                </div>
            </div>
        </div>
        <div class="flex w-full gap-4 mt-4 p-6">
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
    </div></Dialog
>

<Dialog
    open={editMarketModal}
    on:close={() => (editMarketModal = false)}
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
                errorMessage = "";
                completedMessage = "";
                if (!errorMessage) {
                    resolveMarketModal = false;
                }
            }}
        />
        <div class="py-4 px-6 pt-14">
            <div class="px-8">
                <DialogTitle as="h3" class="text-xl font-semibold">
                    Increase Subsidy
                </DialogTitle>
                <div class="mt-2">
                    <DialogDescription as="p" class="text-gray-500 text-lg">
                        {`Enter the amount of USDC \nyou'd like to add to your subsidy.`}
                    </DialogDescription>
                </div>

                <input
                    type="string"
                    value={usdFormatter.format(microUsdc / USDC_PER_DOLLAR)}
                    on:change={(e) => {
                        const allowed = e.currentTarget.value.replace(
                            /[^0-9.]+/g,
                            ""
                        );
                        const num = parseFloat(allowed);
                        if (isNaN(num)) {
                            microUsdc = 0;
                        } else {
                            microUsdc = num * USDC_PER_DOLLAR;
                            e.currentTarget.value = usdFormatter.format(
                                microUsdc / USDC_PER_DOLLAR
                            ); // sometimes wasn't updating
                        }
                    }}
                    class="text-4xl my-10 max-w-[16rem] text-center text-black outline-none"
                />
            </div>
        </div>
        <div class="flex w-full gap-4 mt-10 p-6">
            <button
                on:click={() => increaseSubsidy()}
                disabled={!!loadingMessage}
                class="btn_primary w-full"
            >
                Increase subsidy
            </button>
        </div>
    </div>
</Dialog>
