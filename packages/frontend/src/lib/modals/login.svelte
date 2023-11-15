<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import Login from "$lib/components/login.svelte";
    import Dialog from "$lib/elements/dialog.svelte";

    function close() {
        modalStore.closeModal(Modal.login);
    }

    const onKeyDown = async (
        e: KeyboardEvent & {
            currentTarget: EventTarget & HTMLDivElement;
        }
    ) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        switch (e.key) {
            case "Escape":
                close();
                break;

            default:
                break;
        }
    };

</script>

<Dialog open={$modalStore.login} {close}>
    <div
        class="modal_card md:max-w-sm text-left p-8"
        on:keydown={onKeyDown}
    >
        <Login />
    </div>
</Dialog>
