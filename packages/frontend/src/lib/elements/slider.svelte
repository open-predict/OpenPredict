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

    $: setSlider(slider, property, _value ?? 0);

    function setSlider(s: HTMLElement | null, p: string, v: number) {
        if (s && p)
            s.style.setProperty(p, `${((v - 0) / (max - 0)) * 100}%`);
    }

    $: slider,
        (() => {
            if (!slider) return;
            id = nanoid();
            property = `--range-${id}-bg-size`;
            slider.setAttribute("id", id);
            if (slider) {
                let style = document.createElement("style");
                style.textContent = `.range#${id}::-webkit-slider-runnable-track {                
    background-size: var(${property}, 0%) 100%;
}`;
                document.head.append(style);
            }
        })();
</script>

<div class="flex justify-center items-center w-full px-1 py-1">
    <input
        class={"range" + (` ${extraClass}` ?? "")}
        type="range"
        bind:value
        {max}
        {min}
        bind:this={slider}
        {step}
    />
</div>
