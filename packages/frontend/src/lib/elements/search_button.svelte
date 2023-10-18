<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { IconSearch } from "@tabler/icons-svelte";
</script>

<button
    on:click={() => modalStore.openModal(Modal.search_markets)}
    class="w-full h-full flex items-center justify-start gap-2 rounded-xl ring-1 ring-gray-200 bg-gray-50 p-4 text-gray-500 dark:ring-neutral-900 dark:bg-neutral-950"
>
    <IconSearch stroke={1.7} size={18} class="text-gray-200 dark:text-neutral-600" />
    <span class="text-sm text-gray-500 dark:text-neutral-600">
        Search...
    </span>
</button>
