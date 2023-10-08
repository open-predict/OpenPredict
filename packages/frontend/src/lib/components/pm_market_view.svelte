<script lang="ts">
    import IconCal from "@tabler/icons-svelte/dist/svelte/icons/IconCalendar.svelte";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUser.svelte";
    import IconTrade from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsUpDown.svelte";
    import IconLiquidity from "@tabler/icons-svelte/dist/svelte/icons/IconDroplet.svelte";
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
    <div class="my-2">
        <TokenChart
            pmTokenOrderdata={market.tokeOrderdata}
            tokenMetadata={market.data.tokens}
        />
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
        <h4 class="text-xl font-medium text-neutral-200">Orderbook</h4>
        <div class="w-full border-t border-neutral-900 mb-2" />
        <div class="flex flex-col bg-neutral-950 rounded-xl overflow-hidden">
            <div
                class="flex justify-start items-center border-b border-neutral-900 px-4 gap-4"
            >
                {#each market.data.tokens as token}
                    <button
                        on:click={() => selectToken(token.token_id)}
                        class={`h-12 border-b-2 font-semibold text-sm ${
                            token.token_id === selectedToken?.id
                                ? "text-white border-neutral-400"
                                : "text-neutral-300 border-transparent"
                        }`}
                    >
                        {`Trade ${token.outcome}`}
                    </button>
                {/each}
            </div>
            {#if selectedToken}
                <div
                    id="order_book"
                    class="flex flex-col divide-y divide-neutral-800 text-sm text-neutral-400 h-72 overflow-y-scroll"
                >
                    <div class="flex flex-col">
                        {#each selectedToken.token.book.asks.sort((a, b) => b[0] - a[0]) as ask}
                            <div
                                class="flex h-10 relative hover:bg-neutral-500/5"
                            >
                                <div
                                    class="absolute h-full w-full left-0 flex justify-start"
                                >
                                    <div
                                        class="absolute h-full bg-neutral-400/5"
                                        style={`width: ${ask[0]}%`}
                                    />
                                </div>
                                <div
                                    class="w-1/3 px-4 py-2 flex justify-center items-center"
                                >
                                    {usdFormatter.format(ask[0] / 100)}
                                </div>
                                <div
                                    class="w-1/3 px-4 py-2 flex justify-center items-center"
                                >
                                    {usdFormatter.format(ask[1] / 100)}
                                </div>
                                <div
                                    class="w-1/3 px-4 py-2 flex justify-center items-center"
                                >
                                    {usdFormatter.format(
                                        (ask[0] * ask[1]) / 100
                                    )}
                                </div>
                            </div>
                        {/each}
                    </div>
                    <div
                        class="flex h-10 relative text-neutral-200"
                        id="midpoint"
                    >
                        <div
                            class="absolute h-full bg-neutral-400/10"
                            style={`width: ${spread}%; left: ${
                                selectedToken.token.book.asks.sort(
                                    (a, b) => a[0] - b[0]
                                )[0][0]
                            }%`}
                        />
                        <div
                            class="w-1/3 px-4 py-2 flex justify-center items-center"
                        >
                            Midpoint {midpoint
                                ? usdFormatter.format(midpoint / 100)
                                : "N/A"}
                        </div>
                        <div
                            class="w-1/3 px-4 py-2 flex justify-center items-center"
                        >
                            Spread {spread
                                ? usdFormatter.format(spread / 100)
                                : "N/A"}
                        </div>
                        <div class="w-1/3" />
                    </div>
                    <div class="flex flex-col">
                        {#each selectedToken.token.book.bids.sort((a, b) => b[0] - a[0]) as bid}
                            <div
                                class="flex h-10 relative hover:bg-neutral-500/5"
                            >
                                <div
                                    class="absolute h-full bg-neutral-400/5 right-0"
                                    style={`width: ${bid[0]}%`}
                                />
                                <div
                                    class="w-1/3 px-4 py-2 flex justify-center items-center"
                                >
                                    {usdFormatter.format(bid[0] / 100)}
                                </div>
                                <div
                                    class="w-1/3 px-4 py-2 flex justify-center items-center"
                                >
                                    {usdFormatter.format(bid[1] / 100)}
                                </div>
                                <div
                                    class="w-1/3 px-4 py-2 flex justify-center items-center"
                                >
                                    {usdFormatter.format(
                                        (bid[0] * bid[1]) / 100
                                    )}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
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
