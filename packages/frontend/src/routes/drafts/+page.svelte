<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import { draftsStore } from "$lib/marketDraftStore";
    import { goto } from "$app/navigation";
    import MainHeader from "$lib/components/header.svelte";
    import { IconPlus } from "@tabler/icons-svelte";
</script>

<ColumnLayout>
    <MainHeader slot="main-header">
        <div
            class="text-sm w-full flex flex-col justify-center items-center line-clamp-1 overflow-ellipsis"
        >
            <p
                class="text-black max-w-[14rem] overflow-hidden overflow-ellipsis"
            >
                {"Your Drafts"}
            </p>
        </div>
        <button
            class={`p-2 ml-auto rounded-full text-white font-semibold cursor-pointer bg-black hover:bg-gray-800`}
            on:click={() => goto("/drafts/" + draftsStore.createDraft())}
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
        <div />
    </div>
    <div slot="right">
        <div
            class="w-full bg-white mt-4 ring-1 rounded-2xl ring-gray-200 p-8 flex flex-col gap-4"
        >
            <p class="text-sm text-gray-600">
                Warning: all drafts are saved locally
            </p>
        </div>
    </div>
</ColumnLayout>
