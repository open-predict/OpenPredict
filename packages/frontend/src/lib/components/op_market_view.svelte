<script lang="ts">
    import {
        IconArrowsExchange2,
        IconVocabulary,
        IconChartLine,
    } from "@tabler/icons-svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import { PublicKey } from "@solana/web3.js";
    import UserPill from "./user_pill.svelte";
    import TradersPill from "$lib/elements/traders_pill.svelte";
    import OpChart from "$lib/components/charts/op_chart.svelte";
    import OpTrade from "./op_trade.svelte";
    import { USDC_PER_DOLLAR, getChance } from "$lib/utils/op";
    import type { TMarket, TOpMarket, TUsers } from "$lib/types";
    import MarketViewLayout from "./market_view_layout.svelte";
    import Tabs from "$lib/elements/tabs.svelte";
    import { usd } from "$lib/utils/format";

    export let market: TOpMarket;
    export let updateMarket: (market?: TMarket) => void;
    export let users: TUsers | undefined;

    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    let selectedView = "Chart";

</script>

<MarketViewLayout>
    <h2 slot="title" class="contents">
        {market.metadata?.title}
    </h2>
    <div class="contents" slot="pills">
        <UserPill {id} />
        <VolumePill market={{ opMarket: market }} />
        <SubsidyPill market={{ opMarket: market }} />
        <TradersPill market={{ opMarket: market }} />
    </div>
    <div class="contents" slot="interactive">
        <div class="h-full max-h-full overflow-y-scroll scrollbar_hide">
            {#if selectedView === "Chart"}
                <OpChart {market} />
            {:else if selectedView === "Orderbook"}
                <div class="flex justify-center items-center py-28">
                    <p>
                        {"An orderbook is not yet available for this market."}
                    </p>
                </div>
            {:else}
                <div class="flex justify-center items-center py-28">
                    <p>
                        {"Trade history is not yet available for this market."}
                    </p>
                </div>
            {/if}
        </div>
        <div
            class="w-full h-10 border-t border-neutral-200 dark:border-neutral-900"
        >
            <Tabs
                selected={selectedView}
                select={(v) => (selectedView = v)}
                options={[
                    { Icon: IconChartLine, label: "Chart" },
                    { label: "Orderbook", Icon: IconVocabulary },
                    { label: "Trades", Icon: IconArrowsExchange2 },
                ]}
            />
        </div>
    </div>
    <OpTrade
        slot="trade"
        market={{ data: market.data, metadata: market.metadata }}
        updateMarket={() => {}}
    />
    <p class="contents" slot="about">
        {market.metadata?.description.replaceAll("\n", "\n\n")}
    </p>
    <p slot="resolution" class="contents">
        {"This market has not yet been resolved."}
    </p>
    <div class="contents" slot="holders">
        <div class="w-full grid grid-cols-2 gap-8">
            {#each ["Yes", "No"] as token}
                <div class="w-full flex flex-col gap-2">
                    <div class="flex justify-between flex-nowrap items-center">
                        <h4 class="text-md font-semibold">
                            {`${token}`}
                        </h4>
                        <p class="text-xs opacity-75 font-semibold">POSITION</p>
                    </div>
                    <div
                        class="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900"
                    >
                        {#each Array.from(market.data.UserAccounts) as [addr, position]}
                            {#if position.Shares < 0n && token === "No"}
                            <div
                                class="flex justify-between text-neutral-200 items-center py-2"
                            >
                                <div class="max-w-1/2 w-1/2 overflow-hidden">
                                    <UserPill
                                        id={addr}
                                        user={users ? users.get(addr) :  undefined}
                                    />
                                </div>
                                <p class={`text-sm font-semibold`}>
                                    <span
                                        class={`text-red-600 dark:text-red-500`}
                                    >
                                        {usd.format(Number(position.Shares)/USDC_PER_DOLLAR)}
                                    </span>
                                </p>
                            </div>
                            {:else if position.Shares > 0n && token === "Yes"}
                            <div
                                class="flex justify-between text-neutral-200 items-center py-2"
                            >
                                <div class="max-w-1/2 w-1/2 overflow-hidden">
                                    <UserPill
                                        id={addr}
                                        user={users ? users.get(addr) :  undefined}
                                    />
                                </div>
                                <p class={`text-sm font-semibold`}>
                                    <span
                                        class={`text-emerald-600 dark:text-emerald-400`}
                                    >
                                        {Math.round(Number(position.Shares * 10n)/USDC_PER_DOLLAR)/10}
                                    </span>
                                </p>
                            </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="contents" slot="comments">
        {"No comments"}
    </div>
</MarketViewLayout>
