<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import IconLink from "@tabler/icons-svelte/dist/svelte/icons/IconLink.svelte";
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import { PublicKey } from "@solana/web3.js";
    import { trpcc } from "$lib/trpc.js";
    import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    import MarketCardLarge from "$lib/components/market_card_large.svelte";
    import SuperJSON from "superjson";
    import MarketActions from "$lib/components/market_actions.svelte";
    import type { TMarketIdPageData } from "./+page.js";
    import ProfileButton from "$lib/components/profile_button.svelte";
    import { autoresizeTextarea, getChance, timeAgo } from "$lib/utils.js";
    import PositionCard from "$lib/components/position_card.svelte";
    import CreatorControls from "$lib/components/creator_controls.svelte";
    import { browser } from "$app/environment";
    import AccountSummary from "$lib/components/account_summary.svelte";
    import type { marketFulldata } from "@am/backend/types/market.js";
    import MainHeader from "$lib/components/main_header.svelte";

    export let data;
    let { id, marketData, users, commentsRes } =
        SuperJSON.deserialize<TMarketIdPageData>(data);

    let market = marketData?.market;
    $: chance = market
        ? getChance(market.data.data.Yes, market.data.data.No)
        : 0.5;

    enum Tabs {
        Comments = "comments",
        Positions = "positions",
    }

    let currentTab: string =
        browser && window.location.hash.includes("positions")
            ? Tabs.Positions
            : Tabs.Comments;

    let tradeDirection = true;
    let comment = "";

    async function postComment() {
        if ($web3Store.publicKey) {
            const posted = await $web3Workspace.makeAuthenticatedRequest(() =>
                trpcc.comment
                    .mutate({
                        ammAddress: id,
                        content: comment,
                    })
                    .then((res) => !res?.error)
                    .catch(() => false)
            );
            if (!posted) {
                alert("comment not posted");
            } else {
                if (market) {
                    market.data.CommentCount = market.data.CommentCount + 1;
                }
                commentsRes.comments.unshift({
                    createdAt: new Date(Date.now() - 1000),
                    userKey: $web3Store.publicKey?.toBase58(),
                    content: comment,
                });
                commentsRes = commentsRes; // svelte reactivity
                comment = "";
            }
        }
    }

    function updateMarket(m: marketFulldata) {
        market = m;
    }

    $: creator =
        $web3Store?.publicKey &&
        market &&
        $web3Store.publicKey.toBase58() ===
            new PublicKey(market.data.data.OperatorKey).toBase58();

    $: createdAt = market?.data?.PriceHistory[0]?.At as Date | undefined;

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
    });
</script>

