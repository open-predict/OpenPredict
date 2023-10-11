<script lang="ts">
    import {
        PUBLIC_MAIN_PROGRAM_ID,
        PUBLIC_USDC_MINT_ADDR,
    } from "$env/static/public";
    import { web3Workspace } from "$lib/web3Workspace";
    import type {
        marketChaindata,
        marketFulldata,
    } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
    import IconMinus from "@tabler/icons-svelte/dist/svelte/icons/IconMinus.svelte";
    import IconSwitch from "@tabler/icons-svelte/dist/svelte/icons/IconSwitchVertical.svelte";
    import { onMount, tick } from "svelte";
    import { USDC_PER_DOLLAR } from "$lib/web3_utils";
    import { browser } from "$app/environment";
    import {
        getBuyShareAmount,
        getChance,
        getSellUsdcLimit,
        getUserShares,
        buySharesInstruction,
    } from "$lib/web3_utils";
    import { usdFormatter, Errors, TxStatus } from "$lib/utils";
    import confetti from "canvas-confetti";
    import { web3Store } from "$lib/web3Store";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import type {
        pmMarketFulldata,
        pmTokenData,
        pmTokenOrderdata,
    } from "$lib/types";
    import colors from "tailwindcss/colors";

    export let market: pmMarketFulldata;
    export let direction: boolean;
    export let onClose: () => void;
    export let updateMarket: (market: pmMarketFulldata) => void;

    let selectedToken: { token: pmTokenOrderdata; id: string } | undefined;

    async function selectToken(token: string) {
        selectedToken = {
            id: token,
            token: market.tokenOrderdata.get(token) as pmTokenOrderdata,
        };
    }

    $: tokens = market.data.tokens.reduce(
        (acc: Record<string, pmTokenData>, val) => {
            acc[val.token_id] = val;
            return acc;
        },
        {}
    );

    onMount(async () => {
        if (market.data.tokens[0]) {
            selectToken(market.data.tokens[0].token_id);
        }
    });

    const step = 0.1 * USDC_PER_DOLLAR;
    const chance = 0.5;

    $: ({ solanaAddress } = $web3Workspace);
    let userShares = {
        shares: 0n,
        sharesUI: 0,
        valueCents: 0,
    };
    $: buying =
        userShares.sharesUI === 0 ||
        (userShares.shares > 0 && direction) ||
        (userShares.shares < 0 && !direction);
    $: summary = buying
        ? `Buy ${direction ? "'Yes'" : "'No'"} Shares`
        : `Sell ${userShares.shares < 0 ? "'No'" : "'Yes'"} Shares`;

    let defaultMicroUsd = 100;
    let microUsd = 0;
    let expectedShares: bigint = 0n;
    let expectedChance = 0;
    let expectedYes: bigint = 0n;
    let expectedNo: bigint = 0n;
    let maxSell = 0;

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";

    let slider: HTMLInputElement;

    // capped in beta
    // $: maxBuy = microUsd + maxGap;
    $: maxBuy = 10 * USDC_PER_DOLLAR;
    $: slider
        ? slider.style.setProperty(
              "--background-size",
              `${((microUsd - 0) / ((buying ? maxBuy : maxSell) - 0)) * 100}%`
          )
        : undefined;
    // $: browser
    //     ? recalc(
    //           market.data.data,
    //           userShares.shares,
    //           userShares.sharesUI,
    //           microUsd,
    //           direction
    //       )
    //     : undefined;

    onMount(async () => {
        slider = document.getElementById("cents_slider") as HTMLInputElement;
    });

    function recalc(
        data: marketChaindata,
        userShares: bigint,
        userSharesNumber: number,
        microUsdc: number,
        direction: boolean
    ) {
        const expected = getBuyShareAmount(
            data,
            Math.round(microUsdc),
            direction
        );
        expectedShares = BigInt(expected.shares.toString());
        expectedChance = expected.newRatio;
        expectedYes = BigInt(expected.newYes.toString());
        expectedNo = BigInt(expected.newNo.toString());
        if (userSharesNumber !== 0)
            maxSell = Number(getSellUsdcLimit(data, userShares));
    }
</script>

<div
    class={`grid grid-cols-3 gap-4 ${
        Object.keys(market.data.tokens).length > 2
            ? "grid-cols-1"
            : "grid-cols-2"
    }`}
