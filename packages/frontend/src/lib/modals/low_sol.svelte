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
  import { usdFormatter } from "$lib/utils";
  import { PUBLIC_SOLANA_RPC_URL } from "$env/static/public";
  $: sol = $web3Store?.sol ? $web3Store.sol.toFixed(6) : 0;
</script>

{#if $web3Store?.publicKey}
  <Dialog
    open={$modalStore.low_sol}
    on:close={() => modalStore.closeModal(Modal.low_sol)}
    class="modal_root"
  >
    <DialogOverlay class="modal_overlay" />
    <div class="modal_card">
      <div class="p-14">
        <DialogTitle
          as="h3"
          class="text-xl font-semibold leading-6 text-gray-900"
        >
          Increase your balance
        </DialogTitle>
        <div class="mt-2">
          <DialogDescription
            as="p"
            class="text-gray-500 text-lg whitespace-pre-wrap mt-10"
          >
            {`SOL is used to pay for transactions (fractional cents) and for automatic USDC swaps when enabled.`}
          </DialogDescription>
        </div>
        <div
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
        </p>
      </div>
      <div class="flex flex-col gap-2.5 p-6">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://changenow.io/exchange?from=usd&to=sol&fiatMode=true"
          class="btn_primary"
        >
          Visit Change Now
        </a>
        {#if PUBLIC_SOLANA_RPC_URL.includes("127.0.0.1") || PUBLIC_SOLANA_RPC_URL.includes("devnet")}
          <button on:click={$web3Workspace.requestSol} class="btn_secondary">
            Airdrop (DEV)
          </button>
        {/if}
      </div>
    </div></Dialog
  >
{/if}
