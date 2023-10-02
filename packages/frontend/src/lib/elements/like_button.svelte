<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import IconHeart from "@tabler/icons-svelte/dist/svelte/icons/IconHeart.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { trpcc } from "../trpc";
    import { PublicKey } from "@solana/web3.js";
    export let market: marketFulldata | undefined;
    export let updateMarket: (market: marketFulldata) => void;

    const liked = false;
    // $: liked = $web3Store?.solanaAddress
    //     ? market.data.Likes.has($web3Store.solanaAddress)
    //     : undefined;

    async function like() {
        //     const newState = !liked;

        //     if (!$web3Store.solanaAddress) {
        //         modalStore.openModal(Modal.login);
        //         return;
        //     }

        //     const done = await $web3Workspace.makeAuthenticatedRequest(() =>
        //         trpcc.like
        //             .query({
        //                 ammAddress: new PublicKey(
        //                     market.data.data.AmmAddress
        //                 ).toBase58(),
        //                 liked: newState,
        //             })
        //             .then((res) => !res?.error)
        //             .catch(() => false)
        //     );
        //     modalStore.closeModal(Modal.login);
        //     if (!done) {
        //         alert("Unable to like or unlike this market.");
        //         return;
        //     }
        //     if (newState) {
        //         market.data.Likes.add($web3Store.solanaAddress);
        //     } else {
        //         market.data.Likes.delete($web3Store.solanaAddress);
        //     }
        if (false) {
            updateMarket(market as marketFulldata);
        }
    }
</script>

<button
    on:click|stopPropagation|preventDefault={(e) => {
        e.stopPropagation();
        like();
    }}
    class={`flex group/like items-center justify-center text-sm gap-1.5 py-1.5 px-2.5 rounded-lg text-neutral-400 hover:bg-neutral-900`}
>
    <IconHeart
        class={`${
            liked
                ? "group-hover/like:rotate-12 stroke-rose-400 fill-rose-400/25 group-hover/like:fill-rose-400/25 group-hover/like:stroke-rose-400/50"
                : "group-hover/like:-rotate-12 stroke-neutral-600 fill-transparent group-hover/like:fill-rose-400/25 group-hover/like:stroke-rose-400/50"
        }`}
        size={20}
    />
    {market?.data.Likes.size ?? 0}
</button>
