<script lang="ts">
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { api } from "$lib/api";
    import { clone } from "lodash";
    import type { pmMarketFulldata } from "@am/backend/types/market";
    import { IconStar } from "@tabler/icons-svelte";
    export let opMarket: marketFulldata | undefined = undefined;
    export let pmMarket: pmMarketFulldata | undefined = undefined;
    export let updateMarket: (
        market?: marketFulldata | pmMarketFulldata
    ) => void;

    function checkIds(
        ids: (string | undefined | null)[],
        opMarket?: marketFulldata,
        pmMarket?: pmMarketFulldata
    ): boolean {
        let liked = false;
        for (const id of ids) {
            if (id && opMarket && opMarket.data.Likes.has(id)) {
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
    $: likes = opMarket ? opMarket.data.Likes.size : pmMarket ? 0 : 0;

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
            // const newMarket = clone(pmMarket);
            // if (newState) {
            //     newMarket.data.likes.push($web3Store.solanaAddress);
            // } else {
            //     const newLikes = newMarket.data.likes.filter(
            //         (l) => l !== $web3Store?.solanaAddress
            //     );
            //     newMarket.data.likes = newLikes;
            // }
            // updateMarket(newMarket);
        }
    }
</script>

<button
    on:click|stopPropagation|preventDefault={(e) => {
        e.stopPropagation();
        like();
    }}
    class={`flex group/like items-center justify-center text-sm gap-1.5 py-1.5 px-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900`}
    >
    <IconStar
        class={`${
            liked
                ? "stoke-yellow-600 group-hover/like:stroke-yellow-600/50 dark:stroke-yellow-400 dark:group-hover/like:stroke-yellow-400/50"
                : "fill-transparent stroke-neutral-400 dark:stroke-neutral-600 group-hover/like:stroke-yellow-400 dark:group-hover/like:stroke-yellow-400/80"
        }`}
        size={18}
        stroke={2}
    />
    {likes}
</button>
