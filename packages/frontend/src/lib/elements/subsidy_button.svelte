<script lang="ts">
    import { createPopperActions } from "svelte-popperjs";
    const [popperRef, popperContent] = createPopperActions();
    import { USDC_PER_DOLLAR } from "$lib/utils";
    import IconCurrency from "@tabler/icons-svelte/dist/svelte/icons/IconCurrency.svelte";
    export let subsidy: bigint;
    let showTooltip = false;
</script>

{#if showTooltip}
    <div
        use:popperContent={{
            placement: "bottom-end",
            strategy:  "fixed",
            modifiers: [{ name: "offset", options: { offset: [-8, 0] } }],
        }}
        class="relative flex items-center justify-center"
    >
        <div class="absolute z-11 top-0 bg-black w-2 h-2 -mt-1 rotate-45" />
        <div
            class="relative py-1 px-2.5 z-10 bg-black text-xs rounded-full text-white shadow-xl"
        >
            Subsidy
        </div>
    </div>
{/if}

<button
    use:popperRef
    on:click={() => {showTooltip= !showTooltip}}
    on:mouseenter={() => (showTooltip = true)}
    on:mouseleave={() => (showTooltip = false)}
    class={`flex py-2.5 px-4 justify-center items-center rounded-full gap-2 text-md text-gray-600 fill-gray-100 stroke-gray-500`}
>
    <IconCurrency class="stroke-inherit fill-inherit" size={20} />
    {Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 0,
    }).format(Number(subsidy) / USDC_PER_DOLLAR)}
</button>
