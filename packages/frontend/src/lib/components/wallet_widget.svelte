<script lang="ts">
    import { usdFormatter } from "$lib/utils";
    import { web3Store } from "$lib/web3Store";
    import IconDown from "@tabler/icons-svelte/dist/svelte/icons/IconTriangleInvertedFilled.svelte";
    import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
    import IconSwap from "@tabler/icons-svelte/dist/svelte/icons/IconTransform.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
</script>

{#if $web3Store?.publicKey}
    <div
        class="flex flex-nowrap items-center rounded-full bg-white ring-1 ring-gray-200 p-1.5 gap-1.5 h-11"
    >
        <div
            class="rounded-full h-full p-1 text-gray-600 bg-gray-100 flex flex-nowrap ring-1 ring-gray-200 justify-center items-center gap-2 pr-4"
        >
            <img src="/usdc.svg" alt="usdc" class="w-6" />
            <p class="text-sm font-medium">
                {usdFormatter.format($web3Store?.usdc?.uiAmount ?? 0)}
            </p>
            <!-- <IconDown size={8} /> -->
        </div>
        <button 
            class="action_icon h-full w-7"
            on:click={() => modalStore.openModal(Modal.topup)}
        >
            <IconPlus size={18} />
        </button>
    </div>
{/if}
