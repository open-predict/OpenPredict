<script lang="ts">
    import { api } from "$lib/api";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import { IconShare } from "@tabler/icons-svelte";

    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;

    export let updateMarket: (market?: marketFulldata | pmMarketFulldata) => void;

    let shared = false;
    // let timesShared = opMarket ? opMarket.data.CommentCount : pmMarket ? pmMarket.data.comments.length : 0;
    let timesShared = 0;

    $: id = opMarket
        ? new PublicKey(opMarket.data.data.AmmAddress).toBase58()
        : pmMarket
        ? pmMarket.data.condition_id
        : null;

    async function share() {
        if (id) {
            console.log("Actually implement this.");
            if(shared){
                updateMarket(opMarket ?? pmMarket)
            }
        }
    }
</script>

<button
    on:click|stopPropagation|preventDefault={(e) => {
        e.stopPropagation();
        share();
    }}
    class={`flex group/like items-center justify-center text-sm gap-1.5 py-1.5 px-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900`}
    >
    <IconShare
        class={`stroke-neutral-400 group-hover/like:stroke-teal-600 dark:stroke-neutral-600 dark:group-hover/like:stroke-teal-400/80`}
        size={18}
        stroke={2}
    />
    {timesShared}
</button>
