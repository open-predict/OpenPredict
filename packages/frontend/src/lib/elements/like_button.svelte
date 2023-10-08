<script lang="ts">
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import IconHeart from "@tabler/icons-svelte/dist/svelte/icons/IconHeart.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { api } from "$lib/api";
    import { clone } from "lodash";
    import type { pmMarketFulldata } from "$lib/types";
    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;
    export let updateMarket: (market?: marketFulldata | pmMarketFulldata) => void;

    function checkIds(
        ids: (string | undefined | null)[],
        opMarket?: marketFulldata,
        pmMarket?: pmMarketFulldata
    ): boolean {
        let liked = false;
        for (const id of ids) {
            if (
                id &&
                ((opMarket && opMarket.data.Likes.has(id)) ||
                    (pmMarket && pmMarket.data.likes.includes(id)))
            ) {
                liked = true;
            }
        }
        return liked;
    }

    $: liked = checkIds(
        [$web3Store?.polygonAddress, $web3Store?.solanaAddress],
        opMarket,
        pmMarket
    );
    $: likes = opMarket
        ? opMarket.data.Likes.size
        : pmMarket
        ? pmMarket.data.likes.length
        : 0;

    async function like() {
        if (!$web3Store?.solanaAddress) {
            modalStore.openModal(Modal.login);
            return;
        }

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

        const likeResponse = await api.recordLike($web3Store.solanaAddress);
        if (!likeResponse) alert("Unable to like market, please try again.");

        const newState = !liked;

        if (opMarket) {
            const newMarket = clone(opMarket);
            if (newState) {
                newMarket.data.Likes.add($web3Store.solanaAddress);
            } else {
                newMarket.data.Likes.delete($web3Store.solanaAddress);
            }
            updateMarket(newMarket);
        } else if (pmMarket) {
            const newMarket = clone(pmMarket);
            if (newState) {
                newMarket.data.likes.push($web3Store.solanaAddress);
            } else {
                const newLikes = newMarket.data.likes.filter(
                    (l) => l !== $web3Store?.solanaAddress
                );
                newMarket.data.likes = newLikes;
            }
            updateMarket(newMarket);
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
    {likes}
</button>
