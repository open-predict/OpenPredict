<script lang="ts">
    import type { TPmMarket } from "$lib/types";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import IconComment from "@tabler/icons-svelte/dist/svelte/icons/IconMessageCircle2.svelte";

    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: TPmMarket | undefined = undefined;

    function checkIds(
        ids: (string | undefined | null)[],
        opMarket?: marketFulldata,
        pmMarket?: TPmMarket
    ): boolean {
        let commented = false;
        for (const id of ids) {
            if (
                id &&
                pmMarket &&
                pmMarket.subgraph.comments.filter((c) => c.userKey === id).length > 0
            ) {
                commented = true;
            }
        }
        return commented;
    }

    $: commentCount = opMarket
        ? opMarket.data.CommentCount
        : pmMarket
        ? pmMarket.subgraph.comments.length
        : 0;

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
    class={`flex group/like items-center justify-center text-sm gap-1.5 py-1.5 px-2.5 rounded-lg text-neutral-400 hover:bg-neutral-900`}
>
    <IconComment
        class={`${
            commented
                ? "stroke-sky-400 group-hover/like:stroke-sky-400/50"
                : "stroke-neutral-600 fill-transparent group-hover/like:stroke-sky-400/80"
        }`}
        size={20}
    />
    {commentCount}
</a>
