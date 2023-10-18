<script lang="ts">
    import { browser } from "$app/environment";
    import { IconArrowLeft } from "@tabler/icons-svelte";
    $: locationSplit = browser ? window.location.pathname.split("/") : [];
</script>

{#if locationSplit.length > 1 && locationSplit[1] !== ""}
    <button
        class="action_icon"
        on:click={() => window.history.back()}
    >
        <IconArrowLeft
         size={20} />
    </button>
{:else}
    <div class="md:hidden">
        <slot name="fallback" />
    </div>
{/if}
