<script lang="ts">
    import type {
        pmMarketFulldata,
        pmTokenPosition,
        pmTokenData,
    } from "@am/backend/types/market";
    import { delay } from "$lib/utils";
    import { IconChevronDown } from "@tabler/icons-svelte";
    import { tick } from "svelte";
    import { fade } from "svelte/transition";
    import type { TToken } from "$lib/types";

    // export let market: pmMarketFulldata;
    // export let updateMarket: (market: pmMarketFulldata) => void;
    // export let position: pmTokenPosition;
    // export let token: pmTokenData;
    export let token: TToken;
    export let shares: number;
    export let value: string;
    export let sell: () => void;

    let expanded = false;

    async function toggle() {
        var content = document.getElementById(`pos_${token.id}`);
        if (content) {
            if (expanded) {
                expanded = false;
                content.style.minHeight = content.scrollHeight + "px";
                await delay(50);
                content.style.minHeight = "";
                content.style.maxHeight = "";
            } else {
                expanded = true;
                await tick();
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
    }
</script>

<div class="flex flex-col">
    <div
        class={`flex p-3 w-full justify-between items-center transition-colors`}
    >
        <p class="text-neutral-500 text-sm font-semibold">
            <span
                class={token.outcome === "Yes"
                    ? "text-emerald-600 dark:text-emerald-500"
                    : "text-red-600 dark:text-red-500"}
            >
                {`${token.outcome} shares`}
            </span>
        </p>
    </div>
    <div
        transition:fade={{ duration: 200, delay: 50 }}
        class="flex flex-nowrap justify-between items-end p-3"
    >
        <div class="grid grid-cols-2 w-full gap-3">
            <div class="col-span-1 flex flex-col">
                <h6 class="text-xs font-medium">
                    {"Shares"}
                </h6>
                <p class="text-md">
                    {shares}
                </p>
            </div>
            <div class="col-span-1 flex flex-col">
                <h6 class="text-xs font-medium">
                    {"Value"}
                </h6>
                <p class="text-md">
                    {value}
                </p>
            </div>
        </div>
        <button on:click={sell} class="btn_secondary w-24 xl:w-32">
            Sell
        </button>
    </div>
</div>
