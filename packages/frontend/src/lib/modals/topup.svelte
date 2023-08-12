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
      };
      loadingMessage = "Fetching details..."
      const res = await trpcc.checkoutWithChangenow.query({
        publicKey: $web3Store.publicKey?.toBase58(),
        amount: Math.round((microUsdc * 100) / USDC_PER_DOLLAR) / 100,
      });
      loadingMessage = "Redirecting you..."
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

{#if $web3Store?.publicKey}
  <Dialog
    open={$modalStore.topup}
    on:close={() => modalStore.closeModal(Modal.topup)}
    class="modal_root"
  >
    <DialogOverlay class="modal_overlay" />
    <div class="modal_card">

      <LoadingOverlay 
        errorMessage={errorMessage}
        loadingMessage={loadingMessage}
        onClose={() => {
          errorMessage = ""
          loadingMessage = ""
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
        <!-- <div
          class="mt-10 p-6 bg-gray-100 rounded-2xl overflow-clip flex flex-col gap-3"
        >
          <p class="text-gray-500 text-sm">Your public key</p>
          <p class="whitespace-pre-wrap break-words text-gray-800 my-5">
            {$web3Store?.publicKey.toBase58()}
          </p>
          <button
            on:click={() =>
              window.navigator.clipboard.writeText(
                $web3Store?.publicKey?.toBase58() ?? ""
              )}
            class="btn_secondary hover:shadow-xl"
          >
            Copy Address
          </button>
          <p class="text-gray-500 text-sm">
            {`Current balannce: ${sol} SOL`}
          </p>
        </div>
        <p class="mt-10 text-gray-600">
          {`ChangeNow generally imposes a minimum order amount of ~50$ when purchasing SOL/USDC with fiat.`}
        </p> -->
        <!-- <button
          class="btn_primary w-full mt-10"
          on:click={payWithChangenow}
          disabled={!!loadingMessage || !!errorMessage}
        >
          Pay with credit card
        </button>
      </div>
      <div class="relative mt-2 mx-20">
        <div class="absolute inset-0 flex items-center" aria-hidden={true}>
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center">
          <span class="bg-white px-2 py-4 text-sm text-gray-500">or do things manually</span>
        </div>
      </div> -->
      <div class="flex flex-col gap-2.5 p-6">
        <button 
          on:click={() => {
            if(!$web3Store?.usdcAddress) {
              modalStore.openModal(Modal.login)
              return;
            }
            navigator.clipboard.writeText($web3Store.usdcAddress.toBase58());
          }} 
          class="btn_secondary"
        >
          Copy SOL-USDC address
        </button>
        <!-- <a
          class="btn_secondary"
          target="_blank"
          rel="noreferrer"
          href="https://changenow.io/exchange?from=usd&to=sol&fiatMode=true"
        >
          Pay for USDC manually
        </a> -->
      </div>
    </div>
  </Dialog>
{/if}
