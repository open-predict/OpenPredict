<script lang="ts">
    import IconDown from "@tabler/icons-svelte/dist/svelte/icons/IconTriangleFilled.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { getChance } from "$lib/web3_utils";
    import { faker } from "@faker-js/faker";
    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;
    export let size: 0 | 1 = 0;

    function getOpChange(market: marketFulldata): null | number {
        const historyLength = market.data.PriceHistory.length;
        if (historyLength < 2) {
            return null;
        }
        return (
            getChance(market.data.data.Yes, market.data.data.No) -
            getChance(
                market.data.PriceHistory[historyLength - 2].Yes,
                market.data.PriceHistory[historyLength - 2].No
            )
        );
    }

    function getPmChange(market: pmMarketFulldata): null | number {
        // const yesToken = market.data.tokens.find(t => t.outcome === "Yes");
        // const noToken = market.data.tokens.find(t => t.outcome === "No");
        return faker.datatype.number({min: -5, max: 5})/100
    }

    $: change = pmMarket
        ? getPmChange(pmMarket)
        : opMarket
        ? getOpChange(opMarket)
        : null;
    $: changeDisplay = change
        ? (Math.abs(change) * 100).toFixed(1) + "%"
        : "--.- %";
</script>

<div
    class={`flex items-center ${size > 0 ? "gap-1.5" : "gap-1"} ${
        change
            ? change < 0
                ? "text-red-500"
                : "text-emerald-500"
            : "text-neutral-400"
    }`}
>
    {#if change}
        <IconDown
            size={size > 0 ? 10 : 6}
            class={change < 0 ? "rotate-180 text-red-600" : "text-emerald-500"}
        />
    {/if}
    <span class={size > 0 ? "text-sm" : "text-xs"}>
        {changeDisplay}
    </span>
</div>
