<script lang="ts">
    import type { pmMarketFulldata } from "@am/backend/types/market";

    import {
        PriceHistoryTerm,
        resamplePricePoints,
    } from "$lib/components/charts/utils";
    import colors from "tailwindcss/colors";
    import {
        PriceHistoryInterval,
        type MarketPrice,
        ClobClient,
        Chain,
    } from "$lib/clob";
    import Chart from "./token_chart.svelte";
    import type { TTokenData } from "$lib/types";
    import { IconLoader2 } from "@tabler/icons-svelte";

    export let market: pmMarketFulldata;
    export let term: PriceHistoryInterval = PriceHistoryInterval.ONE_DAY;

    async function getMarketPriceHistory(m: pmMarketFulldata, term: PriceHistoryInterval) {
        const clobClient = new ClobClient(
            "https://polyclob.openpredict.org",
            Chain.POLYGON
        );
        return await Promise.all(
            m.data.tokens.map((t, i) => {
                return clobClient
                    .getPricesHistory({
                        interval: term,
                        market: t.token_id,
                        fidelity: 4,
                    })
                    .then((ph) => ({
                        id: t.token_id,
                        outcome: t.outcome,
                        data: resamplePricePoints(
                            (
                                ph as unknown as { history: MarketPrice[] }
                            ).history.map((v) => ({
                                time: new Date(v.t),
                                price: v.p,
                            })),
                            term
                        ),
                        color:
                            t.outcome === "Yes"
                                ? colors.emerald[500]
                                : t.outcome === "No"
                                ? colors.red[500]
                                : colors.indigo[500], //getTokenColor(t.outcome)['400'],
                    }));
            })
        ).then((res) => {
            return res.reduce((acc: Record<string, TTokenData>, val) => {
                acc[val.id] = val;
                return acc;
            }, {});
        });
    }

    $: tokenDataPromise = getMarketPriceHistory(market, term);
</script>

{#await tokenDataPromise}
    <div class="h-[240px] flex justify-center items-center animate-pulse">
        <IconLoader2 class="animate-spin" />
    </div>
{:then tokenData}
    <Chart {tokenData} bind:term />
{/await}
