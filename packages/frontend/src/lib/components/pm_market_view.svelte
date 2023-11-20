<script lang="ts">
    import {
        IconArrowsExchange2,
        IconVocabulary,
        IconChartLine,
        IconDroplet as IconLiquidity,
        IconCalendar as IconCal,
    } from "@tabler/icons-svelte";
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type {
        pmTokenData,
        pmUserMap,
    } from "@am/backend/types/market";
    import PmChart from "$lib/components/charts/pm_chart.svelte";
    import Orderbook from "./pm_orderbook.svelte";
    import linkifyStr from "linkify-string";
    import UserPill from "./user_pill.svelte";
    import PmTrade from "./pm_trade.svelte";
    import TradersPill from "$lib/elements/traders_pill.svelte";
    import { usd } from "$lib/utils/format";
    import type { TMarket, TPmMarket, TUserMinimal, TUsers } from "$lib/types";
    import MarketViewLayout from "./market_view_layout.svelte";
    import DOMPurify from "dompurify";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { fromOpUser, fromPmUser } from "$lib/utils";
    import Tabs from "$lib/elements/tabs.svelte";

    export let market: TPmMarket;
    export let pmUsers: pmUserMap | undefined;
    export let opUsers: TUsers | undefined;
    export let selectToken: (id: string) => void;
    export let selectedToken: string;
    export let updateMarket: (market?: TMarket) => void;

    $: tokens = market.data.tokens.reduce(
        (acc: Record<string, pmTokenData>, val) => {
            acc[val.token_id] = val;
            return acc;
        },
        {}
    );

    $: combinedUsers = new Map<string, TUserMinimal>([
        ...Array.from(pmUsers?.entries() ?? []).reduce((arr, val) => {
            arr.set(val[0], fromPmUser(val[0], val[1]));
            return arr;
        }, new Map()),
        ...Array.from(opUsers?.entries() ?? []).reduce((arr, val) => {
            arr.set(val[0], fromOpUser(val[0], val[1] ?? undefined));
            return arr;
        }, new Map()),
    ]);

    onMount(() => {
        if (browser) {
            Array.from(document.getElementById("about")?.children ?? []).map(
                (n) => {
                    if (n.tagName === "A") {
                        n.setAttribute("rel", "noreferrer noopener");
                        n.setAttribute("target", "_blank");
                        n.classList.add("link");
                    }
                }
            );
        }
    });
    let selectedView = "Chart";
</script>

<MarketViewLayout>
    <h2 slot="title" class="contents">
        {market.data.question}
    </h2>
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
            <IconLiquidity size={14} class="text-indigo-500" />
            {`$298`}
        </Pill>
        <TradersPill market={{ pmMarket: market }} />
        <Pill>
            <IconCal size={14} class="text-red-500" />
            {`${new Date(market.data.end_date_iso).toLocaleDateString("en-us", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            })}`}
        </Pill>
    </div>
    <div class="contents" slot="interactive">
        <div class="max-h-[400px] overflow-y-scroll scrollbar_hide">
            {#if selectedView === "Chart"}
                <PmChart {market} />
                <div />
            {:else if selectedView === "Orderbook"}
                <Orderbook {market} />
            {:else}
                <!-- <FilledOrders {market} {updateMarket} /> -->
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
    <PmTrade
        slot="trade"
        market={{
            data: market.data,
            orderdata: market.orderdata,
            meta: market.meta,
        }}
        updateMarket={() => {}}
        selectedTokenId={selectedToken}
        updateSelectedToken={(v) => selectToken(v)}
    />
    <p slot="about" class="contents" id="about">
        {#if browser}
            {@html DOMPurify.sanitize(linkifyStr(market.data.description))}
        {:else}
            {market.data.description}
        {/if}
    </p>
    <p class="contents" slot="resolution">
        {"This market has not yet been resolved."}
    </p>
    <div class="contents" slot="holders">
        <div class="w-full grid grid-cols-2 gap-8">
            {#each Array.from(market.orderdata.entries()) as tokenOrderdata}
                <div class="w-full flex flex-col gap-2">
                    <div class="flex justify-between flex-nowrap items-center">
                        <h4 class="text-md font-semibold">
                            {`${tokens[tokenOrderdata[0]].outcome}`}
                        </h4>
                        <p class="text-xs opacity-75 font-semibold">POSITION</p>
                    </div>
                    <div
                        class="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900"
                    >
                        {#each tokenOrderdata[1].positions.slice(0, 5) as position}
                            <div
                                class="flex justify-between text-neutral-200 items-center py-2"
                            >
                                <div class="max-w-1/2 w-1/2 overflow-hidden">
                                    <UserPill
                                        id={position.address}
                                        userMinimal={combinedUsers.get(
                                            position.address
                                        )}
                                    />
                                </div>
                                <p class={`text-sm font-semibold`}>
                                    <span
                                        class={`${
                                            tokens[tokenOrderdata[0]]
                                                .outcome === "Yes"
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : tokens[tokenOrderdata[0]]
                                                      .outcome === "No"
                                                ? "text-red-600 dark:text-red-500"
                                                : "text-indigo-400 dark:text-indigo-400"
                                        }`}
                                    >
                                        {usd.format(Number(position.position))}
                                    </span>
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <p class="contents" slot="comments">
        {"No comments"}
    </p>
</MarketViewLayout>
