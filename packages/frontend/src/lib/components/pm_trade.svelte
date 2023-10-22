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
    import { IconMinus, IconPlus, IconRefresh } from "@tabler/icons-svelte";
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
    import { usdFormatter, Errors, TxStatus, delay } from "$lib/utils";
    import confetti from "canvas-confetti";
    import { web3Store } from "$lib/web3Store";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import type {
        pmMarketFulldata,
        pmTokenData,
        pmTokenOrderdata,
    } from "@am/backend/types/market";
    import { fade, scale, slide } from "svelte/transition";
    import "$lib/styles/range.css";
    import Toggle from "$lib/elements/toggle.svelte";
    import {
        IconChevronDown,
        IconEaseInOutControlPoints,
        IconExternalLink,
        IconLivePhoto,
    } from "@tabler/icons-svelte";
    import PmPosition from "./pm_position.svelte";
    import Slider from "$lib/elements/slider.svelte";

    export let market: pmMarketFulldata;
    export let direction: boolean;
    export let onClose: () => void;
    export let updateMarket: (market: pmMarketFulldata) => void;

    let selectedToken: pmTokenData | undefined;

    async function selectToken(token_id: string) {
        var content = document.getElementById("content");
        if (selectedToken && selectedToken.token_id === token_id) {
            selectedToken = undefined;
            if (content) {
                content.style.minHeight = content.scrollHeight + "px";
                await delay(50);
                content.style.minHeight = "";
                content.style.maxHeight = "";
            }
        } else {
            selectedToken = market.data.tokens.find(
                (t) => t.token_id === token_id
            );
            if (selectedToken && content) {
                await tick();
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
    }

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

    let limitPrice = 50;
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

    let orderType: "limit" | "market" = "limit";

    // capped in beta
    // $: maxBuy = microUsd + maxGap;
    $: maxBuy = 10 * USDC_PER_DOLLAR;

    // $: browser
    //     ? recalc(
    //           market.data.data,
    //           userShares.shares,
    //           userShares.sharesUI,
    //           microUsd,
    //           direction
    //       )
    //     : undefined;

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

    const tokenBtnClass = (
        token: pmTokenData,
        selected: typeof selectedToken
    ) => {
        let btn_class = "h-10 w-full rounded-xl font-semibold mt-auto";
        switch (token.outcome.toLowerCase()) {
            case "yes":
                btn_class = selected
                    ? selected?.token_id === token.token_id
                        ? `bg-emerald-600 text-white`
                        : `bg-neutral-900 text-white opacity-70`
                    : `bg-neutral-900 text-green-400`;
                break;
            case "no":
                btn_class = selected
                    ? selected?.token_id === token.token_id
                        ? `bg-red-500 text-white`
                        : `bg-neutral-900 text-white opacity-70`
                    : `bg-neutral-900 text-red-400`;
                break;
            default:
                btn_class = selected
                    ? selected?.token_id === token.token_id
                        ? `bg-indigo-600 text-white`
                        : "bg-neutral-900 text-white opacity-70"
                    : "bg-neutral-900 text-indigo-400";
                break;
        }
        return btn_class;
    };

    $: tradeButtonClass = selectedToken
        ? selectedToken.outcome.toLowerCase() === "yes"
            ? `bg-emerald-600 text-white`
            : selectedToken.outcome.toLowerCase() === "no"
            ? `bg-red-500 text-white`
            : `bg-indigo-600 text-white`
        : `bg-indigo-600 text-white`;

    $: console.log(market.data.tokens);
</script>

<div class="flex flex-col gap-4">
    <div
        class={`flex flex-col rounded-2xl overflow-hidden ring-1 ${
            selectedToken ? "ring-neutral-900" : "ring-transparent"
        }`}
    >
        <div class="flex gap-3 col-span-3 bg-neutral-900/60 p-2">
            {#each market.data.tokens.sort( (a, b) => b.outcome.localeCompare(a.outcome) ) as token}
                <button
                    on:click={() => selectToken(token.token_id)}
                    class={`h-10 w-full flex px-4 justify-start items-center gap-1 lg:gap-2 rounded-xl font-semibold mt-auto shadow-xl ${tokenBtnClass(
                        token,
                        selectedToken
                    )}`}
                >
                    <span class="opacity-40">Buy</span>
                    {token.outcome}
                    <span class="ml-auto">$50</span>
                </button>
            {/each}
        </div>
        <div class="content" id="content">
            {#if selectedToken}
                <div
                    transition:fade={{ duration: 200, delay: 50 }}
                    class={"flex flex-col gap-4 p-3 pt-4 bg-neutral-950/80 border-t border-neutral-900"}
                >
                    <div class="flex mb-1 gap-3 justify-between flex-row">
                        <label
                            for="thing"
                            class="w-1/3 font-semibold text-neutral-300 mt-2"
                        >
                            {"Order type"}
                        </label>
                        <div class="w-2/3 xl:w-1/3 h-11">
                            <Toggle
                                selected={orderType === "limit"
                                    ? "left"
                                    : "right"}
                                onSelect={(s) =>
                                    (orderType =
                                        s === "left" ? "limit" : "market")}
                            >
                                <div class="contents" slot="left">
                                    <IconEaseInOutControlPoints size={12} />
                                    Limit
                                </div>
                                <div class="contents" slot="right">
                                    <IconLivePhoto size={12} />
                                    Market
                                </div>
                            </Toggle>
                        </div>
                    </div>
                    {#if orderType === "limit"}
                        <div
                            class="flex flex-col mb-1 gap-3 justify-between xl:flex-row"
                        >
                            <label
                                for="thing"
                                class="w-full xl:w-1/2 font-semibold text-neutral-300 xl:mt-2"
                            >
                                {"Limit price"}
                            </label>
                            <div
                                class="block overflow-hidden text-sm w-full rounded-xl ring-neutral-900/80 bg-white dark:bg-neutral-900/50"
                            >
                                <div
                                    class="w-full h-12 flex justify-between items-center p-2 gap-2 bg-neutral-900/80 rounded-xl ring-neutral-900 ring-inset"
                                >
                                    <button
                                        on:click={() =>
                                            (microUsd = Math.max(
                                                Math.round(microUsd / step) *
                                                    step -
                                                    step,
                                                0
                                            ))}
                                        class="action_icon opacity-60 hover:opacity-100"
                                    >
                                        <IconMinus size={16} />
                                    </button>
                                    <input
                                        type="string"
                                        value={usdFormatter.format(
                                            (buying
                                                ? microUsd
                                                : Number(expectedShares) *
                                                  (userShares.shares > 0
                                                      ? chance
                                                      : 1 - chance)) /
                                                USDC_PER_DOLLAR
                                        )}
                                        on:change={(e) => {
                                            const allowed =
                                                e.currentTarget.value.replace(
                                                    /[^0-9.]+/g,
                                                    ""
                                                );
                                            const num = parseFloat(allowed);
                                            if (isNaN(num)) {
                                                microUsd = defaultMicroUsd;
                                            } else {
                                                microUsd =
                                                    num * USDC_PER_DOLLAR;
                                                e.currentTarget.value =
                                                    usdFormatter.format(
                                                        microUsd /
                                                            USDC_PER_DOLLAR
                                                    ); // sometimes wasn't updating
                                            }
                                        }}
                                        class="text-lg max-w-[10rem] text-center text-neutral-300 outline-none bg-transparent"
                                    />
                                    <button
                                        class="action_icon opacity-60 hover:opacity-100"
                                        on:click={() =>
                                            (microUsd = buying
                                                ? Math.round(microUsd / step) *
                                                      step +
                                                  step
                                                : Math.min(
                                                      microUsd + step,
                                                      maxSell
                                                  ))}
                                    >
                                        <IconPlus size={20} />
                                    </button>
                                </div>
                                <div
                                    class="h-9 flex justify-center items-stretch rounded-full p-2 w-full gap-4"
                                >
                                    <div
                                        class="flex justify-center items-center w-full px-1 py-1"
                                    >
                                        <Slider
                                            extraClass={selectedToken
                                                ? selectedToken.outcome.toLowerCase() ===
                                                  "yes"
                                                    ? "yes"
                                                    : selectedToken.outcome.toLowerCase() ===
                                                      "no"
                                                    ? "no"
                                                    : ""
                                                : ""}
                                            bind:value={limitPrice}
                                            max={100}
                                            min={0}
                                        />
                                    </div>
                                    {#if !buying}
                                        <button
                                            on:click={() =>
                                                (microUsd = maxSell)}
                                            class={`rounded-lg font-semibold whitespace-nowrap bg-white text-black ring-1 ring-gray-300 text-xs px-2.5 hover:shadow-md`}
                                        >
                                            Sell Max
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/if}
                    <div
                        class="flex flex-col mb-1 gap-3 justify-between xl:flex-row"
                    >
                        <label
                            for="thing"
                            class="w-full xl:w-1/2 font-semibold text-neutral-300 xl:mt-2"
                        >
                            {"Shares"}
                        </label>
                        <div
                            class="block overflow-hidden text-sm w-full rounded-xl ring-neutral-900/80 bg-white dark:bg-neutral-900/50"
                        >
                            <div
                                class="w-full h-12 flex justify-between items-center p-2 gap-2 bg-neutral-900/80 rounded-xl ring-neutral-900 ring-inset"
                            >
                                <button
                                    on:click={() =>
                                        (microUsd = Math.max(
                                            Math.round(microUsd / step) * step -
                                                step,
                                            0
                                        ))}
                                    class="action_icon opacity-60 hover:opacity-100"
                                >
                                    <IconMinus size={16} />
                                </button>
                                <input
                                    type="string"
                                    value={usdFormatter.format(
                                        (buying
                                            ? microUsd
                                            : Number(expectedShares) *
                                              (userShares.shares > 0
                                                  ? chance
                                                  : 1 - chance)) /
                                            USDC_PER_DOLLAR
                                    )}
                                    on:change={(e) => {
                                        const allowed =
                                            e.currentTarget.value.replace(
                                                /[^0-9.]+/g,
                                                ""
                                            );
                                        const num = parseFloat(allowed);
                                        if (isNaN(num)) {
                                            microUsd = defaultMicroUsd;
                                        } else {
                                            microUsd = num * USDC_PER_DOLLAR;
                                            e.currentTarget.value =
                                                usdFormatter.format(
                                                    microUsd / USDC_PER_DOLLAR
                                                ); // sometimes wasn't updating
                                        }
                                    }}
                                    class="text-lg max-w-[10rem] text-center text-neutral-300 outline-none bg-transparent"
                                />
                                <button
                                    class="action_icon opacity-60 hover:opacity-100"
                                    on:click={() =>
                                        (microUsd = buying
                                            ? Math.round(microUsd / step) *
                                                  step +
                                              step
                                            : Math.min(
                                                  microUsd + step,
                                                  maxSell
                                              ))}
                                >
                                    <IconPlus size={20} />
                                </button>
                            </div>
                            <div
                                class="h-9 flex justify-center items-stretch rounded-full p-2 w-full gap-4"
                            >
                                <div
                                    class="flex justify-center items-center w-full px-1 py-1"
                                >
                                    <Slider
                                        extraClass={selectedToken
                                            ? selectedToken.outcome.toLowerCase() ===
                                              "yes"
                                                ? "yes"
                                                : selectedToken.outcome.toLowerCase() ===
                                                  "no"
                                                ? "no"
                                                : ""
                                            : ""}
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
                    <div class="text-neutral-400">
                        {#if !buying}
                            <div
                                class="pb-2 text-sm flex justify-between items-center"
                            >
                                <span class="">
                                    {`Your ${
                                        userShares.shares > 0 ? "'Yes'" : "'No'"
                                    } shares`}
                                </span>
                                <span class="text-black">
                                    {Math.abs(userShares.sharesUI)}
                                </span>
                            </div>
                        {/if}
                        <div
                            class="py-2 text-sm flex justify-between items-center"
                        >
                            {#if buying}
                                <span class="">Total</span>
                                <span>
                                    {(
                                        Number(expectedShares) / USDC_PER_DOLLAR
                                    ).toFixed(2)}
                                </span>
                            {:else}
                                <span class="">
                                    {`${
                                        userShares.shares > 0 ? "'Yes'" : "'No'"
                                    } shares to sell`}
                                </span>
                                <span class="">
                                    {(
                                        Number(expectedShares) / USDC_PER_DOLLAR
                                    ).toFixed(2)}
                                </span>
                            {/if}
                        </div>
                        <div
                            class="py-2 text-sm flex justify-between items-center"
                        >
                            <span class="">New probability</span>
                            <span class=""
                                >{`${(expectedChance * 100).toFixed(1)}%`}</span
                            >
                        </div>
                        {#if buying}
                            <div
                                class="py-2 text-sm flex justify-between items-center"
                            >
                                <span class="font-semibold"
                                    >{`Payout if ${
                                        direction ? "Yes" : "No"
                                    }`}</span
                                >
                                <span
                                    class={`font-semibold ${
                                        selectedToken.outcome.toLowerCase() ===
                                        "no"
                                            ? "text-red-400"
                                            : selectedToken.outcome.toLowerCase() ===
                                              "yes"
                                            ? "text-emerald-400"
                                            : "text-indigo-400"
                                    }`}
                                    >{`+ ${usdFormatter.format(
                                        Number(
                                            (BigInt(expectedShares) -
                                                BigInt(microUsd)) /
                                                10000n
                                        ) / 100
                                    )}`}</span
                                >
                            </div>
                        {/if}
                    </div>
                    <div class="hidden 2xl:flex" />
                    <button
                        class={`h-10 rounded-xl font-semibold cursor-pointer text-white ${tradeButtonClass}`}
                    >
                        {`${summary}`}
                    </button>
                </div>
            {/if}
        </div>
    </div>
    <div class="flex flex-col gap-2">
        <h4 class="font-semibold text-neutral-300">
            {`Limit orders`}
        </h4>
        <p class="text-neutral-300">
            {"You have no active limit orders."}
        </p>
    </div>
    <div class="flex flex-col gap-2">
        <h4 class="font-semibold text-neutral-300 my-1">
            {`Positions`}
        </h4>
        <!-- {#each Array.from(market.orderdata.entries()).slice(0, 1) as token}
            {#each token[1].positions.slice(0, 1) as position}
                {#if market.data.tokens.find((t) => t.token_id === token[0])}
                    <PmPosition
                        {market}
                        {updateMarket}
                        {position}
                        token={market.data.tokens.find(
                            (t) => t.token_id === token[0]
                        )}
                    />
                {/if}
            {/each}
        {/each} -->
    </div>
</div>

<style>
    .content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
    }
</style>
