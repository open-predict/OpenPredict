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
    import { PublicKey } from "@solana/web3.js";
    import { getChance } from "$lib/web3_utils";
    import { api } from "$lib/api";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import Trade from "$lib/modals/trade.svelte";
    import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    export let market: marketFulldata;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;

    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    $: chanceDisplay =
        (getChance(market.data.data.Yes, market.data.data.No) * 100).toFixed(
            0
        ) + "%";
    $: getCreatorResponse = api.getUser(id);

    let tradeModal = false;
</script>

<Dialog
    open={tradeModal}
    on:close={() => (tradeModal = false)}
    class="fixed inset-0 z-10 overflow-y-auto flex min-h-full items-center justify-center text-center"
>
    <DialogOverlay
        class="fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity"
    />

    <Trade
        {market}
        direction={true}
        onClose={() => (tradeModal = false)}
        {updateMarket}
    />
</Dialog>

<div class="w-full max-w-full p-4 flex flex-col gap-4">
    <!-- <ImageChecker url={market.data.image} ratio={1} resolution={400}>
        <img
            src={market.data.image}
            class={`w-full h-72 rounded-xl object-cover object-center mb-2`}
            alt="market cover"
        />
    </ImageChecker> -->
    <h2
        class="text-xl lg:text-2xl font-semibold text-white flex-grow group-visited/link:text-indigo-300"
    >
        {market.metadata?.title}
    </h2>
    <div class="w-full flex justify-between items-center flex-nowrap gap-2">
        <div class="w-full flex justify-start gap-2 items-center">
            <VolumePill opMarket={market} />
            <SubsidyPill opMarket={market} />
            <Pill>
                <IconLiquidity size={14} class="text-indigo-500" />
                {`$298`}
            </Pill>
            <Pill>
                <IconUser size={14} class="text-sky-500" />
                {`${market.data.UserAccounts.size}`}
            </Pill>
            <div class="ml-auto" />
        </div>
    </div>
    <div class="w-full flex items-start justify-start">
        <div
            class="flex w-full align-top gap-4 justify-start items-start flex-nowrap"
        >
            <div class="ml-3 flex flex-col justify-start items-end">
                <h2 class="text-md lg:text-2xl font-bold text-white">
                    {chanceDisplay}
                </h2>
                <ChangeIndicator opMarket={market} />
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
    <InteractiveChart priceData={market.data.PriceHistory} />
    <p
        class="w-full font-normal leading-relaxed break-words lg:text-md overflow-hidden whitespace-pre-wrap text-neutral-700 dark:text-neutral-200"
    >
        {market.metadata?.description.replaceAll("\n", "\n\n")}
    </p>
    <div class="w-full flex flex-nowrap justify-start items-center">
        <div class="flex flex-nowrap pl-4 p-1">
            {#each Array.from(Array(4)) as t}
                <img
                    src={faker.image.avatar()}
                    alt="s"
                    class="h-6 w-6 rounded-full -ml-3 ring-2 ring-neutral-900"
                />
            {/each}
            <div
                class="h-6 w-6 rounded-full -ml-3 ring-2 ring-indigo-800 bg-neutral-900 flex justify-center items-center text-[9px] font-extrabold text-white"
            >
                +23
            </div>
        </div>
        <div
            class="flex-grow flex ml-auto justify-end items-center gap-1 lg:gap-4"
        >
            <ShareButton opMarket={market} {updateMarket} />
            <CommentButton opMarket={market} />
            <LikeButton opMarket={market} {updateMarket} />
            <button
                on:click={() => tradeModal = true}
                class="flex items-center justify-center rounded-lg text-sm gap-1 py-1.5 px-2.5 ring-1 ring-transparent shadow-lg bg-neutral-900 text-indigo-400/80 hover:text-indigo-300 hover:ring-indigo-800 hover:shadow-indigo-500/10"
            >
                <IconTrade size={16} />
                Trade
            </button>
        </div>
    </div>
</div>
