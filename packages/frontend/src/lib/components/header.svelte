<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import Logo from "$lib/elements/logo.svelte";
    import BackButton from "$lib/elements/back_button.svelte";
    import MobileMenuButton from "$lib/elements/mobile_menu_button.svelte";
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
</script>

<div id="scroll_top_indicator" />
<div
    class={`sticky flex whitespace-nowrap justify-between items-center top-0 z-10 h-16 px-3 py-3.5 w-full backdrop-blur-xl overflow-hidden border-r border-l border-gray-200 dark:border-neutral-900 ${
        fadeHeader ? "" : "border-b bg-white/70 dark:bg-black/70"
    } transition-all duration-300`}
>
    <div class="w-1/5 flex items-center md:w-auto">
        <BackButton>
            <Logo slot="fallback" />
        </BackButton>
    </div>
    <slot name="center" />
    <div class={`w-1/5 flex justify-end items-center md:w-auto`}>
        <slot name="right" />
    </div>
</div>
