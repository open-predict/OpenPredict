<script lang="ts">
    import { IconUser } from "@tabler/icons-svelte";
    import Pill from "./pill.svelte";
    import type {
        marketFulldata,
        pmMarketFulldata,
    } from "@am/backend/types/market";
    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;

    $: traders = opMarket
        ? opMarket.data.UserAccounts.size
        : pmMarket
        ? Array.from(pmMarket?.orderdata.entries()).reduce((acc, val) => {
              return acc + val[1].positions.length;
          }, 0)
        : 0;
</script>

<Pill>
    <IconUser size={14} class="text-sky-500" />
    {traders}
</Pill>
