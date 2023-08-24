<script lang="ts">
    import IconBack from "@tabler/icons-svelte/dist/svelte/icons/IconArrowLeft.svelte";
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import UserButton from "./user_button.svelte";
    export let fadeHeader = false;
    // let observer: IntersectionObserver;

    onMount(() => {
        // if (browser && fadeHeader) {
        //     observer = new IntersectionObserver(
        //         (entries) => {
        //             entries.forEach((entry) => {
        //                 if (
        //                     entry.isIntersecting &&
        //                     entry.intersectionRatio >= 0.75
        //                 ) {
        //                     if (entry.target.nextElementSibling) {
        //                         entry.target.nextElementSibling.classList.remove(
        //                             "bg-white/80", "border-b", "border-b-gray-200"
        //                         );
        //                     }
        //                     return;
        //                 }
        //                 if (entry.target.nextElementSibling) {
        //                     entry.target.nextElementSibling.classList.add(
        //                         "bg-white/80", "border-b", "border-b-gray-200"
        //                     );
        //                 }
        //             });
        //         },
        //         { threshold: 1.0 }
        //     );
        //     let target = document.querySelector("#scroll_top_indicator");
        //     if (target) observer.observe(target);
        // }
    });

    // onDestroy(() => {
    //     if(browser && fadeHeader && observer){
    //         let target = document.querySelector("#main_header");
    //         if(target) observer.unobserve(target)
    //     }
    // })

    $: locationSplit = browser ? window.location.pathname.split("/") : [];
</script>

<!-- scroll monitor-->
<div id="scroll_top_indicator" />
<!-- main header -->
<div
    class={`sticky flex whitespace-nowrap justify-between items-center top-0 z-10 h-16 py-3.5 px-4 gap-4 w-full overflow-hidden border-r border-l ${fadeHeader ? "" : "bg-white/80 border-b-gray-200 border-b"} transition-all duration-300`}
>
    {#if locationSplit.length > 1 && locationSplit[1] !== ""}
        <button
            class="rounded-full p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-200 mr-2"
            on:click={() => window.history.back()}
        >
            <IconBack size={20} />
        </button>
    {:else}
        <div class="md:hidden">
            <UserButton />
        </div>
    {/if}
    <slot />
</div>
