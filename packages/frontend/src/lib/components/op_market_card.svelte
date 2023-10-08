<script lang="ts">
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconDotsVertical.svelte";
    import IconTrade from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsUpDown.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import { faker } from "@faker-js/faker";
    import Pill from "$lib/elements/pill.svelte";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import { PublicKey } from "@solana/web3.js";
    import { getChance } from "$lib/utils";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import { api } from "$lib/api";
    import MarketCardLayout from "./market_card_layout.svelte";
    import type { pmMarketFulldata } from "$lib/types";
    export let market: marketFulldata;
    export let updateMarket: (market?: marketFulldata | pmMarketFulldata) => void;
    export let small = false;

    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    $: chanceDisplay =
        (getChance(market.data.data.Yes, market.data.data.No) * 100).toFixed(
            0
        ) + "%";
    $: getCreatorResponse = api.getUser(id);
</script>

<MarketCardLayout href={id} {small}>
    <div class="contents" slot="pills">
        <Pill>
            {#await getCreatorResponse}
                <div />
            {:then creator}
                <div
                    class="w-4 h-4 rounded-full ring-1 ring-inset ring-neutral-400 overflow-hidden p-0.5"
                >
                    <img
                        class=""
                        src={creator?.metadata.image}
                        alt="user avatar"
                    />
                </div>
                <span>
                    {creator?.metadata.name ??
                        creator?.username ??
                        market.data.data.OperatorKey}
                </span>
            {/await}
        </Pill>
        <VolumePill opMarket={market} />
        <SubsidyPill opMarket={market} />
    </div>
    <button slot="header_right" class="action_icon h-6 w-6">
        <IconMenu size={14} />
    </button>
    <span slot="title">
        {market.metadata?.title}
    </span>
    <span slot="chance">
        {chanceDisplay}
    </span>
    <div class="contents" slot="change">
        <ChangeIndicator opMarket={market} />
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
        <ShareButton opMarket={market} {updateMarket} />
        <CommentButton opMarket={market} />
        <LikeButton opMarket={undefined} {updateMarket} />
        <button
            class="flex items-center justify-center rounded-lg text-sm gap-1 py-1.5 px-2.5 ring-1 ring-transparent shadow-lg bg-neutral-900 text-indigo-400/80 hover:text-indigo-300 hover:ring-indigo-800 hover:shadow-indigo-500/10"
        >
            <IconTrade size={16} />
            Trade
        </button>
    </div>
</MarketCardLayout>
