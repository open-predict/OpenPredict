<script lang="ts">
    import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    import IconSearch from "@tabler/icons-svelte/dist/svelte/icons/IconSearch.svelte";
    import IconArrowRight from "@tabler/icons-svelte/dist/svelte/icons/IconArrowRight.svelte";
    import IconPackageOff from "@tabler/icons-svelte/dist/svelte/icons/IconPackageOff.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { Spinner } from "flowbite-svelte";
    import { trpcc } from "$lib/trpc";
    import { goto } from "$app/navigation";
    import { draftsStore } from "$lib/marketDraftStore";
    import debounce from "lodash/debounce.js";

    let searchTerm = "";
    let debouncedSearchTerm = "";

    const searchDebounce = debounce((e) => {
        debouncedSearchTerm = e;
    }, 200);

    $: searchDebounce(searchTerm);

    $: result = trpcc.searchMarkets.query({
        term: debouncedSearchTerm,
        limit: 20,
    });
</script>

<Dialog
    open={$modalStore.search_markets}
    on:close={() =>{ 
        modalStore.closeModal(Modal.search_markets)
    }}
    class="modal_root"
>
    <DialogOverlay class="modal_overlay" />
    <div
        class="modal_card lg:relative"
    >
        <div
            class="pointer-events-none absolute left-5 top-6 h-5 w-5 text-gray-400"
        >
            <IconSearch size={20} stroke={1.5} />
        </div>
        <input
            placeholder="Search markets"
            bind:value={searchTerm}
            class="h-16 w-full bg-transparent outline-none pl-14 pr-4 pt-1 text-gray-900 placeholder:text-gray-400 text-md"
        />
        <div class="overflow-y-auto flex-1 divide-y divide-gray-200">
            {#await result}
                <div
                    class="p-2 py-10 gap-1 flex items-center justify-center text-gray-400 text-sm bg-gray-100"
                >
                    <Spinner size="4" />
                    <p class="ml-1">Getting markets...</p>
                </div>
            {:then res}
                {#if res.markets.length > 0}
                    {#each res.markets as market}
                        <div
                            on:keypress={() => {}}
                            on:click={() => {
                                console.log(`/${market.data.data.AmmAddress}`);
                            }}
                            class="overflow-hidden bg-gray-50 max-h-24 text-left p-4 flex flex-col gap-2 hover:bg-white cursor-pointer"
                        >
                            <p class="line-clamp-1 max-w-full">
                                {market.metadata
                                    ? market.metadata.title
                                    : "No title"}
                            </p>
                            <p class="line-clamp-2 text-xs text-gray-500">
                                {market.metadata
                                    ? market.metadata.description
                                    : "No descrip"}
                            </p>
                        </div>
                    {/each}
                {:else}
                    <div
                        class="p-2 py-10 gap-1 flex items-center justify-center text-gray-400 text-sm bg-gray-100"
                    >
                        <IconPackageOff size={20} stroke={1.5} />
                        <p class="">{`No markets found`}</p>
                    </div>
                {/if}
            {:catch err}
                <div
                    class="p-2 py-8 flex flex-col items-center justify-center text-gray-500"
                >
                    <IconPackageOff size={20} stroke={1.5} />
                    <p>{"Error: " + err}</p>
                </div>
            {/await}
        </div>
        <div class="p-2">
            <button
                on:click={() => goto("/drafts/" + draftsStore.createDraft())}
                class="flex gap-2 justify-center items-center px-2 py-3 bg-gray-800 text-white text-sm font-semibold rounded-full w-full hover:bg-black"
            >
                <span>New market</span>
                <IconArrowRight stroke={1.5} size={20} />
            </button>
        </div>
    </div>
</Dialog>
