<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import Pill from "$lib/elements/pill.svelte";
    import { usd } from "$lib/utils/format";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { IconMoneybag } from "@tabler/icons-svelte";
    import { USDC_PER_DOLLAR } from "$lib/utils/op";
    import type { TMarket } from "$lib/types";

    export let market: TMarket | undefined;
    $: ({opMarket, pmMarket} = market ?? {})

    function getOpSubsidy(market: marketFulldata) {
        return Number((market.data.data.Subsidy * 100n) / BigInt(USDC_PER_DOLLAR))/100
    }

    function getPmSubsidy(market: pmMarketFulldata) {
        return null;
    }

    $: subsidy = opMarket
        ? getOpSubsidy(opMarket)
        : pmMarket
        ? getPmSubsidy(pmMarket)
        : null;
        
    $: subsidyDisplay = subsidy ? usd.format(subsidy) : null;
</script>

{#if subsidyDisplay}
    <Pill>
        <IconMoneybag size={14} class="text-yellow-300" />
        <span>
            {`${subsidyDisplay}`}
        </span>
    </Pill>
{/if}
