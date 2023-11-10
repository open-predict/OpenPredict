<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import { draftsStore } from "$lib/marketDraftStore";
    import { goto } from "$app/navigation";
    import MainHeader from "$lib/components/header.svelte";
    import { IconPlus, IconUfo } from "@tabler/icons-svelte";

    $: drafts = Object.entries($draftsStore);
    const create = () => goto("/drafts/" + draftsStore.createDraft())

</script>

<ColumnLayout>
    <MainHeader slot="main-header">
        <p
            slot="center"
            class="text-black max-w-[14rem] overflow-hidden overflow-ellipsis"
        >
            {"Your Drafts"}
        </p>
        <button
            slot="right"
            class={`action_icon`}
            on:click={create}
        >
            <IconPlus size={20} />
        </button>
    </MainHeader>
    <div slot="main" class="flex flex-col divide-y divide-gray-200">
        {#each Object.entries($draftsStore) as draft}
            <a
                href={`/drafts/${draft[0]}`}
                class="hover:bg-gray-100 w-full flex flex-nowrap items-stretch"
            >
                <div class="w-full h-full p-6">
                    <p
                        class="line-clamp-1 w-full text-ellipsis text-lg font-semibold"
                    >
                        {draft[1].metadata?.title ?? "..."}
                    </p>
                    <p class="text-gray-500 mt-2 text-sm line-clamp-2">
                        {draft[1].metadata?.description ?? "No description"}
                    </p>
                </div>
            </a>
        {/each}
        {#if drafts.length === 0}
            <div class="flex flex-col items-center justify-center h-80 gap-6">
                <IconUfo size={28} class="rotate-[-12deg]" />
                <h4 class="">No drafts</h4>
                <button
                    on:click={create} 
                    class="btn_secondary w-40"
                >
                    Create a market
                </button>
            </div>
        {/if}
        <div />
    </div>
</ColumnLayout>
