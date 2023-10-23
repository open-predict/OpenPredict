<script lang="ts">
    export let selected: "left" | "right" = "left";
    export let onSelect: (selected: "left" | "right") => void
</script>
<div
    class="relative w-full h-full flex flex-nowrap p-1.5 bg-neutral-900/75 text-xs text-neutral-300 rounded-xl font-medium"
>
    <div class={`absolute w-[calc(50%-0.375rem)] h-[calc(100%-0.75rem)] bg-neutral-800 transition-all rounded-lg ${selected === "left" ? "left-1.5" : "right-1.5"}`}
        style="transition: left"
    />
    <button 
        on:click={() => onSelect("left")}
        class={`flex items-center justify-center gap-1.5 w-1/2 h-full z-[1] text-white ${selected === "left" ? "text-white" : ""}`}
    >
        <slot name="left" />
    </button>
    <button
        on:click={() => onSelect("right")}
        class={`flex items-center justify-center gap-1.5 w-1/2 h-full z-[1] text-white ${selected === "right" ? "text-white" : ""}`}
    >
        <slot name="right" />
    </button>
</div>
