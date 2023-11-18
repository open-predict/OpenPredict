<script lang="ts">
    import type { pmMarketFulldata } from "@am/backend/types/market";

    import {
        PriceHistoryTerm,
        resamplePmPriceHistory,
    } from "$lib/charts/utils";
    import colors from "tailwindcss/colors";
    import {
        PriceHistoryInterval,
        type MarketPrice,
        ClobClient,
        Chain,
    } from "$lib/clob";
    import Chart from "./token_chart.svelte";
    
    export let market: pmMarketFulldata;
    export let term: PriceHistoryTerm = PriceHistoryTerm.DAY;

    async function getMarketPriceHistory(m: pmMarketFulldata) {
        const clobClient = new ClobClient(
            "https://polyclob.openpredict.org",
            Chain.POLYGON
        );

        return await Promise.all(
            m.data.tokens.map((t, i) => {
                return clobClient
                    .getPricesHistory({
                        interval: PriceHistoryInterval.ONE_WEEK,
                        market: t.token_id,
                        fidelity: 4,
                    })
                    .then((ph) => ({
                        // ...t,
                        id: t.token_id,
                        outcome: t.outcome,
                        data: resamplePmPriceHistory(
                            (ph as unknown as { history: MarketPrice[] })
                                .history,
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
            return res.reduce(
                (
                    acc: Record<
                        string,
                        {
                            color: string;
                            outcome: string;
                            id: string;
                            data: {
                                date: Date;
                                price: number;
                            }[];
                        }
                    >,
                    val
                ) => {
                    acc[val.id] = val;
                    return acc;
                },
                {}
            );
        });
    }

    $: tokenDataPromise = getMarketPriceHistory(market);
</script>

{#await tokenDataPromise}
    <div />
{:then tokenData}
    <Chart {tokenData} />
{/await}
