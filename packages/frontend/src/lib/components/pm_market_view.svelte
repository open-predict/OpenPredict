<script lang="ts">
    import IconCal from "@tabler/icons-svelte/dist/svelte/icons/IconCalendar.svelte";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUser.svelte";
    import IconTrade from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsUpDown.svelte";
    import IconLiquidity from "@tabler/icons-svelte/dist/svelte/icons/IconDroplet.svelte";
    import IconChart from "@tabler/icons-svelte/dist/svelte/icons/IconChartLine.svelte";
    import IconOrderbook from "@tabler/icons-svelte/dist/svelte/icons/IconVocabulary.svelte";
    import IconExchange from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsExchange2.svelte";
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
    import { usdFormatter } from "$lib/utils";
    import { afterUpdate, onMount, tick } from "svelte";
    import { tokenize } from "protobufjs";
    import type { pmMarketFulldata, pmTokenOrderdata } from "$lib/types";
    import TokenChart from "$lib/charts/token_chart.svelte";
    import { image } from "d3";
    import { Avatar } from "flowbite-svelte";
    import Orderbook from "./orderbook.svelte";
    export let market: pmMarketFulldata;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;

    let selectedToken: { token: pmTokenOrderdata; id: string } | undefined;

    async function selectToken(token: string) {
        selectedToken = {
            id: token,
            token: market.tokeOrderdata.get(token) as pmTokenOrderdata,
        };
        await tick();
        const book = window.document.getElementById("order_book");
        const midpoint = window.document.getElementById("midpoint");
        if (book && midpoint) {
            const centeringOffset =
                book.clientHeight * 0.5 - midpoint.clientHeight * 0.5;
            book.scrollTop =
                midpoint.getBoundingClientRect().top -
                book.getBoundingClientRect().top +
                book.scrollTop -
                centeringOffset;
        }
    }

    $: spread = selectedToken
        ? Math.abs(
              50 -
                  selectedToken.token.book.bids.sort(
                      (a, b) => b[0] - a[0]
                  )[0][0] +
                  (50 -
                      selectedToken.token.book.asks.sort(
                          (a, b) => a[0] - b[0]
                      )[0][0])
          )
        : null;
    $: midpoint =
        selectedToken && spread
            ? selectedToken.token.book.asks.sort((a, b) => a[0] - b[0])[0][0] +
              spread / 2
            : null;

    onMount(async () => {
        if (market.data.tokens[0]) {
            selectToken(market.data.tokens[0].token_id);
        }
    });

    let selectedView: "trades" | "chart" | "orderbook" = "chart";
</script>

<div class="w-full max-w-full p-4 flex flex-col gap-4">
    <!-- <ImageChecker url={market.data.image} ratio={1} resolution={400}>
        <img
            src={market.data.image}
            class={`w-full h-56 rounded-xl object-cover object-center mb-2`}
            alt="market cover"
        />
    </ImageChecker> -->
    <div class="flex justify-start items-start">
        <h2
            class="text-2xl font-semibold text-white flex-grow group-visited/link:text-indigo-300"
        >
            {market.data.question}
        </h2>
        <!-- <div class="flex-grow flex ml-auto justify-end items-center">
            <ShareButton pmMarket={market} {updateMarket} />
            <LikeButton pmMarket={market} {updateMarket} />
        </div> -->
    </div>
    <div class="w-full flex items-center flex-nowrap gap-2">
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
            {`${Array.from(market.tokeOrderdata.values()).reduce((acc, val) => {
                acc += val.positions.length;
                return acc;
            }, 0)}`}
        </Pill>
        <Pill>
            <IconCal size={14} class="text-red-500" />
            {`${new Date(market.data.end_date_iso).toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            })}`}
        </Pill>
        <div class="ml-auto" />
    </div>
    <div
        class="relative bg-neutral-950/90 rounded-lg min-h-[200px] max-h-[400px] h-250 overflow-y-scroll scrollbar_hide"
    >
        {#if selectedView === "chart"}
            <TokenChart
                pmTokenOrderdata={market.tokeOrderdata}
                tokenMetadata={market.data.tokens}
            />
        {:else if selectedView === "orderbook"}
            <Orderbook {market} {updateMarket} />
        {:else}
            <div class="spotted_background" />
        {/if}
        <div
            class="h-10 sticky bottom-0 border-t border-neutral-900 bg-neutral-950"
        >
            <div class="w-full flex items-center justify-between h-full bg-neutral-900/40 font-semibold text-xs divide-x divide-neutral-800">
                <div class="px-2 w-full flex justify-center">
                    <button
                        on:click={() => (selectedView = "chart")}
                        class={`flex gap-1 items-center justify-center w-full h-full rounded-lg ${
                            selectedView === "chart"
                                ? "text-white"
                                : "text-neutral-400"
                        }`}
                    >
                        <IconChart size={18} />
                        Chart
                    </button>
                </div>
                <div class="px-2 w-full flex justify-center">
                    <button
                        on:click={() => (selectedView = "orderbook")}
                        class={`flex gap-1 items-center justify-center w-full h-full rounded-lg ${
                            selectedView === "orderbook"
                                ? "text-white"
                                : "text-neutral-400"
                        }`}
                    >
                        <IconOrderbook size={17} />
                        Orderbook
                    </button>
                </div>
                <div class="px-2 w-full flex justify-center">
                    <button
                        on:click={() => (selectedView = "trades")}
                        class={`flex gap-1 items-center justify-center w-full h-full rounded-lg ${
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
    </div>
    <!-- <div class="w-full flex items-start justify-start my-2">
        <div
            class="flex w-full align-top gap-4 justify-start items-start flex-nowrap"
        >
            <div class="flex flex-col justify-start items-start">
                <h2 class="text-md lg:text-3xl font-bold text-white">68%</h2>
            </div>
        </div>
    </div> -->
    <div class="flex flex-col gap-2 mb-8 mt-4">
        <h4 class="text-xl font-medium text-neutral-200">Description</h4>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {market.data.description.replaceAll("\n", "\n\n")}
        </p>
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <h4 class="text-xl font-medium text-neutral-200">Resolution</h4>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {"This market has not yet been resolved."}
        </p>
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <div class="flex justify-between items-end">
            <h4 class="text-xl font-medium text-neutral-200">Holders</h4>
            <span class="text-neutral-400 text-sm"> View trades </span>
        </div>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <p
            class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-300"
        >
            {"This market has not yet been resolved."}
        </p>
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
