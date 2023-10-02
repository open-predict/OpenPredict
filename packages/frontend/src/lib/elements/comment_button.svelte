<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import IconComment from "@tabler/icons-svelte/dist/svelte/icons/IconMessageCircle2.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { trpcc } from "../trpc";
    import { PublicKey } from "@solana/web3.js";
    export let market: marketFulldata | undefined;
    const commented = false;
</script>

<a
    href={`/app#comments`}
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
    {0}
</a>
