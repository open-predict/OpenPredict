<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import Pill from "$lib/elements/pill.svelte";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { IconExchange } from "@tabler/icons-svelte";
    import { USDC_PER_DOLLAR } from "$lib/utils/op";
    import { usd } from "$lib/utils/format";
    import type { TMarket } from "$lib/types";

    export let market: TMarket | undefined;

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

    $: volume = market?.opMarket
        ? getOpVolume(market.opMarket)
        : market?.pmMarket
        ? getPmVolume(market.pmMarket)
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
