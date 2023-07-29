<script lang="ts">
    import IconCopy from "@tabler/icons-svelte/dist/svelte/icons/IconCopy.svelte";
    import IconCheck from "@tabler/icons-svelte/dist/svelte/icons/IconCheck.svelte";
    export let value: string;
    let copied = false;
    function copy() {
        window.navigator.clipboard.writeText(value);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 5000);
    }
</script>

<button
    on:click={copy}
    class="action_icon h-5 w-5"
>
    {#if copied}
        <IconCheck size={14} class="stroke-green-500" />
    {:else}
        <IconCopy size={14} />
    {/if}
</button>
