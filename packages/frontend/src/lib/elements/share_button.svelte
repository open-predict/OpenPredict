<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import IconShare from "@tabler/icons-svelte/dist/svelte/icons/IconShare.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { trpcc } from "../trpc";
    import { PublicKey } from "@solana/web3.js";
    export let market: marketFulldata | undefined;
    let shared = false;
</script>

<button
    on:click|stopPropagation|preventDefault={(e) => {
        e.stopPropagation();
        shared = true;
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
    {0}
</button>
