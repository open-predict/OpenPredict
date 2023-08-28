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
  import { USDC_PER_DOLLAR, usdFormatter } from "$lib/utils";
  import { PUBLIC_SOLANA_RPC_URL } from "$env/static/public";
  import { trpcc } from "$lib/trpc";
  import LoadingOverlay from "$lib/components/loading_overlay.svelte";
  $: sol = $web3Store?.sol ? $web3Store.sol.toFixed(6) : 0;
  let microUsdc: number = 0;

  let loadingMessage = "";
  let errorMessage = "";
  let completedMessage = "";

  async function payWithChangenow() {
    try {
      if (!$web3Store.publicKey) {
        modalStore.openModal(Modal.login);
        return;
      }
      loadingMessage = "Fetching details...";
      const res = await trpcc.checkoutWithChangenow.query({
        publicKey: $web3Store.publicKey?.toBase58(),
        amount: Math.round((microUsdc * 100) / USDC_PER_DOLLAR) / 100,
      });
      loadingMessage = "Redirecting you...";
      if (res) {
        if (res.error || !res.url) {
          errorMessage = res.error ?? "No url.";
        } else {
          var win = window.open(res.url, "_blank");
          win?.focus();
        }
      } else {
        errorMessage = "Error checking out. No response.";
      }
    } catch (e) {
      loadingMessage = "";
      if (e instanceof Error) {
        errorMessage = e.message;
      } else {
        errorMessage = "Couldn't execute transaction: " + e;
      }
      console.error(e);
    }
  }
</script>

<Dialog
  open={$modalStore.topup}
  on:close={() => modalStore.closeModal(Modal.topup)}
  class="modal_root"
>
  <DialogOverlay class="modal_overlay" />
  <div class="modal_card">
    <LoadingOverlay
      {errorMessage}
      {loadingMessage}
      onClose={() => {
        errorMessage = "";
        loadingMessage = "";
      }}
    />
    <div class="py-4 px-6 pt-14">
      <div class="px-8">
        <DialogTitle
          as="h3"
          class="text-xl font-semibold leading-6 text-gray-900"
        >
          Buy USDC
        </DialogTitle>
        <div class="mt-2">
          <DialogDescription
            as="p"
            class="text-gray-500 text-lg whitespace-pre-wrap mt-10"
          >
            {`Shares on OpenPredict's markets are purchased with USDC, a stablecoin pegged to the US dollar.`}
          </DialogDescription>
        </div>
      </div>
      <div class="flex flex-col gap-2.5 p-6">
        <button
          on:click={() => {
            if (!$web3Store?.usdcAddress) {
              modalStore.openModal(Modal.login);
              return;
            }
            navigator.clipboard.writeText($web3Store.usdcAddress.toBase58());
          }}
          class="btn_secondary"
        >
          Copy SOL-USDC address
        </button>
        <a
          class="btn_secondary"
          target="_blank"
          rel="noreferrer"
          href="https://changenow.io/exchange?from=usd&to=sol&fiatMode=true"
        >
          Pay for USDC manually
        </a>
      </div>
    </div>
  </div></Dialog
>
