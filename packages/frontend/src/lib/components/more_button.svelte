<script lang="ts">
    import { delay } from "$lib/utils";
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconDotsVertical.svelte";
    import { nanoid } from "nanoid";
    import { onMount, tick } from "svelte";
    import { createPopperActions } from "svelte-popperjs";
    export let forceClick = true; 

    const [popperRef, popperContent] = createPopperActions();
    const popperId = nanoid();

    let showPopup = false;
    let inPopup = false;

    async function onLeaveTrigger() {
        await delay(50);
        if (!inPopup) {
            showPopup = false;
        }
    }

    function show() {
        showPopup = true;
    }

    function hide() {
        showPopup = false
    }

</script>

{#if showPopup}
    <div
    use:popperContent={{
        placement: "bottom-end",
            strategy: "fixed",
            modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
        }}
        class="relative flex items-center justify-center z-10"
        >
        <div
            id={popperId}
            on:mouseenter={() => inPopup = true}
            on:mouseleave={() => {inPopup = false; hide()}}
            class="relative flex flex-col py-1 z-10 bg-neutral-900 text-xs rounded-lg text-white shadow-2xl ring-1 ring-neutral-800"
        >
            <slot />
        </div>
    </div>
{/if}

<button
    use:popperRef
    on:mouseenter={() => show()}
    on:mouseleave={() => onLeaveTrigger()}
    on:click={(e) => {e.preventDefault(); e.stopPropagation(); ;show()}}
    class="action_icon h-6 w-6"
>
    <IconMenu size={14} />
</button>
