<script lang="ts">
    import {
        IconCopy,
        IconExternalLink,
        IconArrowsUpDown,
        IconCalendar,
        IconDotsVertical,
    } from "@tabler/icons-svelte";
    import { faker } from "@faker-js/faker";
    import ImageChecker from "$lib/elements/image_checker.svelte";
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import type { pmMarketFulldata, pmUserMap } from "@am/backend/types/market";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import MarketCardLayout from "$lib/components/market_card_layout.svelte";
    import MenuButton from "./menu_button.svelte";
    import { getOrderbookSummary, type TOrderbookSummary } from "$lib/utils/pm";
    import type { TUser } from "@am/backend/types/user";
    import { fromOpUser, fromPmUser, generateProfileImage } from "$lib/utils";
    import type { TMarket, TPmMarket, TUserMinimal } from "$lib/types";

    export let market: TPmMarket;
    export let updateMarket: (market?: TMarket) => void;
    export let users: Map<string, TUser> = new Map<string, TUser>();
    export let pmUsers: pmUserMap = new Map() as pmUserMap;
    export let small = false;

    $: summariesPromise = Promise.all(
        market.data.tokens.map(async (e) => ({
            s: await getOrderbookSummary(e.token_id, market),
            ...e,
        }))
    ).then((r) => r.sort((a, b) => (b.s?.mid ?? 0.5) - (a.s?.mid ?? 0.5)));

    $: selectedSummaryPromise = summariesPromise.then((sp) => {
        return sp.find((s) => s.outcome === "Yes") ?? sp[0];
    });

    let traders = new Set<TUserMinimal>();
    $: market.orderdata.forEach((t) => {
        t.positions.forEach(({ address }) => {
            if (pmUsers.get(address))
                traders.add(fromPmUser(address, pmUsers.get(address)));
            if (users.get(address))
                traders.add(fromOpUser(address, users.get(address)));
        });
        t.filledOrders.forEach((o) => {
            if (o.maker) {
                if (pmUsers.get(o.maker))
                    traders.add(fromPmUser(o.maker, pmUsers.get(o.maker)));
                if (users.get(o.maker))
                    traders.add(fromOpUser(o.maker, users.get(o.maker)));
            }
            if (o.taker) {
                if (pmUsers.get(o.taker))
                    traders.add(fromPmUser(o.taker, pmUsers.get(o.taker)));
                if (users.get(o.taker))
                    traders.add(fromOpUser(o.taker, users.get(o.taker)));
            }
        });
    });
</script>

<MarketCardLayout href={market.data.condition_id} {small}>
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
            <IconCalendar
                size={14}
                class="text-orange-500 dark:text-orange-400/80"
            />
            {`${new Date(market.data.end_date_iso).toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            })}`}
        </Pill>
    </div>
    <MenuButton slot="header_right">
        <div slot="target" class="action_icon h-6 w-6">
            <IconDotsVertical size={14} />
        </div>
        <button
            on:click|stopPropagation|preventDefault={() =>
                window.navigator.clipboard.writeText(
                    `https://openpredict.org/market/${market.data.question_id}`
                )}
            class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50"
        >
            {`Copy link`}
            <IconCopy size={12} />
        </button>
        <a
            on:click|stopPropagation|preventDefault
            href={`https://polygonscan.com/address/${market.data.question_id}`}
            class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50"
        >
            {`Market contract`}
            <IconExternalLink size={12} />
        </a>
        <a
            on:click|stopPropagation|preventDefault
            href={`https://polygonscan.com/address/${market.data.condition_id}`}
            class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50"
        >
            {`Resolution contract`}
            <IconExternalLink size={12} />
        </a>
    </MenuButton>
    <span slot="title">
        {market.data.question}
    </span>
    <span slot="chance">
        {#await selectedSummaryPromise}
            {"--%"}
        {:then summary}
            {((summary.s?.mid ?? 0) * 100).toFixed(0) + "%" ?? "--%"}
        {/await}
    </span>
    <div class="contents" slot="context">
        <span
            class={`font-semibold text-xs text-neutral-700 dark:text-neutral-400`}
        >
            {#await selectedSummaryPromise}
                {"--"}
            {:then summary}
                <span
                    class={`${
                        summary.outcome === "Yes"
                            ? ""
                            : "text-indigo-600 dark:text-indigo-400"
                    }`}
                >
                    {summary.outcome}
                </span>
            {/await}
        </span>
    </div>
    <div class="contents" slot="bottom_left">
        <div class="flex items-center flex-nowrap">
            {#each Array.from(traders.values())
                .sort( (a, b) => (a.image.startsWith("http") ? -1 : b.image.startsWith("http") ? 1 : 0) )
                .slice(0, 4) as user}
                <img
                    src={user.image}
                    alt={user.name ?? user.id}
                    class="h-6 w-6 rounded-full -ml-1.5 flex-shrink-0 ring-1 ring-white dark:ring-neutral-950"
                />
            {/each}
            {#if traders.size > 4}
                <div
                    class="h-6 w-6 text-[9px] font-bold flex justify-center items-center flex-nowrap whitespace-nowrap rounded-full -ml-1.5 flex-shrink-0 ring-1 ring-white dark:text-white dark:ring-neutral-950 bg-neutral-200 dark:bg-neutral-800"
                >
                    {"+" + traders.size}
                </div>
            {/if}
        </div>
    </div>
    <div class="contents" slot="bottom_right">
        <!-- <ShareButton pmMarket={market} {updateMarket} /> -->
        <CommentButton market={{ pmMarket: market }} />
        <LikeButton market={{ pmMarket: market }} {updateMarket} />
        <button
            class="flex items-center justify-center rounded-lg text-sm gap-1 py-1.5 px-2.5 transition-all ring-1 dark:ring-transparent dark:shadow-lg dark:bg-neutral-900 dark:text-indigo-400/80 dark:hover:text-indigo-300 dark:hover:ring-indigo-800 dark:hover:shadow-indigo-500/10 shadow-sm bg-white text-indigo-700/90 hover:text-indigo-700 ring-indigo-200 hover:ring-indigo-300 hover:shadow-lg"
        >
            <IconArrowsUpDown size={16} />
            Trade
        </button>
    </div>
</MarketCardLayout>

<!-- <ImageChecker url={market.data.image} ratio={1.5} resolution={200}>
    <img
        src={market.data.image}
        class={`w-full h-72 rounded-lg object-cover object-center`}
        alt="market cover"
    />
</ImageChecker> -->

<!-- <ImageChecker
        slot="extra_content"
        url={market.data.image}
        ratio={1.2}
        resolution={400}
    >
        <img
            src={market.data.image}
            class={`w-full h-full rounded-lg object-cover object-center`}
            alt="market cover"
        />
    </ImageChecker> -->
