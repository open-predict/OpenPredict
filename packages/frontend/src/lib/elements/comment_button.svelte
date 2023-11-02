<script lang="ts">
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import { IconMessageCircle2 } from "@tabler/icons-svelte";

    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;
    export let commentCount: number | undefined = 0;

    function checkIds(
        ids: (string | undefined | null)[],
        opMarket?: marketFulldata,
        pmMarket?: pmMarketFulldata
    ): boolean {
        if (!pmMarket || !opMarket) {
            return false;
        } else {
            for (const id of ids) {
                return false;
            }
        }
        return commented;
    }

    $: id = opMarket
        ? new PublicKey(opMarket.data.data.AmmAddress).toBase58()
        : pmMarket
        ? pmMarket.data.condition_id
        : null;

    $: commented = checkIds(
        [$web3Store?.polygonAddress, $web3Store?.solanaAddress],
        opMarket,
        pmMarket
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
