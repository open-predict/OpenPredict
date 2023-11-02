<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import Pill from "$lib/elements/pill.svelte";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { IconExchange } from "@tabler/icons-svelte";
    import { USDC_PER_DOLLAR } from "$lib/utils/op";
    import { usd } from "$lib/utils/format";

    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;

    function getOpVolume(m: marketFulldata) {
        let volume: bigint = 0n;
        m.data.Trades.forEach((trade) => {
            volume = volume + trade.microUSDC;
        });
        return volume / BigInt(USDC_PER_DOLLAR);
    }

    function getPmVolume(m: pmMarketFulldata) {
        return m.meta.volume
    }

    $: volume = opMarket
        ? getOpVolume(opMarket)
        : pmMarket
        ? getPmVolume(pmMarket)
        : null;

    $: volumeDisplay = volume ? usd.format(Number(volume)) : null;
</script>

{#if volume}
    <Pill>
        <IconExchange size={14} class="text-emerald-400" />
        <span>
            {`${volumeDisplay}`}
        </span>
    </Pill>
{/if}
