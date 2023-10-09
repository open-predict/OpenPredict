<script lang="ts">
    import type { marketFulldata, pmTokenData } from "@am/backend/types/market";
    import { getScrollParent, timeAgo, usdFormatter } from "$lib/utils";
    import { afterUpdate, onMount, tick } from "svelte";
    import type {
        pmFilledOrders,
        pmMarketFulldata,
        pmTokenOrderdata,
    } from "$lib/types";
    import { USDC_PER_DOLLAR } from "$lib/web3_utils";
    import Pill from "$lib/elements/pill.svelte";
    import { faker } from "@faker-js/faker";
    export let market: pmMarketFulldata;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;

    $: tokens = market.data.tokens.reduce(
        (acc: Record<string, pmTokenData>, val) => {
            acc[val.token_id] = val;
            return acc;
        },
        {}
    );
    $: allOrders = market.tokenOrderdata
        ? Array.from(market.tokenOrderdata.entries()).reduce(
              (acc: (pmFilledOrders & { outcome: string })[], val) => {
                  for (const order of val[1].filledOrders) {
                      acc.push({
                          outcome: tokens[val[0]].outcome.toLowerCase(),
                          ...order,
                      });
                  }
                  return acc;
              },
              []
          )
        : [];
</script>

<div
    class="sticky top-0 h-8 z-10 bg-neutral-950 border-b border-neutral-900 flex flex-col text-neutral-400 text-sm"
>
    <div class="flex h-10 relative">
        <div class="px-2 w-3/12 py-2 flex items-center uppercase text-xs">
            {"User"}
        </div>
        <div class="px-2 w-7/12 py-2 flex items-center uppercase text-xs">
            {"Trade"}
        </div>
        <div class="px-2 w-2/12 py-2 flex items-center uppercase text-xs">
            {"Time"}
        </div>
    </div>
</div>
<div
    class="flex flex-col divide-y divide-neutral-900 text-sm text-neutral-400 h-full"
>
    {#each allOrders.sort((a, b) => b.ts - a.ts) as trade}
        <div class="flex w-full h-10 relative">
            <div
                class="relative w-3/12 py-2 pl-1.5 flex justify-start items-center overflow-hidden"
            >
                <div
                    class="absolute h-full w-10 bg-gradient-to-r from-transparent to-neutral-950 right-0"
                />
                <div
                    class="w-full flex justify-start items-center overflow-hidden"
                >
                    <Pill>
                        <div
                            class="w-4 h-4 rounded-full ring-1 ring-inset ring-neutral-400 overflow-hidden p-0.5"
                        >
                            <img
                                class=""
                                src={faker.image.avatar()}
                                alt="user avatar"
                            />
                        </div>
                        <span>
                            {faker.internet.userName()}
                        </span>
                    </Pill>
                </div>
            </div>
            <div
                class={`w-7/12 py-2 pl-2 flex gap-2 items-center text-xs`}
            >
                {trade.side === "buy" ? "bought" : "sold"}
                {usdFormatter.format((trade.price / 100) * Number(trade.size)) + " of "}
                <span
                    class={`${
                        trade.outcome === "yes"
                            ? "text-green-400"
                            : trade.outcome === "no"
                            ? "text-red-400"
                            : "text-indigo-400"
                    }`}
                >
                    {trade.outcome.toUpperCase()}
                </span>
                {" at " + trade.price + ""}
            </div>
            <p class="w-2/12 py-2 text-xs px-2 overflow-ellipsis whitespace-nowrap overflow-hidden">
                {timeAgo(new Date(trade.ts))?.replace("minutes", "min")}
            </p>
        </div>
    {/each}
</div>
