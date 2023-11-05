<script lang="ts">
    import { IconMinus, IconPlus } from "@tabler/icons-svelte";
    import Slider from "$lib/elements/slider.svelte";
    import { usd } from "$lib/utils/format";

    export let step = 1;
    export let max: number;
    export let min: number;
    export let value: number;
    export let outcome: string = "";
    export let setSliderStep: boolean = false;
    export let onChange: (
        e: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => void;
    export let formatted: string;

    const stepDown = () => {
        value = Math.max(value - step, min);
    };

    const stepUp = () => {
        value = Math.min(value + step, max);
    };

    $: extraClass = outcome === "yes" ? "yes" : outcome === "no" ? "no" : "";

</script>

<div
    class="block overflow-hidden text-sm w-full rounded-xl ring-neutral-900/80 bg-white dark:bg-neutral-900/50"
>
    <div
        class="w-full h-12 flex justify-between items-center p-2 gap-2 bg-neutral-900/80 rounded-xl ring-neutral-900 ring-inset"
    >
        <button
            on:click={stepDown}
            class="action_icon opacity-60 hover:opacity-100"
        >
            <IconMinus size={16} />
        </button>
        <input
            type="string"
            value={formatted}
            on:change={onChange}
            class="text-lg max-w-[10rem] text-center text-neutral-300 outline-none bg-transparent"
        />
        <button
            class="action_icon opacity-60 hover:opacity-100"
            on:click={stepUp}
        >
            <IconPlus size={20} />
        </button>
    </div>
    <div
        class="h-9 flex justify-center items-stretch rounded-full p-2 w-full gap-4"
    >
        <div class="flex justify-center items-center w-full px-1 py-1">
            <Slider
                {extraClass}
                bind:value
                {max}
                {min}
                step={setSliderStep ? step : undefined}
            />
        </div>
    </div>
</div>
