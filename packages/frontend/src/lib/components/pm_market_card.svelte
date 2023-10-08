<script lang="ts">
    import IconCal from "@tabler/icons-svelte/dist/svelte/icons/IconCalendar.svelte";
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconDotsVertical.svelte";
    import IconTrade from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsUpDown.svelte";
    import { faker } from "@faker-js/faker";
    import ImageChecker from "$lib/elements/image_checker.svelte";
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import type { pmMarketFulldata } from "$lib/types";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import MarketCardLayout from "$lib/components/market_card_layout.svelte";
    export let market: pmMarketFulldata;
    export let updateMarket: (market?: marketFulldata | pmMarketFulldata) => void;
    export let small = false;
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
        <VolumePill pmMarket={market} />
        <SubsidyPill pmMarket={market} />
        <Pill>
            <IconCal size={14} class="text-red-400/50" />
            {`${new Date(market.data.end_date_iso).toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            })}`}
        </Pill>
    </div>
    <button slot="header_right" class="action_icon h-6 w-6">
        <IconMenu size={14} />
    </button>
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
    <span slot="title">
        {market.data.question}
    </span>
    <span slot="chance">
        {`68%`}
    </span>
    <div class="contents" slot="change">
        <ChangeIndicator pmMarket={market} />
    </div>
    <div class="contents" slot="bottom_left">
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
    <div class="contents" slot="bottom_right">
        <ShareButton pmMarket={market} {updateMarket} />
        <CommentButton pmMarket={market} />
        <LikeButton pmMarket={market} {updateMarket} />
        <button
            class="flex items-center justify-center rounded-lg text-sm gap-1 py-1.5 px-2.5 ring-1 ring-transparent shadow-lg bg-neutral-900 text-indigo-400/80 hover:text-indigo-300 hover:ring-indigo-800 hover:shadow-indigo-500/10"
        >
            <IconTrade size={16} />
            Trade
        </button>
    </div>
</MarketCardLayout>

<ImageChecker url={market.data.image} ratio={1.5} resolution={200}>
    <img
        src={market.data.image}
        class={`w-full h-72 rounded-lg object-cover object-center`}
        alt="market cover"
    />
</ImageChecker>
