<script>
    import { web3Store } from "$lib/web3Store";
    import { Modal, modalStore } from "$lib/modals/modalStore";
</script>

{#if !$web3Store?.solanaAddress}
    <div
        class="md:hidden w-full h-14 flex items-center p-0.5 px-4 gap-2 fill-white text-white bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600"
    >
        <p class="text-sm">Prediction markets for everyone.</p>
        <button
            on:click={() => modalStore.openModal(Modal.login)}
            class="btn_primary bg-white/10 h-8 px-4 text-xs font-semibold ml-auto"
        >
            Join OpenPredict
        </button>
    </div>
{/if}
