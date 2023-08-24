<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import IconHeart from "@tabler/icons-svelte/dist/svelte/icons/IconHeart.svelte";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUserCheck.svelte";
    import IconCurrency from "@tabler/icons-svelte/dist/svelte/icons/IconCurrency.svelte";
    import IconComment from "@tabler/icons-svelte/dist/svelte/icons/IconMessageCircle2.svelte";
    import { USDC_PER_DOLLAR, getChance, usdFormatter } from "$lib/utils";
    // import SmallChart from "../charts/small_chart.svelte";
    export let market: marketFulldata;
    $: chance = 100 * getChance(market.data.data.Yes, market.data.data.No);
</script>

{#if !!market}
    <div class="flex flex-col p-8 gap-2 pb-4">
        <div>
            <p class="text-gray-800 text-md">
                {market.metadata?.title ?? "No title found"}
            </p>
        </div>
        <div class="w-full flex flex-nowrap justify-between items-center">
            <p class="font-semibold text-gray-900">
                {chance.toFixed(1)}%
            </p>
            {#if market}
                <div class="w-1/4 h-8">
                    <!-- <SmallChart priceData={market.data.PriceHistory} /> -->
                </div>
            {/if}
            <div class="flex flex-col justify-center items-end">
                <button
                    class="flex text-sm py-1 px-3 justify-center items-center rounded-full gap-2 text-gray-500 fill-gray-200 stroke-gray-500 text-md hover:bg-gray-100 hover:text-gray-600 hover:stroke-gray-600 hover:fill-gray-300"
                >
                    <IconCurrency
                        class="stroke-inherit fill-inherit"
                        size={14}
                    />
                    {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        maximumFractionDigits: 0,
                    }).format(Number(market.data.data.Subsidy) / USDC_PER_DOLLAR)}
                </button>
                <button
                    class="flex text-sm py-1 px-3 justify-center items-center rounded-full gap-2 text-gray-500 fill-gray-200 stroke-gray-500 text-md hover:bg-gray-100 hover:text-gray-600 hover:stroke-gray-600 hover:fill-gray-300"
                >
                    <IconUser class="stroke-inherit fill-inherit" size={14} />
                    {market.data.UserAccounts.size}
                </button>
            </div>
        </div>
    </div>
{/if}
