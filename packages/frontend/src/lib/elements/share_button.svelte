<script lang="ts">
    import { api } from "$lib/api";
    import type { TPmMarket } from "$lib/types";
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import IconShare from "@tabler/icons-svelte/dist/svelte/icons/IconShare.svelte";

    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: TPmMarket | undefined = undefined;

    export let updateMarket: (market?: marketFulldata | TPmMarket) => void;

    let shared = false;
    let timesShared = opMarket ? opMarket.data.CommentCount : pmMarket ? pmMarket.subgraph.trades.length : 0;

    $: id = opMarket
        ? new PublicKey(opMarket.data.data.AmmAddress).toBase58()
        : pmMarket
        ? pmMarket.data.condition_id
        : null;

    async function share() {
        if (id) {
            console.log("Actually implement this.");
            shared = await api.recordShare(id);
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
    class={`flex group/like items-center justify-center text-sm gap-1.5 py-1.5 px-2.5 rounded-lg text-neutral-400 hover:bg-neutral-900`}
>
    <IconShare
        class={`${
            shared
                ? "stroke-teal-400 group-hover/like:stroke-teal-400/50"
                : "stroke-neutral-600 fill-transparent group-hover/like:stroke-teal-400/80"
        }`}
        size={20}
    />
    {timesShared}
</button>
