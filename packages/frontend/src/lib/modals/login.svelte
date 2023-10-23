<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    // import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    import Login from "$lib/components/login.svelte";

    function close() {
        modalStore.closeModal(Modal.login);
    }
</script>

<!-- <Dialog open={$modalStore.login} on:close={() => close()} class="modal_root">
    <DialogOverlay class="modal_overlay" />
    <div class="modal_card">
        <div class="p-14">
            <Login />
        </div>
    </div>
</Dialog> -->
