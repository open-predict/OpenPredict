<script lang="ts">
  import { Modal, modalStore } from "$lib/modals/modalStore";
  import {
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
  } from "@rgossiaux/svelte-headlessui";
  import { web3Workspace } from "$lib/web3Workspace";
  import { web3Store } from "$lib/web3Store";
  import { TxStatus, USDC_PER_DOLLAR, usdFormatter } from "$lib/utils";
  import createConnection from "$lib/createConnection";
  import IconX from "@tabler/icons-svelte/dist/svelte/icons/IconX.svelte";
  import LoadingOverlay from "$lib/components/loading_overlay.svelte";
  import { trpcc } from "$lib/trpc";

  let microUsdc = 0;

  let loadingMessage = "";
  let errorMessage = "";
  let completedMessage = "";

  async function createUsdcTokenAccount() {
    const publicKey = $web3Store?.publicKey;
    if(!publicKey) {
      modalStore.openModal(Modal.login);
      return;
    }
    const res = await trpcc.makeUsdcWallet.query({
      user: publicKey.toBase58(),
    });
    console.log(res);
    await $web3Workspace.refreshKeys();
  }

  async function executeSwap() {
    alert("no longer available");
    return;
    //const connection = createConnection();
    //const publicKey = $web3Store?.publicKey;
    //if (publicKey && connection) {
    //  $web3Workspace.handleTransaction(
    //    [],
    //    (s) => {
    //      switch (s) {
    //        case TxStatus.SWAPPING:
    //          loadingMessage = "Preparing SOL-USDC swap...";
    //          break;
    //        case TxStatus.SIGNING:
    //          loadingMessage = "Waiting for signature...";
    //          break;
    //        case TxStatus.SENDING:
    //          loadingMessage = "Sending transaction...";
    //          break;
    //        case TxStatus.CONFIRMING:
    //          loadingMessage = "Confirming transaction...";
    //          break;
    //      }
    //    },
    //    async () => {
    //      await $web3Workspace.refreshKeys();
    //      await $web3Workspace.refreshBalances();
    //      loadingMessage = "";
    //      completedMessage = "Completed swap!";
    //    },
    //    (e) => {
    //      if (e instanceof Error) {
    //        errorMessage = e.message;
    //      } else {
    //        errorMessage = "Couldn't execute swap account: " + e;
    //      }
    //    },
    //    microUsdc
    //  );
    //}
  }
</script>

<Dialog
  open={$modalStore.swap}
  on:close={() => modalStore.closeModal(Modal.swap)}
  class="modal_root"
>
  <DialogOverlay class="modal_overlay" />
  <div class="modal_card">
    <LoadingOverlay
      {loadingMessage}
      {errorMessage}
      {completedMessage}
      onClose={() => {
        loadingMessage = "";
        errorMessage = "";
        completedMessage = "";
      }}
    />
    {#if $web3Store?.publicKey && $web3Store?.usdcAddress}
      {#if $web3Store.sol}
        <div class="p-14 pb-4">
          <DialogTitle
            as="h3"
            class="text-xl font-semibold leading-6 text-gray-900"
          >
            Swap SOL to USDC
          </DialogTitle>
          <div class="mt-2">
            <DialogDescription
              as="p"
              class="text-gray-500 text-lg whitespace-pre-wrap mt-4"
            >
              {`Enter desired USDC below`}
            </DialogDescription>
          </div>
          <div class="mt-2">
            <input
              type="string"
              value={usdFormatter.format(microUsdc / USDC_PER_DOLLAR)}
              on:change={(e) => {
                const allowed = e.currentTarget.value.replace(/[^0-9.]+/g, "");
                const num = parseFloat(allowed);
                if (isNaN(num)) {
                  microUsdc = 0;
                } else {
                  microUsdc = num * USDC_PER_DOLLAR;
                  e.currentTarget.value = usdFormatter.format(
                    microUsdc / USDC_PER_DOLLAR
                  ); // sometimes wasn't updating
                }
              }}
              class="text-4xl my-10 max-w-[16rem] text-center text-black outline-none"
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 p-6">
          {#if errorMessage}
            <div class="px-4 py-2 ring-1 rounded-xl ring-red-500 bg-red-50">
              <div
                class="font-semibold text-red-600 text-sm flex items-center justify-between"
              >
                <span>Error:</span>
                <button on:click={() => (errorMessage = "")} class="p-1">
                  <IconX size={20} stroke={2} />
                </button>
              </div>
              <p class="text-red-500 text-sm pb-2">
                {errorMessage}
              </p>
            </div>
          {/if}
          <button on:click={executeSwap} class="btn_primary">
            Execute Swap
          </button>
          <p class="text-sm text-gray-500 whitespace-pre-wrap">
            {`You currently have ${$web3Store.sol?.toFixed(2)} SOL`}
          </p>
        </div>
      {:else}
        <div class="p-14 pb-4">
          <DialogTitle
            as="h3"
            class="text-xl font-semibold leading-6 text-gray-900"
          >
            You don't have any sol to swap
          </DialogTitle>
        </div>
      {/if}
    {:else}
      <div class="p-14 pb-4">
        <DialogTitle
          as="h3"
          class="text-xl font-semibold leading-6 text-gray-900"
        >
          Swap requires USDC account
        </DialogTitle>
        <div class="mt-2">
          <DialogDescription
            as="p"
            class="text-gray-500 text-lg whitespace-pre-wrap mt-4"
          >
            {`You can't swap SOL for USDC until you've created a USDC token account.`}
          </DialogDescription>
        </div>
      </div>
      <div class="flex flex-col gap-2.5 p-6">
        {#if errorMessage}
          <div class="px-4 py-2 ring-1 rounded-xl ring-red-500 bg-red-50">
            <div
              class="font-semibold text-red-600 text-sm flex items-center justify-between"
            >
              <span>Error:</span>
              <button on:click={() => (errorMessage = "")} class="p-1">
                <IconX size={20} stroke={2} />
              </button>
            </div>
            <p class="text-red-500 text-sm pb-2">
              {errorMessage}
            </p>
          </div>
        {/if}
        <button
          on:click={createUsdcTokenAccount}
          disabled={!!loadingMessage}
          class="btn_primary"
        >
          Create
        </button>
        <!-- <a
            href="https://openpredict.org"
            class="btn_secondary"
          >
            More information
          </a> -->
      </div>
    {/if}
  </div>
</Dialog>
