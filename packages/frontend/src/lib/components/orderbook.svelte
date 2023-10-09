<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import { usdFormatter } from "$lib/utils";
    import { afterUpdate, onMount, tick } from "svelte";
    import type { pmMarketFulldata, pmTokenOrderdata } from "$lib/types";
    export let market: pmMarketFulldata;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;

    let selectedToken: { token: pmTokenOrderdata; id: string } | undefined;

    function getScrollParent(node: HTMLElement | null) {
        if (node === null) {
            return null;
        }
        if (node.scrollHeight > node.clientHeight) {
            return node;
        } else {
            return getScrollParent(node.parentElement);
        }
    }

    async function selectToken(token: string) {
        selectedToken = {
            id: token,
            token: market.tokenOrderdata.get(token) as pmTokenOrderdata,
        };
        await tick();
        const midpoint = window.document.getElementById("midpoint");
        if (midpoint) {
            const scrollable = getScrollParent(midpoint);
            if (scrollable) {
                const stickyItems = 32;
                const centeringOffset =
                    scrollable.clientHeight * 0.5 - midpoint.clientHeight * 0.5;
                scrollable.scrollTop =
                    midpoint.getBoundingClientRect().top -
                    scrollable.getBoundingClientRect().top +
                    scrollable.scrollTop -
                    centeringOffset - stickyItems;
            }
        }
    }

    $: spread = selectedToken
        ? Math.abs(
              50 -
                  selectedToken.token.book.bids.sort(
                      (a, b) => b[0] - a[0]
                  )[0][0] +
                  (50 -
                      selectedToken.token.book.asks.sort(
                          (a, b) => a[0] - b[0]
                      )[0][0])
          )
        : null;
    $: midpoint =
        selectedToken && spread
            ? selectedToken.token.book.asks.sort((a, b) => a[0] - b[0])[0][0] +
              spread / 2
            : null;

    onMount(async () => {
        if (market.data.tokens[0]) {
            selectToken(market.data.tokens[0].token_id);
        }
    });

    $: askRows = selectedToken
        ? selectedToken.token.book.asks
              .sort((a, b) => a[0] - b[0])
              .reduce((acc: { p: number; s: number; t: number }[], val) => {
                  return [
                      ...acc,
                      {
                          p: val[0],
                          s: val[1],
                          t:
                              acc.length > 0
                                  ? acc[acc.length - 1].t + val[0] * val[1]
                                  : val[0] * val[1],
                      },
                  ];
              }, [])
              .reverse()
        : [];
    $: askTotal = askRows.length > 0 ? askRows[0].t : 1;

    $: bidRows = selectedToken
        ? selectedToken.token.book.bids
              .sort((a, b) => b[0] - a[0])
              .reduce((acc: { p: number; s: number; t: number }[], val) => {
                  return [
                      ...acc,
                      {
                          p: val[0],
                          s: val[1],
                          t:
                              acc.length > 0
                                  ? acc[acc.length - 1].t + val[0] * val[1]
                                  : val[0] * val[1],
                      },
                  ];
              }, [])
        : [];
    $: bidTotal = bidRows.length > 0 ? bidRows[bidRows.length - 1].t : 1;
</script>

<div
    class="sticky top-0 z-10 h-12 flex justify-start items-center border-b border-neutral-900 px-4 gap-4 bg-neutral-950"
>
    {#each market.data.tokens as token}
        <button
            on:click={() => selectToken(token.token_id)}
            class={`h-12 border-b-2 font-semibold text-sm ${
                token.token_id === selectedToken?.id
                    ? "text-white border-neutral-400"
                    : "text-neutral-300 border-transparent"
            }`}
        >
            {`Trade ${token.outcome}`}
        </button>
    {/each}
</div>
<div
    class="sticky top-12 h-8 z-10 bg-neutral-950 border-b border-neutral-900 flex flex-col text-neutral-600 text-sm"
>
    <div class="flex h-10 relative">
        <div class="w-1/3 px-4 py-2 flex justify-center items-center">
            {"Price"}
        </div>
        <div class="w-1/3 px-4 py-2 flex justify-center items-center">
            {"Shares"}
        </div>
        <div class="w-1/3 px-4 py-2 flex justify-center items-center">
            {"Total"}
        </div>
    </div>
</div>
{#if selectedToken}
    <div
        id="order_book"
        class="flex flex-col divide-y divide-neutral-800 text-sm text-neutral-400 h-full"
    >
        <div class="flex flex-col">
            {#each askRows as ask}
                <div class="flex h-8 relative">
                    <div
                        class="absolute h-full bg-red-400/5"
                        style={`width: ${(ask.t / askTotal) * 100}%`}
                    />
                    <div
                        class="w-1/3 px-4 py-2 flex justify-center items-center"
                    >
                        {usdFormatter.format(ask.p / 100)}
                    </div>
                    <div
                        class="w-1/3 px-4 py-2 flex justify-center items-center"
                    >
                        {ask.s}
                    </div>
                    <div
                        class="w-1/3 px-4 py-2 flex justify-center items-center"
                    >
                        {usdFormatter.format(ask.t / 100)}
                    </div>
                </div>
            {/each}
        </div>
        <div class="flex h-8 relative text-neutral-200" id="midpoint">
            <div class="w-1/3 px-4 py-2 flex justify-center items-center">
                Midpoint {midpoint
                    ? usdFormatter.format(midpoint / 100)
                    : "N/A"}
            </div>
            <div class="w-1/3 px-4 py-2 flex justify-center items-center">
                Spread {spread ? usdFormatter.format(spread / 100) : "N/A"}
            </div>
            <div class="w-1/3" />
        </div>
        <div class="flex flex-col">
            {#each bidRows as bid}
                <div class="flex h-8 relative">
                    <div
                        class="absolute h-full bg-green-400/5"
                        style={`width: ${(bid.t / bidTotal) * 100}%`}
                    />
                    <div
                        class="w-1/3 px-4 py-2 flex justify-center items-center"
                    >
                        {usdFormatter.format(bid.p)}
                    </div>
                    <div
                        class="w-1/3 px-4 py-2 flex justify-center items-center"
                    >
                        {bid.s}
                    </div>
                    <div
                        class="w-1/3 px-4 py-2 flex justify-center items-center"
                    >
                        {usdFormatter.format(bid.t)}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
