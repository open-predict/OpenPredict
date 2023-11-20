<script lang="ts">
    import { delay } from "$lib/utils/mics";
    import { IconDotsVertical } from "@tabler/icons-svelte";
    import { nanoid } from "nanoid";
    import { createPopperActions } from "svelte-popperjs";

    const [popperRef, popperContent, getInstance] = createPopperActions();

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
    }

    function hide() {
        showPopup = false;
    }
</script>

{#if showPopup}
    <div
        id="tooltip"
        role="tooltip"
        use:popperContent={{
            placement: "bottom-end",
            strategy: "fixed",
            modifiers: [{ name: "offset", options: { offset } }],
        }}
    >
        <div
            class="relative flex flex-col py-1.5 bg-neutral-900 text-xs rounded-lg text-white shadow-2xl ring-1 ring-neutral-800"
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
        <div class="action_icon relative z-20">
            <IconDotsVertical size={16} />
        </div>
    </slot>
</button>
