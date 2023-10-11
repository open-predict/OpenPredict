<script lang="ts">
    export let selected: "left" | "right" = "left";
    export let onSelect: (selected: "left" | "right") => void
</script>
<div
    class="relative flex flex-nowrap p-1 bg-neutral-900/75 text-xs text-neutral-300 rounded-lg font-medium"
>
    <div class={`absolute w-20 h-7 bg-neutral-800 rounded-md ${selected === "left" ? "left-1" : "right-1"}`} />
    <button 
        on:click={() => onSelect("left")}
        class={`flex items-center justify-center gap-1.5 w-20 h-7 z-[1] text-white ${selected === "left" ? "text-white" : ""}`}
    >
        <slot name="left" />
    </button>
    <button
        on:click={() => onSelect("right")}
        class={`flex items-center justify-center gap-1.5 w-20 h-7 z-[1] text-white ${selected === "right" ? "text-white" : ""}`}
    >
        <slot name="right" />
    </button>
</div>
