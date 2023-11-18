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
    import { getChance } from "$lib/utils/op";
    import type { TMarket, TOpMarket } from "$lib/types";
    import MarketViewLayout from "./market_view_layout.svelte";
    import Tabs from "$lib/elements/tabs.svelte";

    export let market: TOpMarket;
    export let updateMarket: (market?: TMarket) => void;

    const id = new PublicKey(market.data.data.AmmAddress).toBase58();
    $: chanceDisplay =
        (getChance(market.data.data.Yes, market.data.data.No) * 100).toFixed(
            0
        ) + "%";
    let tradeModal = false;
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
        <div
            class="min-h-[300px] max-h-[400px] h-[300px] overflow-y-scroll scrollbar_hide"
        >
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
        <!-- <div class="w-full grid grid-cols-2 gap-8">
            {#each Array.from(market.orderdata.entries()) as tokenOrderdata}
                <div class="w-full flex flex-col gap-2">
                    <div class="flex justify-between flex-nowrap items-center">
                        <h4 class="text-md font-semibold text-neutral-200">
                            {`${tokens[tokenOrderdata[0]].outcome} holders`}
                        </h4>
                        <span class="text-neutral-400 text-xs">POSITION</span>
                    </div>
                    <div class="flex flex-col divide-y divide-neutral-900">
                        {#each tokenOrderdata[1].positions.slice(0, 5) as position}
                            <div
                                class="flex justify-between text-neutral-200 items-center py-2"
                            >
                                <div class="max-w-1/2 overflow-hidden">
                                    <UserPill id={position.address} />
                                </div>
                                <p
                                    class={`text-sm ${
                                        tokens[tokenOrderdata[0]].outcome ===
                                        "Yes"
                                            ? "text-green-400"
                                            : tokens[tokenOrderdata[0]]
                                                  .outcome === "No"
                                            ? "text-red-500"
                                            : "text-indigo-400"
                                    }`}
                                >
                                    {usd.format(
                                        Number(position.position) /
                                            (USDC_PER_DOLLAR * 10000)
                                    )}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div> -->
    </div>
    <div class="contents" slot="comments">
        {"No comments"}
    </div>
</MarketViewLayout>
