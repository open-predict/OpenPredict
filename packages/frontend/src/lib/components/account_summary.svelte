<script lang="ts">
  import { getUserShares } from "$lib/utils/op";
  import { web3Store } from "$lib/web3Store";
  import CopyButton from "../elements/copy_button.svelte";
  import { Modal, modalStore } from "$lib/modals/modalStore";
  import { web3Workspace } from "$lib/web3Workspace";
  import {
    IconLoader,
    IconCoins,
    IconSend,
    IconRefresh,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { PublicKey } from "@solana/web3.js";
  import { api } from "$lib/api";
    import { readableAddress, usd } from "$lib/utils/format";

  let loading = false;

  let positions = { active: 0, redeemable: 0 };

  async function getUserPositions(): Promise<{
    active: number;
    redeemable: number;
  }> {
    let ret = { active: 0, redeemable: 0 };
    if (!$web3Store?.solanaAddress) return ret;
    // const positions = await trpcc.getMarketAccounts.query({
    //   userId: $web3Store.solanaAddress,
    // });
    const positions = await api.getMarketAccounts.query({
      userId: $web3Store.solanaAddress,
    });
    // positions.forEach((p) => {
    //   const us = getUserShares(
    //     p.market.data,
    //     new PublicKey($web3Store.solanaAddress as string)
    //   );
    //   if (p.market.data.data.Resolved) {
    //     ret.redeemable = ret.redeemable + us.valueCents;
    //   } else {
    //     ret.active = ret.active + us.valueCents;
    //   }
    // });
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
          <!-- {usd.format($web3Store?.usdc?.uiAmount ?? 0)} -->
        </p>
      </div>
      <div class="flex justify-between items-center py-2">
        <p class="text-gray-500">Redeemable</p>
        <p class="">
          {usd.format(positions.redeemable / 100)}
        </p>
      </div>
      <div class="flex justify-end items-center py-2 gap-2">
        <p class="text-gray-500 mr-auto">Active Positions</p>
        <p class="">
          {usd.format(positions.active / 100)}
        </p>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-2 mb-8">
    <p class="text-xs font-semibold text-left">Addresses</p>
    <div class="divide-y divide-gray-200 text-sm">
      <div />
      <div class="flex items-center py-2">
        <p class="text-gray-500 mr-auto">Solana</p>
        {#if !!$web3Store?.solanaAddress}
          <CopyButton value={$web3Store?.solanaAddress} />
          <p class="ml-2">
            {readableAddress($web3Store?.solanaAddress)}
          </p>
        {:else}
          <p class="ml-2">
            {"None"}
          </p>
        {/if}
      </div>
      <div class="flex items-center py-2">
        <p class="text-gray-500 mr-auto">USDC Token</p>
        {#if !!$web3Store?.solanaUsdcAddress}
          <CopyButton value={$web3Store?.solanaUsdcAddress} />
          <p class="ml-2">
            {readableAddress($web3Store?.solanaUsdcAddress)}
          </p>
        {:else}
          <p class="ml-2">
            {"None"}
          </p>
        {/if}
      </div>
      <div class="flex items-center py-2">
        <p class="text-gray-500 mr-auto">Polygon Address</p>
        {#if !!$web3Store?.polygonAddress}
          <CopyButton value={$web3Store?.polygonAddress} />
          <p class="ml-2">
            {readableAddress($web3Store?.polygonAddress)}
          </p>
        {:else}
          <p class="ml-2">
            {"None"}
          </p>
        {/if}
      </div>
      <div class="flex items-center py-2">
        <p class="text-gray-500 mr-auto">Polygon USDC</p>
        {#if !!$web3Store?.polymarketProxyAddress}
          <CopyButton value={$web3Store?.polymarketProxyAddress} />
          <p class="ml-2">
            {readableAddress($web3Store?.polymarketProxyAddress)}
          </p>
        {:else}
          <p class="ml-2">
            {"None"}
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>
<div class="px-5 pb-5 flex flex-col gap-2.5 w-full mt-4">
  <button
    on:click={() => {
      modalStore.openModal(Modal.topup);
    }}
    class={`btn_secondary`}
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
