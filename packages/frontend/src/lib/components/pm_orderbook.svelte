<script lang="ts">
    import { usd } from "$lib/utils/format";
    import { onMount, tick } from "svelte";
    import type {
        pmMarketFulldata,
        pmTokenOrderdata,
    } from "@am/backend/types/market";
    import Row from "./pm_orderbook_row.svelte";
    import { getMidpoint, getSpread, reduceLimitOrders } from "$lib/utils/pm";

    export let market: pmMarketFulldata;

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
            token: market.orderdata.get(token) as pmTokenOrderdata,
        };
        console.log(
            "selected: ",
            market.data.tokens.find((t) => t.token_id === token)?.outcome,
            selectedToken.token
        );
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
                    centeringOffset -
                    stickyItems;
            }
        }
    }

    onMount(async () => {
        if (market.data.tokens[0]) {
            selectToken(market.data.tokens[0].token_id);
        }
    });

    $: spread = selectedToken ? getSpread(selectedToken.token.book) : 0;
    $: midpoint = selectedToken ? getMidpoint(selectedToken.token.book) : 0.5;
    $: askRows = selectedToken
        ? reduceLimitOrders(
              selectedToken.token.book.asks.sort((a, b) => a[0] - b[0])
          ).reverse()
        : [];
    $: bidRows = selectedToken
        ? reduceLimitOrders(
              selectedToken.token.book.bids.sort((a, b) => b[0] - a[0])
          )
        : [];
    $: bidTotal = bidRows.length > 0 ? bidRows[bidRows.length - 1].total : 1;
    $: askTotal = askRows.length > 0 ? askRows[0].total : 1;
</script>

<div class="sticky top-0 z-10 bg-white dark:bg-neutral-950">
    <div
        class="h-12 flex justify-start items-center px-4 gap-4 border-b border-neutral-200 dark:border-neutral-900 shadow-sm dark:shadow-black"
    >
        {#each market.data.tokens as token}
            <button
                on:click={() => selectToken(token.token_id)}
                class={`h-12 border-b-2 font-semibold text-sm ${
                    token.token_id === selectedToken?.id
                        ? "border-neutral-600 dark:border-neutral-400"
                        : "border-transparent opacity-60"
                }`}
            >
                <h5>
                    {`${token.outcome} shares`}
                </h5>
            </button>
        {/each}
    </div>
    <div
        class="h-8 flex flex-col text-xs font-semibold border-b border-neutral-200 dark:border-neutral-900"
    >
        <div class="h-10 relative grid grid-cols-3 opacity-60">
            <p class="px-4 py-2 flex items-center">
                {"Price"}
            </p>
            <p class="px-4 py-2 flex items-center">
                {"Shares"}
            </p>
            <p class="px-4 py-2 flex items-center">
                {"Total"}
            </p>
        </div>
    </div>
</div>
{#if selectedToken}
    <div
        id="order_book"
        class="flex flex-col items-stretch text-sm font-medium h-full"
    >
        <div class="relative flex flex-col">
            {#each askRows as ask}
                <Row item={ask}>
                    <span class="text-red-500" slot="price">
                        {(ask.price * 100).toFixed(0) + "¢"}
                    </span>
                    <div
                        slot="overlay"
                        class="absolute h-full bg-red-400/5"
                        style={`width: ${(ask.total / askTotal) * 100}%`}
                    />
                </Row>
            {/each}
            {#if askRows.length === 0}
                <p
                    class="h-8 px-4 py-2 flex items-center justify-center text-sm font-semibold opacity-75 bg-black/25"
                >
                    {"No asks."}
                </p>
            {/if}
        </div>
        <div
            class="flex h-8 relative border-y border-neutral-200 dark:border-neutral-900"
            id="midpoint"
        >
            <p class="w-1/3 px-4 py-2 flex items-center">
                {`Spread: ${((spread ?? 0)*100).toFixed(0)}¢`}
            </p>
            <!-- <p class="w-1/3 px-4 py-2 flex items-center">
                {`Last: ${selectedToken?.token.filledOrders[0] ?? "None"}`}
            </p> -->
            <!-- <p class="w-1/3 px-4 py-2 flex items-center">
                {`Midpoint: ${midpoint ? usd.format(midpoint / 100) : "N/A"}`}
            </p> -->
        </div>
        <div class="relative flex flex-col">
            {#each bidRows as bid}
                <Row item={bid}>
                    <span class="text-green-500" slot="price">
                        {(bid.price * 100).toFixed(0) + "¢"}
                    </span>
                    <div
                        slot="overlay"
                        class="absolute h-full bg-green-400/5"
                        style={`width: ${(bid.total / bidTotal) * 100}%`}
                    />
                </Row>
            {/each}
            {#if bidRows.length === 0}
                <p
                class="h-8 px-4 py-2 flex items-center justify-center text-sm font-semibold opacity-75 bg-black/25"
                >
                    {"No bids."}
                </p>
            {/if}
        </div>
    </div>
{/if}
