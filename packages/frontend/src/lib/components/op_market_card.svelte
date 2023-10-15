<script lang="ts">
    import { IconCopy, IconExternalLink, IconArrowsUpDown } from "@tabler/icons-svelte"
    import type { marketFulldata } from "@am/backend/types/market";
    import { faker } from "@faker-js/faker";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import { PublicKey } from "@solana/web3.js";
    import { getChance } from "$lib/web3_utils";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import MarketCardLayout from "./market_card_layout.svelte";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import UserPill from "./user_pill.svelte";
    import MenuButton from "./menu_button.svelte";
    export let market: marketFulldata;
    export let updateMarket: (market?: marketFulldata | pmMarketFulldata) => void;
    export let small = false;

    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    $: chanceDisplay =
        (getChance(market.data.data.Yes, market.data.data.No) * 100).toFixed(
            0
        ) + "%";
    // $: getCreatorResponse = api.getUser(id);
</script>

<MarketCardLayout href={id} {small}>
    <div class="contents" slot="pills">
       <UserPill id={id} />
        <VolumePill opMarket={market} />
        <SubsidyPill opMarket={market} />
    </div>

    <MenuButton slot="header_right" strategy="fixed">
        <button on:click={() => window.navigator.clipboard.writeText(`https://openpredict.org/market/${new PublicKey(market.data.data.AmmAddress).toBase58()}`)} class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50">
            {`Copy link`}
            <IconCopy size={12} />
        </button>
        <a on:click|stopPropagation|preventDefault href={`https://solanabeach.io/address/${new PublicKey(market.data.data.AmmAddress).toBase58()}`} class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50">
            {`Market contract`}
            <IconExternalLink size={12} />
        </a>
    </MenuButton>
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
            <IconArrowsUpDown size={16} />
            Trade
        </button>
    </div>
</MarketCardLayout>