<ColumnLayout>
    <MainHeader slot="main-header">
        <div
            class="text-sm w-full flex flex-col justify-center items-center line-clamp-1 overflow-ellipsis"
        >
            {#if market}
                <p
                    class="text-black max-w-[14rem] overflow-hidden overflow-ellipsis"
                >
                    {market.metadata?.title}
                </p>
                <p
                    class="text-xs text-gray-500 max-w-[12rem] overflow-hidden overflow-ellipsis"
                >
                    {`Created on ${dateFormatter.format(createdAt)}`}
                </p>
            {/if}
        </div>
        <button
            class="rounded-full p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-200"
            on:click={() => navigator.clipboard.writeText(window.location.href)}
        >
            <IconLink stroke={1.5} size={20} />
        </button>
    </MainHeader>
    <!-- <div
        slot="main-header"
        class="w-full h-full flex justify-center items-center"
    >
        
    </div> -->
    <div
        slot="main-footer"
        class="flex h-full md:hidden flex-nowrap px-4 justify-between items-center bg-white border-t border-gray-200 rounded-tl-3xl rounded-tr-3xl"
    >
        {#if market}
            <div class="flex flex-col">
                <p class={`whitespace-pre-wrap font-semibold text-xl`}>
                    {`${(chance * 100).toFixed(1)}%`}
                </p>
                <span class="text-xs -mt-1 text-gray-500">{"CHANCE"}</span>
            </div>
            <div class="w-3/4 flex flex-nowrap gap-2">
                <MarketActions {market} small {updateMarket} />
            </div>
        {/if}
    </div>
    <div slot="main" class="min-h-full flex flex-col">
        <div class="p-8 bg-white">
            {#if market}
                <MarketCardLarge {market} {users} {updateMarket} />
            {/if}
        </div>
        <div class="border-y bg-white">
            <nav class="flex space-x-8 -mb-px px-8">
                {#each Object.entries(Tabs) as [_t, tab]}
                    <button
                        id={tab}
                        on:click={() => {
                            currentTab = tab;
                            history.replaceState(
                                history.state,
                                `Market Comments`,
                                `#${tab}`
                            );
                        }}
                        aria-current={currentTab === tab ? "page" : undefined}
                        class={`flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                            tab === currentTab
                                ? "border-black text-black"
                                : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                        }`}
                    >
                        {_t}
                        <span
                            class={`ml-3 hidden rounded-full py-0.5  px-2.5 text-xs font-medium md:inline-block ${
                                tab === currentTab
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            {#if market}
                                <!-- {#if tab === Tabs.Activity}
                                        {0}
                                    {/if} -->
                                {#if tab === Tabs.Comments}
                                    {market.data.CommentCount}
                                {/if}
                                {#if tab === Tabs.Positions}
                                    {market.data.UserAccounts.size}
                                {/if}
                                <!-- {#if tab === Tabs.Trades}
                                        {res.resp.Trades.length}
                                    {/if} -->
                            {/if}
                        </span>
                    </button>
                {/each}
            </nav>
        </div>
        {#if currentTab === Tabs.Comments}
            <div class="flex flex-col divide-y divide-gray-200">
                <div class="w-full p-8 flex gap-4 items-start">
                    {#if $web3Store?.publicKey}
                        <div class="mt-1">
                            <ProfileButton
                                publicKey={$web3Store?.publicKey}
                                small
                            />
                        </div>
                    {/if}
                    <div class="w-full">
                        <div class="pl-2">
                            <textarea
                                rows={1}
                                name="comment-box"
                                id="comment-box"
                                placeholder="Add a comment..."
                                use:autoresizeTextarea
                                bind:value={comment}
                                class="block w-full border-0 border-b border-gray-200 pr-4 text-gray-900 placehlder:text-gray-400 focus:border-gray-400 focus:ring-0"
                            />
                        </div>
                        <div class="mt-4 flex justify-end">
                            <button
                                on:click={postComment}
                                class="btn_secondary w-full"
                            >
                                {"Post comment"}
                            </button>
                        </div>
                    </div>
                </div>
                {#each commentsRes.comments as comment}
                    <div class="p-8 flex flex-col">
                        <div class="w-full flex items-center">
                            <ProfileButton
                                publicKey={new PublicKey(comment.userKey)}
                                profile={commentsRes.users.get(comment.userKey)}
                            />
                            <span class="ml-auto text-gray-400 text-sm">
                                {timeAgo(comment.createdAt)}
                            </span>
                        </div>
                        <p class="pl-12 mt-2">
                            {comment.content}
                        </p>
                    </div>
                {/each}
                <div />
            </div>
        {/if}
        {#if currentTab === Tabs.Positions}
            <div class="flex flex-col divide-y divide-gray-200">
                {#if market}
                    {#each Array.from(market.data.UserAccounts) as [publicKey, marketUserChaindata]}
                        <PositionCard
                            publicKey={new PublicKey(publicKey)}
                            {marketUserChaindata}
                            profile={users?.get(publicKey)}
                        />
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
    <div slot="right" class="flex flex-col gap-2.5">
        {#if market}
            {#if $web3Store?.publicKey}
                <div class="bg-white ring-1 rounded-3xl ring-gray-200">
                    <AccountSummary />
                </div>
            {/if}
            {#if creator}
                <div
                    class="ring-1 rounded-3xl bg-white ring-gray-200 flex flex-col"
                >
                    <CreatorControls {market} {updateMarket} />
                </div>
            {/if}
            {#if $web3Store?.publicKey}
                <div
                    class="ring-1 rounded-3xl bg-white ring-gray-200 flex flex-col"
                >
                    <div class="flex flex-col gap-2 divide-gray-200 p-8">
                        {#if market.data.data.Resolved !== null}
                            <h4 class="text-lg">
                                {`Market resolved as ${
                                    market.data.data.Resolved ? "Yes" : "No"
                                }`}
                            </h4>
                            <p class="text-gray-500">
                                If you participated, you can redeem your shares.
                            </p>
                        {:else}
                            <h4 class="text-lg">Place a trade</h4>
                            <p class="text-gray-500">
                                Make a prediction by trading 'yes' or 'no.'
                            </p>
                        {/if}
                    </div>
                    <div class="px-5 pb-5 flex gap-2.5">
                        <MarketActions {market} small {updateMarket} />
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</ColumnLayout>
