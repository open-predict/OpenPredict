<script lang="ts">
    import type {
        marketFulldata,
        marketPricePoint,
    } from "@am/backend/types/market";
    import colors from "tailwindcss/colors";
    import { getChance } from "$lib/utils/op";
    import Chart from "./token_chart.svelte";
    import type { TTokenData } from "$lib/types";

    export let market: marketFulldata | undefined = undefined;

    const _tokenData = {
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

    $: tokenData = market
        ? market.data.PriceHistory.reduce(
              (acc: Record<string, TTokenData>, val: marketPricePoint) => {
                  const chance = getChance(val.Yes, val.No);
                  acc["yes"].data.push({
                      date: val.At,
                      price: Number((chance * 100).toFixed(0)),
                  });
                  acc["no"].data.push({
                      date: val.At,
                      price: Number(((1 - chance) * 100).toFixed(0)),
                  });
                  return acc;
              },
              { ..._tokenData }
          )
        : { ..._tokenData };
</script>

<Chart {tokenData} />
