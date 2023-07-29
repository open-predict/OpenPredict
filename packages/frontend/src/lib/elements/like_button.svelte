<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import type { marketFulldata } from "@am/backend/types/market";
    import IconHeart from "@tabler/icons-svelte/dist/svelte/icons/IconHeart.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { trpcc } from "../trpc";
    import { PublicKey } from "@solana/web3.js";
    export let market: marketFulldata;
    export let updateMarket: (market: marketFulldata) => void;

    $: liked = $web3Store?.publicKey ? market.data.Likes.has($web3Store.publicKey.toBase58()) : undefined;

    async function like() {
        const newState = !liked;

        if (!$web3Store.publicKey) {
            modalStore.openModal(Modal.login);
            return;
        }
        
        const done = await $web3Workspace.makeAuthenticatedRequest(() =>
            trpcc.like
                .query({
                    ammAddress: new PublicKey(
                        market.data.data.AmmAddress
                    ).toBase58(),
                    liked: newState,
                })
                .then((res) => !res?.error)
                .catch(() => false)
        );
        modalStore.closeModal(Modal.login);
        if (!done) {
            alert("Unable to like or unlike this market.")
            return
        } 
        if(newState){
            market.data.Likes.add($web3Store.publicKey.toBase58())
        } else {
            market.data.Likes.delete($web3Store.publicKey.toBase58())
        }
        updateMarket(market);
    }

</script>

<button
    on:click|stopPropagation|preventDefault={(e) => {
        e.stopPropagation();
        like()
    }}
    class={`flex py-2.5 px-4 justify-center items-center rounded-full gap-2 text-md hover:bg-gray-100 text-gray-600 hover:text-gray-700 ${liked ? "fill-rose-400 stroke-rose-700 hover:stroke-gray-600 hover:fill-gray-300" : "fill-gray-100 stroke-gray-500 hover:stroke-gray-600 hover:fill-gray-300"}`}
>
    <IconHeart class={`stroke-inherit ${liked ? "fill-rose-500" : "fill-inherit"}`} size={20} />
    {market.data.Likes.size}
</button>