>
    <h4 class="text-md text-neutral-200 col-span-1">
        {`Outcome`}
    </h4>
    <div class="flex gap-3 col-span-2">
        {#each Array.from(Object.entries(market.data.tokens)) as token}
            <button
                on:click={() => selectToken(token[0])}
                class={`h-10 text-sm w-full rounded-xl font-semibold ring-2 ${
                    token[1].outcome === "Yes"
                        ? `ring-emerald-600 ${
                              selectedToken?.id === token[0]
                                  ? "bg-emerald-600 text-white"
                                  : "text-emerald-600"
                          }`
                        : `ring-red-600 ${
                              selectedToken?.id === token[0]
                                  ? "bg-red-600 text-white"
                                  : "text-red-600"
                          }`
                }`}
            >
                {token[1].outcome}
            </button>
        {/each}
    </div>
    <h4 class="text-md text-neutral-200 col-span-1">
        {`Amount`}
    </h4>
    <div
        class="col-span-2 block overflow-hidden text-sm w-full rounded-xl ring-1 ring-neutral-900/80 bg-white dark:bg-neutral-950"
    >
        <div
            class="w-full h-12 flex justify-between items-center p-2 gap-2 bg-neutral-900/50 rounded-xl ring-1 ring-neutral-900 ring-inset"
        >
            <button
                on:click={() =>
                    (microUsd = Math.max(
                        Math.round(microUsd / step) * step - step,
                        0
                    ))}
                class="action_icon"
            >
                <IconMinus size={16} />
            </button>
            <input
                type="string"
                value={usdFormatter.format(
                    (buying
                        ? microUsd
                        : Number(expectedShares) *
                          (userShares.shares > 0 ? chance : 1 - chance)) /
                        USDC_PER_DOLLAR
                )}
                on:change={(e) => {
                    const allowed = e.currentTarget.value.replace(
                        /[^0-9.]+/g,
                        ""
                    );
                    const num = parseFloat(allowed);
                    if (isNaN(num)) {
                        microUsd = defaultMicroUsd;
                    } else {
                        microUsd = num * USDC_PER_DOLLAR;
                        e.currentTarget.value = usdFormatter.format(
                            microUsd / USDC_PER_DOLLAR
                        ); // sometimes wasn't updating
                    }
                }}
                class="text-lg max-w-[10rem] text-center text-neutral-300 outline-none bg-transparent"
            />
            <button
                class="action_icon"
                on:click={() =>
                    (microUsd = buying
                        ? Math.round(microUsd / step) * step + step
                        : Math.min(microUsd + step, maxSell))}
            >
                <IconPlus size={20} />
            </button>
        </div>
        <div
            class="h-9 flex justify-center items-stretch rounded-full p-2 w-full gap-4"
        >
            <div class="flex justify-center items-center w-full px-1 py-1">
                <input
                    class={direction ? "yes" : "no"}
                    type="range"
                    id="cents_slider"
                    bind:value={microUsd}
                    max={buying ? maxBuy : maxSell}
                    min={0}
                />
            </div>
            {#if !buying}
                <button
                    on:click={() => (microUsd = maxSell)}
                    class={`rounded-lg font-semibold whitespace-nowrap bg-white text-black ring-1 ring-gray-300 text-xs px-2.5 hover:shadow-md`}
                >
                    Sell Max
                </button>
            {/if}
        </div>
    </div>
</div>

<div class={`whitespace-pre-wrap text-gray-500 text-xs pt-6 pb-6`}>
    {#if buying}
        <p>{`Predictions are limited to \n$10 per trade while in beta`}</p>
    {/if}
</div>
<div>
    <div class="mt-8 mb-2 divide-y divide-y-gray-200">
        <div />
        {#if !buying}
            <div class="p-4 text-sm flex justify-between items-center">
                <span class="text-gray-500">
                    {`Your ${userShares.shares > 0 ? "'Yes'" : "'No'"} shares`}
                </span>
                <span class="text-black">
                    {Math.abs(userShares.sharesUI)}
                </span>
            </div>
        {/if}
        <div class="p-4 text-sm flex justify-between items-center">
            {#if buying}
                <span class="text-gray-500">New Shares</span>
                <span class="text-black">
                    {(Number(expectedShares) / USDC_PER_DOLLAR).toFixed(2)}
                </span>
            {:else}
                <span class="text-gray-500">
                    {`${
                        userShares.shares > 0 ? "'Yes'" : "'No'"
                    } shares to sell`}
                </span>
                <span class="text-black">
                    {(Number(expectedShares) / USDC_PER_DOLLAR).toFixed(2)}
                </span>
            {/if}
        </div>
        <div class="p-4 text-sm flex justify-between items-center">
            <span class="text-gray-500">New event probability</span>
            <span class="text-black"
                >{`${(expectedChance * 100).toFixed(1)}%`}</span
            >
        </div>
        {#if buying}
            <div class="p-4 text-sm flex justify-between items-center">
                <span class="text-gray-500 font-semibold"
                    >{`Payout if ${direction ? "Yes" : "No"}`}</span
                >
                <span
                    class={`font-semibold  ${
                        direction ? "text-green-500" : "text-rose-600"
                    }`}
                    >{`+ ${usdFormatter.format(
                        Number(
                            (BigInt(expectedShares) - BigInt(microUsd)) / 10000n
                        ) / 100
                    )}`}</span
                >
            </div>
        {/if}
    </div>
</div>

<style>
    /* TO DO: Fix & clean up  */
    [type="range"] {
        flex: 1;
        width: 100%;
        margin: 0;
        padding: 0;
        min-height: 1.5em;
        background: transparent;
        font: inherit;
        /* background: theme('colors.green.900'); */
    }
    [type="range"]::-webkit-slider-thumb {
        margin-top: -0.625em;
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
    }
    [type="range"],
    [type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }
    [type="range"]::-webkit-slider-runnable-track {
        box-sizing: border-box;
        border: none;
        height: 0.25em;
        border-radius: 10px;
        background: theme("colors.green.900");
    }
    [type="range"]::-moz-range-track {
        box-sizing: border-box;
        border: none;
        height: 0.25em;
        background: theme("colors.green.900");
    }
    [type="range"]::-ms-track {
        box-sizing: border-box;
        border: none;
        height: 0.25em;
        background: theme("colors.green.900");
    }
    [type="range"]::-moz-range-progress {
        height: 0.25em;
    }
    [type="range"]::-ms-fill-lower {
        height: 0.25em;
    }
    [type="range"]::-webkit-slider-thumb {
        margin-top: -0.625em;
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    [type="range"]::-moz-range-thumb {
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
    }
    [type="range"]::-ms-thumb {
        margin-top: 0;
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
    }
    [type="range"]::-ms-tooltip {
        display: none;
    }

    [type="range"].no::-webkit-slider-thumb {
        background: #f87171;
    }
    [type="range"].no::-webkit-slider-runnable-track {
        background: linear-gradient(to right, #ef4444, #ef4444),
            theme("colors.neutral.700");
        background-size: var(--background-size, 0%) 100%;
        background-repeat: no-repeat;
    }
    [type="range"].no::-moz-range-progress {
        background: #ef4444;
    }
    [type="range"].no::-ms-fill-lower {
        background: #ef4444;
    }
    [type="range"].no::-webkit-slider-thumb {
        background: #f87171;
    }
    [type="range"].no::-moz-range-thumb {
        background: #f87171;
    }
    [type="range"].no::-ms-thumb {
        background: #f87171;
    }

    [type="range"].yes::-webkit-slider-thumb {
        background: #86efac;
    }
    [type="range"].yes::-webkit-slider-runnable-track {
        background: linear-gradient(
                to right,
                theme("colors.green.800"),
                theme("colors.green.400")
            ),
            theme("colors.neutral.700");
        background-size: var(--background-size, 0%) 100%;
        background-repeat: no-repeat;
    }
    [type="range"].yes::-moz-range-progress {
        background: theme("colors.green.600");
    }
    [type="range"].yes::-ms-fill-lower {
        background: theme("colors.green.600");
    }
    [type="range"].yes::-webkit-slider-thumb {
        background: theme("colors.green.400");
    }
    [type="range"].yes::-moz-range-thumb {
        background: theme("colors.green.400");
    }
    [type="range"].yes::-ms-thumb {
        background: theme("colors.green.400");
    }
</style>
