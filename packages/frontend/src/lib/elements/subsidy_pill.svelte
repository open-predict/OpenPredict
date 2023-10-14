<script lang="ts">
    import IconSubsidy from "@tabler/icons-svelte/dist/svelte/icons/IconMoneybag.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import Pill from "$lib/elements/pill.svelte";
    import { usdFormatter } from "$lib/utils";
    import { USDC_PER_DOLLAR } from "$lib/web3_utils"
    import type { pmMarketFulldata } from "@am/backend/types/market";

    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;

    function getOpSubsidy(market: marketFulldata) {
        return market.data.data.Subsidy / BigInt(USDC_PER_DOLLAR);
    }

    function getPmSubsidy(market: pmMarketFulldata) {
        return null;
    }

    $: subsidy = opMarket
        ? getOpSubsidy(opMarket)
        : pmMarket
        ? getPmSubsidy(pmMarket)
        : null;
    $: subsidyDisplay = subsidy ? usdFormatter.format(subsidy) : null;
</script>

{#if subsidyDisplay}
    <Pill>
        <IconSubsidy size={14} class="text-yellow-300" />
        <span>
            {`${subsidyDisplay}`}
        </span>
    </Pill>
{/if}
