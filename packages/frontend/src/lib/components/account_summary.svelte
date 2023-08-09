<script lang="ts">
  import { getUserShares, readablePublicKey, usdFormatter } from "$lib/utils";
  import { web3Store } from "$lib/web3Store";
  import CopyButton from "../elements/copy_button.svelte";
  import { Modal, modalStore } from "$lib/modals/modalStore";
  import IconRefresh from "@tabler/icons-svelte/dist/svelte/icons/IconRefresh.svelte";
  import IconSend from "@tabler/icons-svelte/dist/svelte/icons/IconSend.svelte";
  import IconDown from "@tabler/icons-svelte/dist/svelte/icons/IconChevronDown.svelte";
  import IconCoins from "@tabler/icons-svelte/dist/svelte/icons/IconCoins.svelte";
  import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader.svelte";
  import { web3Workspace } from "$lib/web3Workspace";
  import { trpcc } from "$lib/trpc";
  import { onMount } from "svelte";

  let loading = false;

  let positions = { active: 0, redeemable: 0 };

  async function getUserPositions(): Promise<{
    active: number;
    redeemable: number;
  }> {
    let ret = { active: 0, redeemable: 0 };
    if (!$web3Store.publicKey) return ret;
    const positions = await trpcc.getMarketAccounts.query({
      userId: $web3Store.publicKey.toBase58(),
    });
    positions.forEach((p) => {
      const us = getUserShares(p.market.data, $web3Store.publicKey);
      if (p.market.data.data.Resolved) {
        ret.redeemable = ret.redeemable + us.valueCents;
      } else {
        ret.active = ret.active + us.valueCents;
      }
    });
    return ret;
  }

  onMount(() => {
    getUserPositions().then((r) => {
      positions = r;
    });
  });
</script>

<div class="flex flex-col gap-6 px-8 pt-8 w-full">
  <div class="flex justify-between items-center">
    <h4 class="text-lg">Account Summary</h4>
    <button
      on:click={async () => {
        loading = true;
        await $web3Workspace.refreshKeys();
        await $web3Workspace.refreshBalances();
        await getUserPositions().then((r) => {
          positions = r;
        });
        loading = false;
      }}
      class="action_icon h-6 w-6"
    >
      {#if loading}
        <IconLoader size={18} class="animate-spin" />
      {:else}
        <IconRefresh size={18} />
      {/if}
    </button>
  </div>
  <div class="flex flex-col gap-2">
    <p class="text-xs font-semibold text-left">Positions & Balances</p>
    <div class="divide-y divide-gray-200 text-sm">
      <div />
      <div class="flex justify-end items-center py-2 gap-2">
        <p class="text-gray-500 mr-auto">Cash</p>
        <p class="">
          {usdFormatter.format($web3Store?.usdc?.uiAmount ?? 0)}
        </p>
      </div>
      <div class="flex justify-between items-center py-2">
        <p class="text-gray-500">Redeemable</p>
        <p class="">
          {usdFormatter.format(positions.redeemable / 100)}
        </p>
      </div>
      <div class="flex justify-end items-center py-2 gap-2">
        <p class="text-gray-500 mr-auto">Active Positions</p>
        <p class="">
          {usdFormatter.format(positions.active / 100)}
        </p>
      </div>
    </div>
  </div>
  <!-- <div class="flex flex-col gap-2 mb-8">
    <p class="text-xs font-semibold text-left">Addresses</p>
    <div class="divide-y divide-gray-200 text-sm">
      <div />
      <div class="flex items-center py-2">
        <p class="text-gray-500 mr-auto">Solana</p>
        {#if !!$web3Store?.publicKey}
          <CopyButton value={$web3Store?.publicKey?.toBase58()} />
          <p class="ml-2">
            {readablePublicKey($web3Store?.publicKey)}
          </p>
        {:else}
          <p class="ml-2">
            {"None"}
          </p>
        {/if}
      </div>
      <div class="flex items-center py-2">
        <p class="text-gray-500 mr-auto">USDC Token</p>
        {#if !!$web3Store?.usdcAddress}
          <CopyButton value={$web3Store?.usdcAddress.toBase58()} />
          <p class="ml-2">
            {readablePublicKey($web3Store?.usdcAddress)}
          </p>
        {:else}
          <p class="ml-2">
            {"None"}
          </p>
        {/if}
      </div>
    </div>
  </div> -->
</div>
<div class="px-5 pb-5 flex flex-col gap-2.5 w-full mt-4">
  <button
    on:click={() => {
      modalStore.openModal(Modal.topup);
    }}
    class={`btn_secondary ${
      ($web3Store?.usdc?.uiAmount ?? 0) < 0.05
        ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white ring-0 hover:shadow-sky-400/50"
        : ""
    }`}
  >
    <IconCoins size={16} />
    Fund Account
  </button>
  <button
    on:click={() => modalStore.openModal(Modal.send_funds)}
    class="btn_secondary"
  >
    <IconSend size={16} />
    Export Funds
  </button>
</div>
