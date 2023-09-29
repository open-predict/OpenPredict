<script lang="ts">
    import IconBack from "@tabler/icons-svelte/dist/svelte/icons/IconArrowLeft.svelte";
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconMenu2.svelte";
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import Logo from "./logo.svelte";
    export let fadeHeader = false;
    let observer: IntersectionObserver;

    onMount(() => {
        if (browser && fadeHeader) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio >= 0.75
                        ) {
                            if (entry.target.nextElementSibling) {
                                entry.target.nextElementSibling.classList.remove(
                                    "bg-white/80",
                                    "border-b",
                                    "border-b-gray-200"
                                );
                            }
                            return;
                        }
                        if (entry.target.nextElementSibling) {
                            entry.target.nextElementSibling.classList.add(
                                "bg-white/80",
                                "border-b",
                                "border-b-gray-200"
                            );
                        }
                    });
                },
                { threshold: 1.0 }
            );
            let target = document.querySelector("#scroll_top_indicator");
            if (target) observer.observe(target);
        }
    });

    onDestroy(() => {
        if (browser && fadeHeader && observer) {
            let target = document.querySelector("#main_header");
            if (target) observer.unobserve(target);
        }
    });

    $: locationSplit = browser ? window.location.pathname.split("/") : [];
</script>

<div id="scroll_top_indicator" />
<div
    class={`sticky flex whitespace-nowrap justify-between items-center top-0 z-10 h-16 py-3.5 px-4 gap-4 w-full overflow-hidden border-r border-l border-gray-200 dark:bg-black/80 dark:border-neutral-800 ${
        fadeHeader ? "" : "border-b bg-white/80 dark:bg-black/80"
    } transition-all duration-300`}
>
    <div class="w-1/5 flex md:hidden">
        {#if locationSplit.length > 1 && locationSplit[1] !== ""}
            <button
                class="rounded-full p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-200 mr-2"
                on:click={() => window.history.back()}
            >
                <IconBack size={20} />
            </button>
        {:else}
            <div class="md:hidden">
                <Logo />
            </div>
        {/if}
    </div>
    <slot />
    <div class="w-1/5 flex justify-end items-center md:hidden">
        <button class="action_icon">
            <IconMenu size={16} />
        </button>
    </div>
</div>
