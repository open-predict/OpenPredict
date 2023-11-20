<script lang="ts">
    import { browser } from "$app/environment";
    import type { TToken, TTokenPrice } from "$lib/types";
    import { delay } from "$lib/utils";
    import { tick } from "svelte";
    import { fade } from "svelte/transition";

    export let tokens: (TToken & TTokenPrice)[];
    export let selectedToken: TToken | undefined;
    export let selectToken: (t: TToken) => void;
    export let execute: () => void;

    async function onSelect() {
        if (!browser) return;
        var content = document.getElementById("content");
        if (content) {
            if (selectedToken) {
                await tick();
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.minHeight = content.scrollHeight + "px";
                await delay(50);
                content.style.minHeight = "";
                content.style.maxHeight = "";
            }
        }
    }

    $: selectedToken, onSelect();

    const tokenBtnClass = (token: TToken, selected: TToken | undefined) => {
        let btn_class = "h-10 w-full rounded-xl font-semibold mt-auto";
        switch (token.outcome.toLowerCase()) {
            case "yes":
                btn_class = selected
                    ? selected?.id === token.id
                        ? `bg-emerald-500 dark:bg-emerald-600 text-white`
                        : `bg-white text-neutral-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-white dark:opacity-80`
                    : `bg-white text-green-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-green-400`;
                break;
            case "no":
                btn_class = selected
                    ? selected?.id === token.id
                        ? `bg-red-500 text-white`
                        : `bg-white text-neutral-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-white dark:opacity-80`
                    : `bg-white text-red-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-red-400`;
                break;
            default:
                btn_class = selected
                    ? selected?.id === token.id
                        ? `bg-indigo-600 text-white`
                        : "bg-white text-neutral-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-white dark:opacity-80"
                    : "bg-white text-indigo-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 text-indigo-400";
                break;
        }
        return btn_class;
    };

    $: tradeButtonClass = selectedToken
        ? selectedToken.outcome.toLowerCase() === "yes"
            ? `bg-emerald-500 dark:bg-emerald-600 text-white`
            : selectedToken.outcome.toLowerCase() === "no"
            ? `bg-red-500 text-white`
            : `bg-indigo-600 text-white`
        : `bg-indigo-600 text-white`;
</script>

<div class="relative flex flex-col gap-4">
    <div
        class={`flex flex-col rounded-2xl overflow-hidden ring-1 ${
            selectedToken
                ? "dark:ring-neutral-900 ring-neutral-200"
                : "dark:ring-transparent ring-neutral-200"
        }`}
    >
        <div
            class="flex gap-3 col-span-3 p-2 bg-neutral-100 dark:bg-neutral-900/60"
        >
            {#each tokens.sort( (a, b) => b.outcome.localeCompare(a.outcome) ) as token}
                <button
                    on:click={() => selectToken(token)}
                    class={`h-10 w-full flex px-4 justify-start items-center gap-1 lg:gap-2 rounded-xl font-semibold mt-auto ${tokenBtnClass(
                        token,
                        selectedToken
                    )}`}
                >
                    <span class="opacity-75">Buy</span>
                    {token.outcome}
                    <span class="ml-auto">
                        {(token.ask ? (token.ask).toFixed(1) : "-- ") +
                            "¢"}
                    </span>
                </button>
            {/each}
        </div>
        <div class="content" id="content">
            {#if selectedToken}
                <div
                    transition:fade={{ duration: 200, delay: 50 }}
                    class={"flex flex-col gap-4 p-3 pt-4 bg-white dark:bg-neutral-950/80 border-t border-neutral-300 dark:border-neutral-900"}
                >
                    <slot />
                    <div class="hidden 2xl:flex" />
                    <button
                        on:click={() => execute()}
                        class={`h-10 rounded-xl font-semibold cursor-pointer text-white ${tradeButtonClass}`}
                    >
                        <slot name="confirm" />
                        <!-- {`Buy ${shares} '${selectedToken.outcome}' shares`} -->
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
    }
</style>
