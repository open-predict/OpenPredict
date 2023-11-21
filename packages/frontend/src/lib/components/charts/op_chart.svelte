<script lang="ts">
    import type {
        marketFulldata,
        marketPricePoint,
    } from "@am/backend/types/market";
    import colors from "tailwindcss/colors";
    import { getChance } from "$lib/utils/op";
    import Chart from "./token_chart.svelte";
    import type { TTokenData } from "$lib/types";
    import { PriceHistoryTerm, resamplePricePoints } from "./utils";
    import { PriceHistoryInterval } from "$lib/clob";

    export let market: marketFulldata | undefined = undefined;
    export let term: PriceHistoryInterval = PriceHistoryInterval.ONE_DAY;

    const getTokenData = (
        d: undefined | marketPricePoint[] = [],
        term: PriceHistoryInterval
    ) => {
        console.groupCollapsed("preparing token chart data...")

        let tokenData = {
            yes: {
                id: "yes",
                outcome: "Yes",
                color: colors.green[400],
                data: [],
            },
            no: {
                id: "no",
                outcome: "No",
                color: colors.red[400],
                data: [],
            },
        } as Record<string, TTokenData>;

        d.forEach((val) => {
            const chance = getChance(val.Yes, val.No);
            tokenData["yes"].data.push({
                time: val.At,
                price: chance,
            });
            tokenData["no"].data.push({
                time: val.At,
                price: 1 - chance,
            });
        });

        console.log("formatted token data: ", tokenData['yes'].data, tokenData['no'].data)

        tokenData["no"].data = resamplePricePoints(tokenData["no"].data, term);
        tokenData["yes"].data = resamplePricePoints(
            tokenData["yes"].data,
            term
        );

        console.log("last resampled points: ", tokenData['yes'].data[tokenData['yes'].data.length - 1], tokenData['no'].data[tokenData['no'].data.length - 1])
        console.groupEnd()
        return tokenData;
    };

    $: tokenData = getTokenData(market?.data.PriceHistory, term);
</script>

<Chart {tokenData} bind:term />
