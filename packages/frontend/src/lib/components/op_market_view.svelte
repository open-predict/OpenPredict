<script lang="ts">
    import {
        IconArrowsExchange2,
        IconVocabulary,
        IconChartLine,
        IconDroplet,
        IconUser,
        IconCalendar,
    } from "@tabler/icons-svelte";
    import { faker } from "@faker-js/faker";
    import ImageChecker from "$lib/elements/image_checker.svelte";
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import InteractiveChart from "$lib/charts/interactive_chart.svelte";
    import { PublicKey } from "@solana/web3.js";
    import { api } from "$lib/api";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import Trade from "$lib/modals/trade.svelte";
    import UserPill from "./user_pill.svelte";
    import TradersPill from "$lib/elements/traders_pill.svelte";
    import OpChart from "$lib/charts/op_chart.svelte";
    import OpTrade from "./op_trade.svelte";
    import { getChance } from "$lib/utils/op";
    export let market: marketFulldata;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;
    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    $: chanceDisplay =
        (getChance(market.data.data.Yes, market.data.data.No) * 100).toFixed(
            0
        ) + "%";
    let tradeModal = false;
    let selectedView: "trades" | "chart" | "orderbook" = "chart";
</script>

<div class="w-full max-w-full p-4 flex flex-col gap-4">
    <div class="flex justify-start items-start">
        <h2
            class="text-2xl font-semibold text-white flex-grow group-visited/link:text-indigo-300"
        >
            {market.metadata?.title}
        </h2>
        <span
            class="text-2xl font-semibold text-white"
        >
            {chanceDisplay}
        </span>
    </div>
    <div class="w-full flex items-center flex-nowrap gap-2">
        <div class="relative w-9/10 max-w-9/10 grow overflow-hidden">
            <div
                class="absolute h-full w-20 bg-gradient-to-r from-transparent to-black right-0"
            />
            <div
                class="w-full flex justify-start gap-2 items-center overflow-x-scroll scrollbar_hide pr-20"
            >
                <UserPill {id} />
                <VolumePill opMarket={market} />
                <SubsidyPill opMarket={market} />
                <TradersPill opMarket={market} />
                <div class="ml-auto" />
            </div>
        </div>
    </div>
    <div
        class="relative bg-neutral-950/90 rounded-lg min-h-[300px] max-h-[400px] h-[300px] overflow-y-scroll scrollbar_hide text-neutral-400"
    >
        {#if selectedView === "chart"}
            <!-- <OpChart {market} /> -->
        {:else if selectedView === "orderbook"}
            <div class="flex justify-center items-center py-28">
                <p>
                    {"An orderbook is not yet available for this market."}
                </p>
            </div>
        {:else}
            <div class="flex justify-center items-center py-28">
                <p>
                    {"Trade history is not yet available for this market."}
                </p>
            </div>
        {/if}
        <div
            class="w-full h-10 absolute bottom-0 border-t border-neutral-900 bg-neutral-950"
        >
            <div
                class="w-full flex items-center justify-between h-full bg-neutral-900/40 font-semibold text-xs divide-x divide-neutral-800"
            >
                <button
                    on:click={() => (selectedView = "chart")}
                    class={`flex gap-1 items-center justify-center w-full h-full ${
                        selectedView === "chart"
                            ? "text-white"
                            : "text-neutral-400"
                    }`}
                >
                    <IconChartLine size={18} />
                    Chart
                </button>
                <button
                    on:click={() => (selectedView = "orderbook")}
                    class={`flex gap-1 items-center justify-center w-full h-full ${
                        selectedView === "orderbook"
                            ? "text-white"
                            : "text-neutral-400"
                    }`}
                >
                    <IconVocabulary size={17} />
                    Orderbook
                </button>
                <button
                    on:click={() => (selectedView = "trades")}
                    class={`flex gap-1 items-center justify-center w-full h-full ${
                        selectedView === "trades"
                            ? "text-white"
                            : "text-neutral-400"
                    }`}
                >
                    <IconArrowsExchange2 size={18} />
                    Trades
                </button>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-2 mb-8 mt-4">
        <div class="flex justify-between items-center">
            <h4 class="text-xl font-semibold text-neutral-200">Trade</h4>
        </div>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <!-- <PmTrade {market} {updateMarket} onClose={() => {}} direction /> -->
            <OpTrade {market} {updateMarket} />
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <h4 class="text-xl font-semibold text-neutral-200">Description</h4>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {market.metadata?.description.replaceAll("\n", "\n\n")}
        </p>
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <h4 class="text-xl font-semibold text-neutral-200">Resolution</h4>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {"This market has not yet been resolved."}
        </p>
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <div class="flex justify-between items-end">
            <h4 class="text-xl font-semibold text-neutral-200">Holders</h4>
        </div>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <!-- <div class="w-full grid grid-cols-2 gap-8">
            {#each Array.from(market.orderdata.entries()) as tokenOrderdata}
                <div class="w-full flex flex-col gap-2">
                    <div class="flex justify-between flex-nowrap items-center">
                        <h4 class="text-md font-semibold text-neutral-200">
                            {`${tokens[tokenOrderdata[0]].outcome} holders`}
                        </h4>
                        <span class="text-neutral-400 text-xs">POSITION</span>
                    </div>
                    <div class="flex flex-col divide-y divide-neutral-900">
                        {#each tokenOrderdata[1].positions.slice(0, 5) as position}
                            <div
                                class="flex justify-between text-neutral-200 items-center py-2"
                            >
                                <div class="max-w-1/2 overflow-hidden">
                                    <UserPill id={position.address} />
                                </div>
                                <p
                                    class={`text-sm ${
                                        tokens[tokenOrderdata[0]].outcome ===
                                        "Yes"
                                            ? "text-green-400"
                                            : tokens[tokenOrderdata[0]]
                                                  .outcome === "No"
                                            ? "text-red-500"
                                            : "text-indigo-400"
                                    }`}
                                >
                                    {usd.format(
                                        Number(position.position) /
                                            (USDC_PER_DOLLAR * 10000)
                                    )}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div> -->
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <div class="flex justify-between items-end">
            <h4 class="text-xl font-medium text-neutral-200">Comments</h4>
        </div>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {"No comments"}
        </p>
    </div>
</div>
