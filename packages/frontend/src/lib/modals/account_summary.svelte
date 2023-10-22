<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    // import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    import AccountSummary from "$lib/components/account_summary.svelte";
</script>

<!-- <Dialog
    open={$modalStore.account_summary}
    on:close={() => modalStore.closeModal(Modal.account_summary)}
    class="modal_root"
>
    <DialogOverlay
        class="modal_overlay"
    />
    <div class="modal_card">
        <AccountSummary />
    </div>
</Dialog> -->
