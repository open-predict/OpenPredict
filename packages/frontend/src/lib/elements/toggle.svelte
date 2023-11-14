<script lang="ts">
    export let selected: "left" | "right" = "left";
    export let onSelect: (selected: "left" | "right") => void
</script>
<div
    class="relative w-full h-full flex flex-nowrap p-1 text-xs rounded-xl shadow-inner font-medium border dark:border-0 border-neutral-200 text-neutral-700 bg-neutral-100 dark:text-neutral-300 dark:bg-neutral-900/75"
>
    <div class={`absolute w-[calc(50%-0.375rem)] h-[calc(100%-0.5rem)] bg-white border dark:border-0 shadow-sm dark:bg-neutral-800 transition-all rounded-lg ${selected === "left" ? "left-1.5" : "right-1.5"}`}
        style="transition: left"
    />
    <button 
        on:click={() => onSelect("left")}
        class={`flex items-center font-semibold justify-center gap-1.5 w-1/2 h-full z-[1] ${selected === "left" ? "dark:text-white text-black" : ""}`}
    >
        <slot name="left" />
    </button>
    <button
        on:click={() => onSelect("right")}
        class={`flex items-center font-semibold justify-center gap-1.5 w-1/2 h-full z-[1] ${selected === "right" ? "dark:text-white text-black" : ""}`}
    >
        <slot name="right" />
    </button>
</div>
