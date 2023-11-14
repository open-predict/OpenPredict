<script lang="ts">
    import {
        IconCopy,
        IconExternalLink,
        IconArrowsUpDown,
    } from "@tabler/icons-svelte";
    import type { marketFulldata, pmUserMap } from "@am/backend/types/market";
    import { faker } from "@faker-js/faker";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import { PublicKey } from "@solana/web3.js";
    import { getChance } from "$lib/utils/op";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import MarketCardLayout from "./market_card_layout.svelte";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import UserPill from "./user_pill.svelte";
    import MenuButton from "./menu_button.svelte";
    import type { TUser } from "@am/backend/types/user";
    import { generateProfileImage } from "$lib/utils";
    import type { TMarket, TOpMarket } from "$lib/types";
    export let market: TOpMarket;
    export let updateMarket: (
        market?: TMarket
    ) => void;
    export let users: Map<string, TUser> = new Map<string, TUser>();
    export let small = false;

    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    $: chanceDisplay =
        (getChance(market.data.data.Yes, market.data.data.No) * 100).toFixed(
            0
        ) + "%";
    $: creator = users.get(
        new PublicKey(market.data.data.OperatorKey).toBase58()
    );
</script>

<MarketCardLayout href={id} {small}>
    <div class="contents" slot="pills">
        <UserPill {id} user={creator} />
        <VolumePill market={{opMarket: market}} />
        <SubsidyPill market={{opMarket: market}} />
    </div>

    <MenuButton slot="header_right" strategy="fixed">
        <button
            on:click={() =>
                window.navigator.clipboard.writeText(
                    `https://openpredict.org/market/${new PublicKey(
                        market.data.data.AmmAddress
                    ).toBase58()}`
                )}
            class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50"
        >
            {`Copy link`}
            <IconCopy size={12} />
        </button>
        <a
            on:click|stopPropagation|preventDefault
            href={`https://solanabeach.io/address/${new PublicKey(
                market.data.data.AmmAddress
            ).toBase58()}`}
            class="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800/50"
        >
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
    <div class="contents" slot="context">
        <!-- <ChangeIndicator opMarket={market} /> -->
        <span
            class={`font-semibold text-xs text-neutral-700 dark:text-neutral-400`}
        >
            {`Yes`}
        </span>
    </div>
    <div class="contents" slot="bottom_left">
        {#each Array.from(users.entries()).slice(0, 4) as user}
            <img
                src={user[1].metadata.image ?? generateProfileImage(user[0])}
                alt={user[1].metadata.name ?? user[0]}
                class="h-6 w-6 rounded-full -ml-3 ring-2 ring-neutral-900"
            />
        {/each}
        {#if users.size > 4}
            <div
                class="h-6 w-6 rounded-full -ml-3 ring-2 ring-indigo-800 bg-neutral-900 flex justify-center items-center text-[9px] font-extrabold text-white"
            >
                {users.size - 4}
            </div>
        {/if}
    </div>
    <div class="contents" slot="bottom_right">
        <!-- <ShareButton opMarket={market} {updateMarket} /> -->
        <CommentButton market={{opMarket: market}} />
        <LikeButton market={{opMarket: market}} {updateMarket} />
        <button
            class="flex items-center justify-center rounded-lg text-sm gap-1 py-1.5 px-2.5 transition-all ring-1 dark:ring-transparent dark:shadow-lg dark:bg-neutral-900 dark:text-indigo-400/80 dark:hover:text-indigo-300 dark:hover:ring-indigo-800 dark:hover:shadow-indigo-500/10 shadow-sm bg-white text-indigo-700/90 hover:text-indigo-700 ring-indigo-200 hover:ring-indigo-300 hover:shadow-lg"
        >
            <IconArrowsUpDown size={16} />
            Trade
        </button>
    </div>
</MarketCardLayout>
