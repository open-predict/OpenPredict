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
    import type { TPmMarket } from "$lib/types";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import InteractiveChart from "$lib/charts/interactive_chart.svelte";
    import { usdFormatter } from "$lib/utils";
    export let market: TPmMarket;
    export let updateMarket: (market?: marketFulldata | TPmMarket) => void;
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
        <div class="flex-grow flex ml-auto justify-end items-center">
            <ShareButton pmMarket={market} {updateMarket} />
            <LikeButton pmMarket={market} {updateMarket} />
        </div>
    </div>
    <div class="w-full flex justify-between items-center flex-nowrap gap-2">
        <div class="w-full flex justify-start gap-2 items-center">
            <VolumePill pmMarket={market} />
            <SubsidyPill pmMarket={market} />
            <Pill>
                <IconLiquidity size={14} class="text-indigo-500" />
                {`$298`}
            </Pill>
            <Pill>
                <IconUser size={14} class="text-sky-500" />
                {`${market.subgraph.positions.size}`}
            </Pill>
            <div class="ml-auto" />
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
        </div>
    </div>
    <div
        class="h-72 my-2 rounded-lg bg-neutral-950 dotted_background opacity-50"
    />
    <div class="w-full flex items-start justify-start my-2">
        <div
            class="flex w-full align-top gap-4 justify-start items-start flex-nowrap"
        >
            <div class="flex flex-col justify-start items-start">
                <h2 class="text-md lg:text-3xl font-bold text-white">68%</h2>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-2 mb-8">
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
                <button
                    class="h-12 text-white border-b-2 border-neutral-400 font-semibold text-sm"
                >
                    Trade Yes
                </button>
                <button class="h-12 text-neutral-100 font-semibold text-sm">
                    Trade No
                </button>
            </div>
            {#each Array.from(market.book.values()) as book}
                <div
                    class="flex flex-col divide-y divide-neutral-900 text-sm text-neutral-500 h-72 overflow-y-scroll"
                >
                    <div class="flex flex-col">
                        {#each book.asks.sort((a, b) => b[0] - a[0]) as ask}
                            <div class="flex h-10">
                                <div
                                    class="w-2/5 flex justify-start items-center"
                                >
                                    <div
                                        style={`width: ${ask[0]}%`}
                                        class="bg-red-400/10 h-full"
                                    />
                                </div>
                                <div
                                    class="w-1/5 px-4 py-2 flex justify-end items-center"
                                >
                                    {usdFormatter.format(ask[0] / 100)}
                                </div>
                                <div
                                    class="w-1/5 px-4 py-2 flex justify-end items-center"
                                >
                                    {usdFormatter.format(ask[1] / 100)}
                                </div>
                                <div
                                    class="w-1/5 px-4 py-2 flex justify-end items-center"
                                >
                                    {usdFormatter.format(
                                        (ask[0] * ask[1]) / 100
                                    )}
                                </div>
                            </div>
                        {/each}
                    </div>
                    <div class="flex h-10">
                        <div
                            class="w-2/5 px-4 py-2 flex justify-start items-center"
                        >
                            Last $2.00
                        </div>
                        <div
                            class="w-1/5 px-4 py-2 flex justify-start items-center"
                        >
                            Spread $0.20
                        </div>
                        <div class="w-1/5" />
                        <div class="w-1/5" />
                    </div>
                    <div class="flex flex-col">
                        {#each book.bids.sort((a, b) => b[0] - a[0]) as bid}
                            <div class="flex h-10">
                                <div
                                    class="w-2/5 flex justify-start items-center"
                                >
                                    <div
                                        style={`width: ${100 - bid[0]}%`}
                                        class="bg-green-400/10 h-full"
                                    />
                                </div>
                                <div
                                    class="w-1/5 px-4 py-2 flex justify-end items-center"
                                >
                                    {usdFormatter.format(bid[0] / 100)}
                                </div>
                                <div
                                    class="w-1/5 px-4 py-2 flex justify-end items-center"
                                >
                                    {usdFormatter.format(bid[1] / 100)}
                                </div>
                                <div
                                    class="w-1/5 px-4 py-2 flex justify-end items-center"
                                >
                                    {usdFormatter.format(
                                        (bid[0] * bid[1]) / 100
                                    )}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
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
</div>
