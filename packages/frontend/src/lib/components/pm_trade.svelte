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
    import { usdFormatter, Errors, TxStatus, delay } from "$lib/utils";
    import confetti from "canvas-confetti";
    import { web3Store } from "$lib/web3Store";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import type {
        pmMarketFulldata,
        pmTokenData,
        pmTokenOrderdata,
    } from "$lib/types";
    import colors from "tailwindcss/colors";
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

    export let market: pmMarketFulldata;
    export let direction: boolean;
    export let onClose: () => void;
    export let updateMarket: (market: pmMarketFulldata) => void;

    let selectedToken: { token: pmTokenOrderdata; id: string } | undefined;

    async function selectToken(token: string) {
        var content = document.getElementById("content");
        if (selectedToken && selectedToken.id === token) {
            selectedToken = undefined;
            if (content) {
                content.style.minHeight = content.scrollHeight + "px";
                await delay(50);
                content.style.minHeight = "";
                content.style.maxHeight = "";
            }
        } else {
            selectedToken = {
                id: token,
                token: market.tokenOrderdata.get(token) as pmTokenOrderdata,
            };
            if (content) {
                await tick();
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
    }

    $: tokens = market.data.tokens.reduce(
        (acc: Record<string, pmTokenData>, val) => {
            acc[val.token_id] = val;
            return acc;
        },
        {}
    );

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

    let orderType: "limit" | "market" = "limit";

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

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center mb-1">
            <h4 class="font-semibold text-neutral-300">
                {`Buy shares`}
            </h4>
            <Toggle
                selected={orderType === "limit" ? "left" : "right"}
                onSelect={(s) =>
                    (orderType = s === "left" ? "limit" : "market")}
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
        <div class={`flex flex-col gap-4`}>
            <div class="flex gap-3 col-span-3">
                {#each Array.from(Object.entries(market.data.tokens)) as token}
                    <button
                        on:click={() => selectToken(token[0])}
                        class={`h-10 text-sm w-full rounded-xl font-semibold mt-auto ring-2 ${
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
            <div class="content" id="content">
                {#if selectedToken}
                    <div
                        transition:fade={{ duration: 200, delay: 50 }}
                        class={"flex flex-col gap-4"}
                    >
                        <div
                            class="block overflow-hidden text-sm w-full rounded-xl ring-1 ring-neutral-900/80 bg-white dark:bg-neutral-950"
                        >
                            <div
                                class="w-full h-12 flex justify-between items-center p-2 gap-2 bg-neutral-900/50 rounded-xl ring-1 ring-neutral-900 ring-inset"
                            >
                                <button
                                    on:click={() =>
                                        (microUsd = Math.max(
                                            Math.round(microUsd / step) * step -
                                                step,
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
                                    class="action_icon"
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
                        <div class="text-neutral-400">
                            {#if !buying}
                                <div
                                    class="pb-2 text-sm flex justify-between items-center"
                                >
                                    <span class="">
                                        {`Your ${
                                            userShares.shares > 0
                                                ? "'Yes'"
                                                : "'No'"
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
                                    <span class="">Shares</span>
                                    <span>
                                        {(
                                            Number(expectedShares) /
                                            USDC_PER_DOLLAR
                                        ).toFixed(2)}
                                    </span>
                                {:else}
                                    <span class="">
                                        {`${
                                            userShares.shares > 0
                                                ? "'Yes'"
                                                : "'No'"
                                        } shares to sell`}
                                    </span>
                                    <span class="">
                                        {(
                                            Number(expectedShares) /
                                            USDC_PER_DOLLAR
                                        ).toFixed(2)}
                                    </span>
                                {/if}
                            </div>
                            <div
                                class="py-2 text-sm flex justify-between items-center"
                            >
                                <span class="">New probability</span>
                                <span class=""
                                    >{`${(expectedChance * 100).toFixed(
                                        1
                                    )}%`}</span
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
                                        class={`font-semibold text-indigo-400`}
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
                            class={`h-10 rounded-xl font-semibold cursor-pointer ring-1 bg-gradient-to-r from-indigo-800 via-violet-700 to-indigo-700 text-white ring-indigo-600`}
                        >
                            {`${summary}`}
                        </button>
                    </div>
                {/if}
            </div>
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
        {#each Array.from(market.tokenOrderdata.entries()).slice(0, 1) as token}
            {#each token[1].positions.slice(0, 1) as position}
                <PmPosition {market} {updateMarket} {position} token={tokens[token[0]]} />
            {/each}
        {/each}
    </div>
</div>
