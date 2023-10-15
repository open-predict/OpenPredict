<script lang="ts">
    import type { pmMarketFulldata, pmTokenPosition, pmTokenData } from "@am/backend/types/market";
    import { delay } from "$lib/utils";
    import { IconChevronDown } from "@tabler/icons-svelte";
    import { tick } from "svelte";
    import { fade } from "svelte/transition";

    export let market: pmMarketFulldata;
    export let updateMarket: (market: pmMarketFulldata) => void;
    export let position: pmTokenPosition;
    export let token: pmTokenData;

    let expanded = false;

    async function toggle() {
        var content = document.getElementById(`pos_${token.token_id}`);
        if (content) {
            if (expanded) {
                console.log("Content", content, expanded);
                expanded = false;
                content.style.minHeight = content.scrollHeight + "px";
                await delay(50);
                content.style.minHeight = "";
                content.style.maxHeight = "";
            } else {
                console.log("Content", content, expanded);
                expanded = true;
                await tick();
                console.log(content.scrollHeight);
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
    }
</script>

<div
    class="flex flex-col text-neutral-400 rounded-xl ring-neutral-900 overflow-hidden"
>
    <div
        class={`flex pl-3 pr-1 py-1 w-full justify-between items-center transition-colors ${expanded ? "bg-neutral-900": "bg-neutral-950"}`}
    >
        <p class="text-neutral-500 text-sm font-semibold">
            <span class="text-emerald-400">
                {` ${290} ${token.outcome}`}
            </span>
        </p>
        <button
            on:click={toggle}
            class="ring-transparent h-7 w-7 hover:bg-neutral-800 rounded-lg flex justify-center items-center hover:text-white"
        >
            <IconChevronDown size={18} class={`transition-all ${expanded ? "" : "-rotate-90"}`} />
        </button>
    </div>
    <div class="content" id={`pos_${token.token_id}`}>
        {#if expanded}
            <div
                transition:fade={{ duration: 200, delay: 50 }}
                class="flex flex-nowrap justify-between items-end p-3 bg-neutral-950"
            >
                <div class="grid grid-cols-2 w-full gap-3">
                    <div class="col-span-1 flex flex-col">
                        <span class="text-xs font-medium">
                            {"Value"}
                        </span>
                        <span class="text-md text-neutral-300">
                            {"$893.32"}
                        </span>
                    </div>
                    <div class="col-span-1 flex flex-col">
                        <span class="text-xs font-medium">
                            {"Profit"}
                        </span>
                        <span class="text-md text-neutral-300">
                            {"$603.32"}
                        </span>
                    </div>
                    <div class="col-span-1 flex flex-col">
                        <span class="text-xs font-medium">
                            {"Spent"}
                        </span>
                        <span class="text-md text-neutral-300">
                            {"$200.00"}
                        </span>
                    </div>
                    <div class="col-span-1 flex flex-col">
                        <span class="text-xs font-medium">
                            {"Payout"}
                        </span>
                        <span class="text-md text-neutral-300">
                            {"$1.9K"}
                        </span>
                    </div>
                </div>
                <div>
                    <button class="btn_secondary w-24 xl:w-32">Sell</button>
                </div>
            </div>
        {/if}
    </div>
</div>
