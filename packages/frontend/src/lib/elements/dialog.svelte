<script lang="ts">
    import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    import { fade } from "svelte/transition";
    export let open: boolean;
    export let close: () => void;
</script>

<Dialog bind:open on:close={close} class="modal_root">
    <DialogOverlay class="modal_overlay" />
    <slot />
</Dialog>
