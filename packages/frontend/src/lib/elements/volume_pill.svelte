<script lang="ts">
    import IconExchange from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsExchange2.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    import Pill from "$lib/elements/pill.svelte";
    import { USDC_PER_DOLLAR, usdFormatter } from "$lib/utils";
    import type { pmMarketFulldata } from "$lib/types";

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

    $: volumeDisplay = volume ? usdFormatter.format(Number(volume)) : null;
</script>

{#if volume}
    <Pill>
        <IconExchange size={14} class="text-emerald-400" />
        <span>
            {`${volumeDisplay}`}
        </span>
    </Pill>
{/if}
