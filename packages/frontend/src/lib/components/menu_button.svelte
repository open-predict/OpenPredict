<script lang="ts">
    import { delay } from "$lib/utils";
    import { IconDotsVertical } from "@tabler/icons-svelte";
    import { nanoid } from "nanoid";
    import { tick } from "svelte";
    import { createPopperActions } from "svelte-popperjs";
    export let strategy: "absolute" | "fixed" = "absolute";

    const [popperRef, popperContent, popperInstance] = createPopperActions();

    const popperId = nanoid();
    let offset = [0, 4]; // w, h

    let showPopup = false;
    let inPopup = false;

    async function onLeaveTrigger() {
        await delay(50);
        if (!inPopup) {
            showPopup = false;
        }
    }

    async function show() {
        showPopup = true;
        if (strategy === "absolute") {
            offset[0] = 500;
        }
    }

    function hide() {
        showPopup = false;
    }
</script>

{#if showPopup}
    <div
        class="h-auto w-auto z-10"
        id="tooltip"
        role="tooltip"
        use:popperContent={{
            placement: "bottom-end",
            strategy: "fixed",
            modifiers: [{ name: "offset", options: { offset } }],
        }}
    >
        <div
            class="flex flex-col py-1.5 bg-neutral-900 text-xs rounded-lg text-white shadow-2xl ring-1 ring-neutral-800"
            on:mouseenter={() => (inPopup = true)}
            on:mouseleave={() => {
                inPopup = false;
                hide();
            }}
        >
            <slot />
        </div>
    </div>
{/if}

<button
    use:popperRef
    id={`${popperId}`}
    on:mouseenter={() => show()}
    on:mouseleave={() => onLeaveTrigger()}
    on:click={(e) => {
        show();
    }}
>
    <slot name="target">
        <div class="action_icon h-6 w-6">
            <IconDotsVertical size={14} />
        </div>
    </slot>
</button>
