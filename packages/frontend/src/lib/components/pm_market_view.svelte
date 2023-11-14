<script lang="ts">
    import {
        IconArrowsExchange2 as IconExchange,
        IconVocabulary as IconOrderbook,
        IconChartLine as IconChart,
        IconDroplet as IconLiquidity,
        IconUser,
        IconCalendar as IconCal,
    } from "@tabler/icons-svelte";
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata, pmTokenData } from "@am/backend/types/market";
    import type {
        pmMarketFulldata,
        pmTokenOrderdata,
    } from "@am/backend/types/market";
    import TokenChart from "$lib/charts/token_chart.svelte";
    import Orderbook from "./pm_orderbook.svelte";
    import FilledOrders from "./filled_orders.svelte";
    import UserPill from "./user_pill.svelte";
    import PmTrade from "./pm_trade.svelte";
    import TradersPill from "$lib/elements/traders_pill.svelte";
    import { usd } from "$lib/utils/format";
    import { USDC_PER_DOLLAR } from "$lib/utils/op";
    import type { TMarket, TPmMarket } from "$lib/types";
    import MarketViewLayout from "./market_view_layout.svelte";
    export let market: TPmMarket;
    export let updateMarket: (market?: TMarket) => void;
    $: tokens = market.data.tokens.reduce(
        (acc: Record<string, pmTokenData>, val) => {
            acc[val.token_id] = val;
            return acc;
        },
        {}
    );
    let selectedView: "trades" | "chart" | "orderbook" = "chart";
</script>

<MarketViewLayout>
    <h2 slot="title" class="contents">
        {market.data.question}
    </h2>
    <div class="contents" slot="pills">
        <Pill>
            <div
                class="w-4 h-4 rounded-full ring-neutral-400 bg-blue-700 ring-1 ring-inset stroke-white p-1"
            >
                <PolymarketLogo />
            </div>
            <span>
                {"Polymarket"}
            </span>
        </Pill>
        <VolumePill market={{ pmMarket: market }} />
        <SubsidyPill market={{ pmMarket: market }} />
        <Pill>
            <IconLiquidity size={14} class="text-indigo-500" />
            {`$298`}
        </Pill>
        <TradersPill market={{ pmMarket: market }} />
        <Pill>
            <IconCal size={14} class="text-red-500" />
            {`${new Date(market.data.end_date_iso).toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            })}`}
        </Pill>
    </div>
    <div class="contents" slot="interactive">
        <div
            class="min-h-[300px] max-h-[400px] h-[300px] overflow-y-scroll scrollbar_hide"
        >
            {#if selectedView === "chart"}
                <TokenChart {market} />
                <div />
            {:else if selectedView === "orderbook"}
                <!-- <Orderbook {market} {updateMarket} /> -->
            {:else}
                <!-- <FilledOrders {market} {updateMarket} /> -->
            {/if}
        </div>
        <div
            class="w-full h-10 border-t border-neutral-200 dark:border-neutral-900"
        >
            <div
                class="w-full flex items-center justify-between h-full font-semibold text-xs divide-x bg-white divide-neutral-200 dark:divide-neutral-800 dark:bg-neutral-900/40"
            >
                <button
                    on:click={() => (selectedView = "chart")}
                    class={`flex gap-1 items-center justify-center w-full h-full ${
                        selectedView === "chart"
                            ? "text-black dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                    }`}
                >
                    <IconChart size={18} />
                    Chart
                </button>
                <button
                    on:click={() => (selectedView = "orderbook")}
                    class={`flex gap-1 items-center justify-center w-full h-full ${
                        selectedView === "orderbook"
                            ? "text-black dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                    }`}
                >
                    <IconOrderbook size={17} />
                    Orderbook
                </button>
                <button
                    on:click={() => (selectedView = "trades")}
                    class={`flex gap-1 items-center justify-center w-full h-full ${
                        selectedView === "trades"
                            ? "text-black dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                    }`}
                >
                    <IconExchange size={18} />
                    Trades
                </button>
            </div>
        </div>
    </div>
    <PmTrade
        slot="trade"
        market={{
            data: market.data,
            orderdata: market.orderdata,
            meta: market.meta,
        }}
        direction
        onClose={() => {}}
        updateMarket={() => {}}
    />
    <p slot="about" class="contents">
        {market.data.description}
    </p>
    <p class="contents" slot="resolution">
        {"This market has not yet been resolved."}
    </p>
    <div class="contents" slot="holders">
        <div class="w-full grid grid-cols-2 gap-8">
            {#each Array.from(market.orderdata.entries()) as tokenOrderdata}
                <div class="w-full flex flex-col gap-2">
                    <div class="flex justify-between flex-nowrap items-center">
                        <h4 class="text-md font-semibold text-neutral-200">
                            {`${tokens[tokenOrderdata[0]].outcome}`}
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
        </div>
    </div>
    <p class="contents" slot="comments">
        {"No comments"}
    </p>
</MarketViewLayout>
