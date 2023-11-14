<script lang="ts">
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import { IconMessageCircle2 } from "@tabler/icons-svelte";
    import type { TMarket } from "$lib/types";

    export let market: TMarket;
    export let commentCount: number | undefined = 0;

    function checkIds(
        ids: (string | undefined | null)[],
        market: TMarket
    ): boolean {
        return false;
    }

    $: id = market.opMarket
        ? new PublicKey(market.opMarket.data.data.AmmAddress).toBase58()
        : market.pmMarket
        ? market.pmMarket.data.condition_id
        : null;

    $: commented = checkIds(
        [
            $web3Store?.solana?.address,
            $web3Store?.polygon?.address,
            $web3Store?.polymarket?.address,
        ],
        market
    );
</script>

<a
    href={`/app/${id}#comments`}
    class={`flex group/like items-center justify-center text-sm gap-1.5 py-1.5 px-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900`}
>
    <IconMessageCircle2
        class={`${
            commented
                ? "stoke-sky-600 group-hover/like:stroke-sky-600/50 dark:stroke-sky-400 dark:group-hover/like:stroke-sky-400/50"
                : "fill-transparent stroke-neutral-400 dark:stroke-neutral-600 group-hover/like:stroke-sky-600 dark:group-hover/like:stroke-sky-400/80"
        }`}
        size={18}
        stroke={2}
    />
    {commentCount}
</a>
