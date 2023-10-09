<script lang="ts">
  import {
    PUBLIC_MAIN_PROGRAM_ID,
    PUBLIC_USDC_MINT_ADDR,
  } from "$env/static/public";
  import { web3Workspace } from "$lib/web3Workspace";
  import type {
    marketChaindata,
    marketFulldata,
  } from "@am/backend/types/market";
  import { PublicKey } from "@solana/web3.js";
  import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
  import IconMinus from "@tabler/icons-svelte/dist/svelte/icons/IconMinus.svelte";
  import IconSwitch from "@tabler/icons-svelte/dist/svelte/icons/IconSwitchVertical.svelte";
  import { onMount } from "svelte";
  import { USDC_PER_DOLLAR } from "$lib/web3_utils";
  import { browser } from "$app/environment";
  import {
    getBuyShareAmount,
    getChance,
    getSellUsdcLimit,
    getUserShares,
    buySharesInstruction,
  } from "$lib/web3_utils";
  import {
    usdFormatter,
    Errors,
    TxStatus,
  } from "$lib/utils"
  import confetti from "canvas-confetti";
  import { web3Store } from "$lib/web3Store";
  import LoadingOverlay from "$lib/components/loading_overlay.svelte";

  export let market: marketFulldata;
  export let direction: boolean;
  export let onClose: () => void;
  export let updateMarket: (market: marketFulldata) => void;

  const step = 0.1 * USDC_PER_DOLLAR;
  const chance = getChance(market.data.data.Yes, market.data.data.No);

  $: ({ solanaAddress } = $web3Workspace);
  $: userShares = getUserShares(
    market.data,
    $web3Store?.solanaAddress ? new PublicKey($web3Store.solanaAddress) : null
  );
  $: buying =
    userShares.sharesUI === 0 ||
    (userShares.shares > 0 && direction) ||
    (userShares.shares < 0 && !direction);
  $: summary = buying
    ? `Buy ${direction ? "'Yes'" : "'No'"} Shares`
    : `Sell ${userShares.shares < 0 ? "'No'" : "'Yes'"} Shares`;

  let defaultMicroUsd = 100;
  let microUsd = 0;
  let expectedShares: bigint = 0n;
  let expectedChance = 0;
  let expectedYes: bigint = 0n;
  let expectedNo: bigint = 0n;
  let maxSell = 0;

  let loadingMessage = "";
  let errorMessage = "";
  let completedMessage = "";

  let slider: HTMLInputElement;

  // capped in beta
  // $: maxBuy = microUsd + maxGap;
  $: maxBuy = 10 * USDC_PER_DOLLAR;
  $: slider
    ? slider.style.setProperty(
        "--background-size",
        `${((microUsd - 0) / ((buying ? maxBuy : maxSell) - 0)) * 100}%`
      )
    : undefined;
  $: browser
    ? recalc(
        market.data.data,
        userShares.shares,
        userShares.sharesUI,
        microUsd,
        direction
      )
    : undefined;

  onMount(async () => {
    slider = document.getElementById("cents_slider") as HTMLInputElement;
  });

  function recalc(
    data: marketChaindata,
    userShares: bigint,
    userSharesNumber: number,
    microUsdc: number,
    direction: boolean
  ) {
    const expected = getBuyShareAmount(data, Math.round(microUsdc), direction);
    expectedShares = BigInt(expected.shares.toString());
    expectedChance = expected.newRatio;
    expectedYes = BigInt(expected.newYes.toString());
    expectedNo = BigInt(expected.newNo.toString());
    if (userSharesNumber !== 0)
      maxSell = Number(getSellUsdcLimit(data, userShares));
  }

  async function executeTrade() {
    loadingMessage = "Creating instructions...";

    if (!solanaAddress) {
      throw new Error(Errors.LOGGED_OUT);
    }

    const instructions = await buySharesInstruction(
      new PublicKey(PUBLIC_USDC_MINT_ADDR),
      new PublicKey(PUBLIC_MAIN_PROGRAM_ID),
      new PublicKey(solanaAddress),
      new PublicKey(market.data.data.AmmAddress).toBytes(),
      microUsd,
      direction,
      microUsd,
      0
    );

    const usdcSwapNeeded = !$web3Store.solanaUsdcAddress
      ? microUsd
      : Number($web3Store.solanaUsdcBalance) - microUsd < 0
      ? microUsd - Number($web3Store.solanaUsdcBalance)
      : undefined;

    if (usdcSwapNeeded) {
      alert("need usdc");
    } else {
      $web3Workspace.handleTransaction(
        [instructions],
        (s) => {
          switch (s) {
            case TxStatus.SWAPPING:
              loadingMessage = "Preparing SOL-USDC swap...";
              break;
            case TxStatus.SIGNING:
              loadingMessage = "Waiting for signature...";
              break;
            case TxStatus.SENDING:
              loadingMessage = "Sending transaction...";
              break;
            case TxStatus.CONFIRMING:
              loadingMessage = "Confirming transaction...";
              break;
          }
        },
        (s, h) => {
          const publicKey = $web3Store?.solanaAddress;

          market.data.PriceHistory.push({
            Yes: expectedYes,
            No: expectedNo,
            Subsidy: market.data.data.Subsidy,
            At: new Date(Date.now() - 1000),
          });
          market.data.data.Yes = expectedYes;
          market.data.data.No = expectedNo;
          if (publicKey) {
            const userAccount = market.data.UserAccounts.get(publicKey);
            if (userAccount) {
              market.data.UserAccounts.set(publicKey, {
                ...userAccount,
                Shares:
                  userAccount?.Shares +
                  (direction ? expectedShares : -1n * expectedShares),
              });
            }
          }
          updateMarket(market);

          loadingMessage = "";
          completedMessage = "Trade executed!";

          var myCanvas = document.createElement("canvas");
          myCanvas.className =
            "absolute top-0 left-0 w-full h-full z-20 pointer-events-none";
          document.body.appendChild(myCanvas);
          var myConfetti = confetti.create(myCanvas, { resize: true });

          myConfetti({
            particleCount: 200,
          });

          setTimeout(() => {
            completedMessage = "";
            myConfetti.reset();
            document.body.removeChild(myCanvas);
            onClose();
          }, 5000);
        },
        (e) => {
          if (e instanceof Error) {
            errorMessage = e.message;
          } else {
            errorMessage = "Couldn't execute your trade, please try again.";
          }
        }
      );
    }
  }
