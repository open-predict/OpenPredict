<script lang="ts">
    import { IconArrowsExchange2 as IconExchange , IconVocabulary as IconOrderbook, IconChartLine as IconChart,IconDroplet as IconLiquidity, IconUser, IconCalendar as IconCal } from "@tabler/icons-svelte"
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata, pmTokenData } from "@am/backend/types/market";
    import type { pmMarketFulldata, pmTokenOrderdata } from "@am/backend/types/market";
    import TokenChart from "$lib/charts/token_chart.svelte";
    import Orderbook from "./orderbook.svelte";
    import FilledOrders from "./filled_orders.svelte";
    import { USDC_PER_DOLLAR } from "$lib/web3_utils";
    import { usdFormatter } from "$lib/utils";
    import UserPill from "./user_pill.svelte";
    import PmTrade from "./pm_trade.svelte";
    export let market: pmMarketFulldata;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;
    $: tokens = market.data.tokens.reduce(
        (acc: Record<string, pmTokenData>, val) => {
            acc[val.token_id] = val;
            return acc;
        },
        {}
    );
    let selectedView: "trades" | "chart" | "orderbook" = "chart";
</script>

<div class="w-full max-w-full p-4 flex flex-col gap-4">
    <div class="flex justify-start items-start">
        <h2
            class="text-2xl font-semibold text-white flex-grow group-visited/link:text-indigo-300"
        >
            {market.data.question}
        </h2>
    </div>
    <div class="w-full flex items-center flex-nowrap gap-2">
        <div class="relative w-9/10 max-w-9/10 grow overflow-hidden">
            <div
                class="absolute h-full w-20 bg-gradient-to-r from-transparent to-black right-0"
            />
            <div
                class="w-full flex justify-start gap-2 items-center overflow-x-scroll scrollbar_hide pr-20"
            >
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
                <VolumePill pmMarket={market} />
                <SubsidyPill pmMarket={market} />
                <Pill>
                    <IconLiquidity size={14} class="text-indigo-500" />
                    {`$298`}
                </Pill>
                <Pill>
                    <IconUser size={14} class="text-sky-500" />
                    {`${Array.from(market.orderdata.values()).reduce(
                        (acc, val) => {
                            acc += val.positions.length;
                            return acc;
                        },
                        0
                    )}`}
                </Pill>
                <Pill>
                    <IconCal size={14} class="text-red-500" />
                    {`${new Date(market.data.end_date_iso).toLocaleDateString(
                        "en-us",
                        {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                        }
                    )}`}
                </Pill>
                <div class="ml-auto" />
            </div>
        </div>
    </div>
    <div
        class="relative bg-neutral-950/90 rounded-lg min-h-[300px] max-h-[400px] h-[300px] overflow-y-scroll scrollbar_hide"
    >
        {#if selectedView === "chart"}
            <TokenChart
                pmTokenOrderdata={market.orderdata}
                tokenMetadata={market.data.tokens}
            />
        {:else if selectedView === "orderbook"}
            <Orderbook {market} {updateMarket} />
        {:else}
            <FilledOrders {market} {updateMarket} />
        {/if}
        <div
            class="h-10 sticky bottom-0 border-t border-neutral-900 bg-neutral-950"
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
                    <IconChart size={18} />
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
                    <IconOrderbook size={17} />
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
                    <IconExchange size={18} />
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
        <PmTrade {market} {updateMarket} onClose={() => {}} direction />
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <h4 class="text-xl font-semibold text-neutral-200">Description</h4>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {market.data.description.replaceAll("\n", "\n\n")}
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
        <div class="w-full grid grid-cols-2 gap-8">
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
                                    {usdFormatter.format(
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
