<script lang="ts">
    import { nanoid } from "nanoid";
    import { onMount } from "svelte";
    import "$lib/styles/range.css";

    export let extraClass: string;
    export let max = 100;
    export let min = 0;
    export let value = 0;
    export let step: number | undefined = undefined;

    $: _value = value;

    let id: string;
    let slider: HTMLElement;

    $: property = `--range-${id}-bg-size`;

    $: setSlider(slider, property, _value);

    function setSlider(s: HTMLElement | null, p: string, v: number) {
        if (s && p && v)
            s.style.setProperty(p, `${((v - 0) / (max - 0)) * 100}%`);
    }

    onMount(() => {
        id = nanoid();
        property = `--range-${id}-bg-size`;
        slider.setAttribute("id", id);
        if (slider) {
            let style = document.createElement("style");
            style.textContent = `#${id}.no::-webkit-slider-runnable-track {
    background: linear-gradient(
            to right,
            theme("colors.red.600"),
            theme("colors.red.700")
        ),
        theme("colors.neutral.700");
    background-size: var(${property}, 0%) 100%;
    background-repeat: no-repeat;
}

#${id}.yes::-webkit-slider-runnable-track {
    background: linear-gradient(
            to right,
            theme("colors.emerald.600"),
            theme("colors.emerald.700")
        ),
        theme("colors.neutral.700");
    background-size: var(${property}, 0%) 100%;
    background-repeat: no-repeat;
}

#${id}::-webkit-slider-runnable-track {
    background: linear-gradient(
            to right,
            theme("colors.indigo.600"),
            theme("colors.indigo.700")
        ),
        theme("colors.neutral.700");
    background-size: var(${property}, 0%) 100%;
    background-repeat: no-repeat;
}`;
            document.head.append(style);
        }
    });
</script>

<div class="flex justify-center items-center w-full px-1 py-1">
    <input
        class={extraClass}
        type="range"
        bind:value
        {max}
        {min}
        bind:this={slider}
        step={step}
    />
</div>
