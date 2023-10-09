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
  import {
    autoresizeTextarea,
    usdFormatter,
    TxStatus,
    solFormatter,
  } from "$lib/utils";
  import {USDC_PER_DOLLAR} from "$lib/web3_utils"
  import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    TransactionInstruction,
  } from "@solana/web3.js";
  import * as splToken from "@solana/spl-token";
  import LoadingOverlay from "$lib/components/loading_overlay.svelte";

  const microUsdcLimit = 10 * USDC_PER_DOLLAR;
  const lamportLimit = 1 * LAMPORTS_PER_SOL;
  let token: "SOL" | "USDC" = "USDC";
  let lamports: number = 0;
  let microUsdc: number = 0;
  let address = "";

  let loadingMessage = "";
  let errorMessage = "";
  let completedMessage = "";

  // async function execute() {
  //   try {
  //     if (
  //       (token === "SOL" && lamports > lamportLimit) ||
  //       (token === "USDC" && microUsdc > microUsdcLimit)
  //     ) {
  //       errorMessage =
  //         "Amount exceeds beta max send limit (50). Please try again";
  //       return;
  //     }

  //     if (!$web3Store?.publicKey) {
  //       modalStore.openModal(Modal.login);
  //       return;
  //     }

  //     if (!$web3Store.usdcAddress && token === "USDC") {
  //       modalStore.openModal(Modal.no_usdc_account);
  //       return;
  //     }

  //     let instructions: TransactionInstruction;

  //     if (token === "SOL") {
  //       loadingMessage = "Preparing SOL transfer...";
  //       instructions = SystemProgram.transfer({
  //         fromPubkey: $web3Store?.publicKey,
  //         toPubkey: new PublicKey(address),
  //         lamports,
  //       });
  //     } else {
  //       loadingMessage = "Preparing USDC transfer...";
  //       instructions = splToken.createTransferInstruction(
  //         $web3Store?.usdcAddress as PublicKey,
  //         new PublicKey(address),
  //         $web3Store?.publicKey,
  //         microUsdc
  //       );
  //     }

  //     $web3Workspace.handleTransaction(
  //       [instructions],
  //       (s) => {
  //         switch (s) {
  //           case TxStatus.SIGNING:
  //             loadingMessage = "Waiting for signature...";
  //             break;
  //           case TxStatus.SENDING:
  //             loadingMessage = "Sending transaction...";
  //             break;
  //           case TxStatus.CONFIRMING:
  //             loadingMessage = "Confirming transaction...";
  //             break;
  //         }
  //       },
  //       async () => {
  //         await $web3Workspace.refreshKeys();
  //         await $web3Workspace.refreshBalances();
  //         loadingMessage = "";
  //         completedMessage = "Completed swap!";
  //       },
  //       (e) => {
  //         loadingMessage = "";
  //         if (e instanceof Error) {
  //           errorMessage = e.message;
  //         } else {
  //           errorMessage = "Couldn't execute transaction: " + e;
  //         }
  //       }
  //     );
  //   } catch (e) {
  //     loadingMessage = "";
  //     if (e instanceof Error) {
  //       errorMessage = e.message;
  //     } else {
  //       errorMessage = "Couldn't execute transaction: " + e;
  //     }
  //     console.error(e);
  //   }
  // }
</script>

<Dialog
  open={$modalStore.send_funds}
  on:close={() => modalStore.closeModal(Modal.send_funds)}
  class="modal_root"
>
  <DialogOverlay class="modal_overlay" />
  <div class="modal_card">
    <LoadingOverlay
      {loadingMessage}
      {errorMessage}
      {completedMessage}
      onClose={() => {
        if (!errorMessage) {
          modalStore.closeModal(Modal.send_funds);
        }
        loadingMessage = "";
        errorMessage = "";
        completedMessage = "";
      }}
    />
    <div class="flex flex-col p-14 items-center gap-4">
      <nav class="text-lg font-semibold leading-6 text-gray-900 flex gap-2">
        <button
          class={`py-2 px-4 rounded-full transition-all ${
            token === "USDC"
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-transparent text-black hover:bg-gray-200"
          }`}
          on:click={() => (token = "USDC")}
        >
          {`Send USDC`}
        </button>
        <button
          class={`py-2 px-4 rounded-full transition-all ${
            token === "SOL"
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-transparent text-black hover:bg-gray-200"
          }`}
          on:click={() => (token = "SOL")}
        >
          {`Send SOL`}
        </button>
      </nav>
      <DialogTitle as="h3" />
      <div class="mt-2">
        <DialogDescription as="p" class="text-gray-500 text-lg">
          {`Send ${token} to an address`}
        </DialogDescription>
      </div>
      <input
        type="string"
        value={token === "SOL"
          ? solFormatter.format(lamports / LAMPORTS_PER_SOL) + " SOL"
          : usdFormatter.format(microUsdc / USDC_PER_DOLLAR)}
        on:change={(e) => {
          const allowed = e.currentTarget.value.replace(/[^0-9.]+/g, "");
          const num = parseFloat(allowed);
          if (isNaN(num)) {
            if (token === "SOL") {
              lamports = 0;
            } else {
              microUsdc = 0;
            }
          } else {
            if (token === "SOL") {
              lamports = num * LAMPORTS_PER_SOL;
              e.currentTarget.value = solFormatter.format(
                lamports / LAMPORTS_PER_SOL
              );
            } else {
              microUsdc = num * USDC_PER_DOLLAR;
              e.currentTarget.value = usdFormatter.format(
                microUsdc / USDC_PER_DOLLAR
              ); // sometimes wasn't updating
            }
          }
        }}
        class="text-4xl my-10 max-w-[16rem] text-center text-black outline-none"
      />
      <textarea
        id="address"
        name="address"
        rows={2}
        placeholder={token === "SOL" ? "Solana address" : "USDC Address"}
        bind:value={address}
        use:autoresizeTextarea
        class="mt-2 w-full rounded-xl border-0 py-1.5 px-3 text-gray-900 bg-gray-100 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
      />
    </div>
    <!-- <div class="flex flex-col gap-2.5 p-6">
      <button on:click={execute} class="btn_primary">
        {`Send ${
          token === "SOL"
            ? solFormatter.format(lamports / LAMPORTS_PER_SOL) + " SOL"
            : usdFormatter.format(microUsdc / USDC_PER_DOLLAR)
        }`}
      </button> -->
    <!-- <p class="text-sm text-gray-500 whitespace-pre-wrap mt-4">
        {`You have ${usdFormatter.format(
          token === "USDC"
            ? $web3Store?.usdc?.uiAmount ?? 0
            : $web3Store.usdc?.uiAmount ?? 0
        )} & ${$web3Store.sol?.toFixed(2)} SOL available.`}
        <span class="text-yellow-600">
          {`\nPlease double check the address before sending.`}
        </span>
      </p> -->
    <!-- </div> -->
  </div>
</Dialog>
