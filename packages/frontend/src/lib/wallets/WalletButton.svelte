<script lang="ts">
    import { createPopperActions } from "svelte-popperjs";
    const [popperRef, popperContent] = createPopperActions();
    export let disabled: boolean = false;
    export let status: string = "";
    let showTooltip = false;
</script>

<button
    class="flex gap-1.5 items-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 p-1 pr-3 hover:bg-white hover:ring-zinc-300 hover:shadow-sm"
    {disabled}
    on:click
    on:mouseenter={!!status ? () => showTooltip = true : undefined}
    on:mouseleave={!!status ? () => showTooltip = false : undefined}
>
    {#if $$slots["start-icon"]}
        <i
            class="h-6 w-6 flex justify-center items-center overflow-hidden rounded-full"
        >
            <slot name="start-icon" />
        </i>
    {/if}
    <div class="flex items-center gap-2">
        <span class="text-xs">
            <slot />
        </span>
        {#if !!status}
            <div class="rounded-full p-1 text-green-400 bg-green-400/20">
                <div>
                    <div
                        use:popperRef
                        class="h-2 w-2 rounded-full bg-current"
                    />
                </div>
            </div>
            <!-- {#if showTooltip}
                <div
                    use:popperContent={{
                        placement: "right",
                        modifiers: [
                            { name: "offset", options: { offset: [0, 4] } },
                        ],
                    }}
                    class="absolute flex items-center"
                >
                    <div class="bg-black w-2 h-2 -mr-1.5 rotate-45" />
                    <div
                        class="py-1 px-2 bg-black text-xs rounded-full text-white shadow-xl"
                    >
                        Detected
                    </div>
                </div>
            {/if} -->
        {/if}
    </div>
</button>