</script>

<div class="modal_card gap-4 p-4">
  <LoadingOverlay
    variant={direction ? "green" : "red"}
    {loadingMessage}
    {errorMessage}
    {completedMessage}
    onClose={() => {
      if (!errorMessage) {
        onClose();
      }
      loadingMessage = "";
      errorMessage = "";
      completedMessage = "";
    }}
  />

  <p
    class="w-full flex justify-center flex-col mb-12 bg-gray-100 rounded-2xl p-4 text-center text-sm text-gray-600"
  >
    {market.metadata?.title}
  </p>
  <div
    class="text-md text-gray-500 flex gap-2 justify-center items-center ml-2"
  >
    <p class="whitespace-nowrap">
      {#if buying}
        {`Predicting `}
      {:else}
        {`Selling`}
      {/if}
      <span class={` ${direction ? "text-emerald-500" : "text-rose-500"}`}>
        {buying ? (direction ? "Yes" : "No") : direction ? "No" : "Yes"}
      </span>
    </p>
    <button
      on:click={() => (direction = !direction)}
      class="rounded-full bg-gray-50 ring-1 ring-gray-200 hover:bg-gray-200 p-1"
    >
      <IconSwitch size={15} />
    </button>
  </div>
  <div class="w-full flex justify-center items-center gap-2 pt-12">
    <button
      on:click={() =>
        (microUsd = Math.max(Math.round(microUsd / step) * step - step, 0))}
      class="p-1 ring-1 rounded-full ring-gray-300 text-gray-400 hover:text-gray-600 hover:ring-gray-400 hover:bg-gray-100"
    >
      <IconMinus size={20} />
    </button>
    <input
      type="string"
      value={usdFormatter.format(
        (buying
          ? microUsd
          : Number(expectedShares) *
            (userShares.shares > 0 ? chance : 1 - chance)) / USDC_PER_DOLLAR
      )}
      on:change={(e) => {
        const allowed = e.currentTarget.value.replace(/[^0-9.]+/g, "");
        const num = parseFloat(allowed);
        if (isNaN(num)) {
          microUsd = defaultMicroUsd;
        } else {
          microUsd = num * USDC_PER_DOLLAR;
          e.currentTarget.value = usdFormatter.format(
            microUsd / USDC_PER_DOLLAR
          ); // sometimes wasn't updating
        }
      }}
      class="text-4xl max-w-[16rem] text-center text-black outline-none"
    />
    <button
      class="p-1 ring-1 rounded-full ring-gray-300 text-gray-400 hover:text-gray-600 hover:ring-gray-400 hover:bg-gray-100"
      on:click={() =>
        (microUsd = buying
          ? Math.round(microUsd / step) * step + step
          : Math.min(microUsd + step, maxSell))}
    >
      <IconPlus size={20} />
    </button>
  </div>
  <div class={`whitespace-pre-wrap text-gray-500 text-xs pt-6 pb-6`}>
    {#if buying}
      <p>{`Predictions are limited to \n$10 per trade while in beta`}</p>
    {/if}
  </div>
  <div>
    <div class="mt-8 mb-2 divide-y divide-y-gray-200">
      <div />
      {#if !buying}
        <div class="p-4 text-sm flex justify-between items-center">
          <span class="text-gray-500">
            {`Your ${userShares.shares > 0 ? "'Yes'" : "'No'"} shares`}
          </span>
          <span class="text-black">
            {Math.abs(userShares.sharesUI)}
          </span>
        </div>
      {/if}
      <div class="p-4 text-sm flex justify-between items-center">
        {#if buying}
          <span class="text-gray-500">New Shares</span>
          <span class="text-black">
            {(Number(expectedShares) / USDC_PER_DOLLAR).toFixed(2)}
          </span>
        {:else}
          <span class="text-gray-500">
            {`${userShares.shares > 0 ? "'Yes'" : "'No'"} shares to sell`}
          </span>
          <span class="text-black">
            {(Number(expectedShares) / USDC_PER_DOLLAR).toFixed(2)}
          </span>
        {/if}
      </div>
      <div class="p-4 text-sm flex justify-between items-center">
        <span class="text-gray-500">New event probability</span>
        <span class="text-black">{`${(expectedChance * 100).toFixed(1)}%`}</span
        >
      </div>
      {#if buying}
        <div class="p-4 text-sm flex justify-between items-center">
          <span class="text-gray-500 font-semibold"
            >{`Payout if ${direction ? "Yes" : "No"}`}</span
          >
          <span
            class={`font-semibold  ${
              direction ? "text-green-500" : "text-rose-600"
            }`}
            >{`+ ${usdFormatter.format(
              Number((BigInt(expectedShares) - BigInt(microUsd)) / 10000n) / 100
            )}`}</span
          >
        </div>
      {/if}
    </div>
  </div>
  <div class="flex justify-center items-stretch bg-gray-100 rounded-full p-2">
    <div class=" flex justify-center items-center w-full px-6 py-1">
      <input
        class={direction ? "yes" : "no"}
        type="range"
        id="cents_slider"
        bind:value={microUsd}
        max={buying ? maxBuy : maxSell}
        min={0}
      />
    </div>
    {#if !buying}
      <button
        on:click={() => (microUsd = maxSell)}
        class={`rounded-full font-semibold whitespace-nowrap bg-white text-black ring-1 ring-gray-300 text-xs px-4 hover:shadow-md`}
      >
        Sell Max
      </button>
    {/if}
  </div>
  <button
    class={`w-full p-2.5 rounded-full text-white font-semibold cursor-pointer ${
      direction
        ? "bg-green-400 hover:bg-green-500"
        : "bg-rose-500 hover:bg-rose-600"
    }`}
    on:click={() => executeTrade()}
  >
    {`${summary}`}
  </button>
  <p class="text-sm text-gray-500 whitespace-pre-wrap">
    {#if buying}
      {`You have ${usdFormatter.format(
        Number($web3Store?.solanaUsdcBalance ?? 0) ?? 0
      )} available for trading`}
    {:else}
      {`You must sell your existing ${Math.abs(userShares.sharesUI)} ${
        userShares.shares > 0 ? "'Yes'" : "'No'"
      } shares \nbefore buying more ${
        userShares.shares > 0 ? "'No'" : "'Yes'"
      } shares`}
    {/if}
  </p>
</div>

<style>
  /* TO DO: Fix & clean up  */
  [type="range"] {
    flex: 1;
    width: 100%;
    margin: 0;
    padding: 0;
    min-height: 1.5em;
    background: transparent;
    font: inherit;
  }
  [type="range"]::-webkit-slider-thumb {
    margin-top: -0.625em;
    box-sizing: border-box;
    border: none;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
  }
  [type="range"],
  [type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  [type="range"]::-webkit-slider-runnable-track {
    box-sizing: border-box;
    border: none;
    height: 0.25em;
    border-radius: 10px;
  }
  [type="range"]::-moz-range-track {
    box-sizing: border-box;
    border: none;
    height: 0.25em;
    background: #d1d5db;
  }
  [type="range"]::-ms-track {
    box-sizing: border-box;
    border: none;
    height: 0.25em;
    background: #d1d5db;
  }
  [type="range"]::-moz-range-progress {
    height: 0.25em;
  }
  [type="range"]::-ms-fill-lower {
    height: 0.25em;
  }
  [type="range"]::-webkit-slider-thumb {
    margin-top: -0.625em;
    box-sizing: border-box;
    border: none;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  [type="range"]::-moz-range-thumb {
    box-sizing: border-box;
    border: none;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
  }
  [type="range"]::-ms-thumb {
    margin-top: 0;
    box-sizing: border-box;
    border: none;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
  }
  [type="range"]::-ms-tooltip {
    display: none;
  }

  [type="range"].no::-webkit-slider-thumb {
    background: #f87171;
  }
  [type="range"].no::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #ef4444, #ef4444), #d1d5db;
    background-size: var(--background-size, 0%) 100%;
    background-repeat: no-repeat;
  }
  [type="range"].no::-moz-range-progress {
    background: #ef4444;
  }
  [type="range"].no::-ms-fill-lower {
    background: #ef4444;
  }
  [type="range"].no::-webkit-slider-thumb {
    background: #f87171;
  }
  [type="range"].no::-moz-range-thumb {
    background: #f87171;
  }
  [type="range"].no::-ms-thumb {
    background: #f87171;
  }

  [type="range"].yes::-webkit-slider-thumb {
    background: #86efac;
  }
  [type="range"].yes::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #22c55e, #22c55e), #d1d5db;
    background-size: var(--background-size, 0%) 100%;
    background-repeat: no-repeat;
  }
  [type="range"].yes::-moz-range-progress {
    background: #22c55e;
  }
  [type="range"].yes::-ms-fill-lower {
    background: #22c55e;
  }
  [type="range"].yes::-webkit-slider-thumb {
    background: #86efac;
  }
  [type="range"].yes::-moz-range-thumb {
    background: #86efac;
  }
  [type="range"].yes::-ms-thumb {
    background: #86efac;
  }
</style>
