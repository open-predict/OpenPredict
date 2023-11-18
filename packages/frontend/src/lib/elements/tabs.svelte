<script lang="ts">
    export let selected: string;
    export let options: { Icon: any; label: string }[];
    export let select: (v: string) => void;
</script>

<div
    class="w-full flex items-center justify-between h-full font-semibold text-xs divide-x bg-white divide-neutral-200 dark:divide-neutral-800 dark:bg-neutral-900/40"
>
    {#each options as { label, Icon }}
        <button
            on:click={() => select(label)}
            class={`flex gap-1 items-center justify-center w-full h-full ${
                selected === label
                    ? "text-black dark:text-white"
                    : "text-neutral-500 dark:text-neutral-400"
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    {/each}
</div>
