<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import { draftsStore } from "$lib/marketDraftStore";
    import { goto } from "$app/navigation";
    import MainHeader from "$lib/components/header.svelte";
    import {
        IconCalendar,
        IconMoneybag,
        IconPlus,
        IconUfo,
    } from "@tabler/icons-svelte";
    import Pill from "$lib/elements/pill.svelte";
    import { usd } from "$lib/utils/format";

    $: drafts = Object.entries($draftsStore);
    const create = () => goto("/drafts/" + draftsStore.createDraft());
</script>

<ColumnLayout>
    <MainHeader slot="main-header">
        <p
            slot="center"
            class="text-black max-w-[14rem] overflow-hidden overflow-ellipsis"
        >
            {"Your Drafts"}
        </p>
        <button slot="right" class={`action_icon`} on:click={create}>
            <IconPlus size={20} />
        </button>
    </MainHeader>
    <div slot="main" class="grid grid-cols-2 gap-4 p-4">
        {#each Object.entries($draftsStore) as draft}
            <a
                href={`/drafts/${draft[0]}`}
                class="w-full flex flex-nowrap items-stretch rounded-xl ring-1 dark:bg-neutral-950/75 dark:ring-neutral-900 dark:hover:bg-neutral-950"
            >
                <div class="flex flex-col w-full h-full p-6">
                    <h4
                        class="line-clamp-1 w-full text-ellipsis text-lg font-semibold"
                    >
                        {draft[1].metadata?.title ?? "..."}
                    </h4>
                    <p class="text-gray-500 text-sm line-clamp-1">
                        {draft[1].metadata?.description ?? "No description"}
                    </p>
                    <div class="flex gap-2 mt-2">
                        {#if draft[1].date}
                            <Pill>
                                <IconCalendar size={14} />
                                {new Date(draft[1].date).toLocaleDateString()}
                            </Pill>
                        {/if}
                        <Pill>
                            <IconMoneybag size={14} />
                            {usd.format(draft[1].subsidy ?? 0)}
                        </Pill>
                    </div>
                </div>
            </a>
        {/each}
        {#if drafts.length === 0}
            <div class="flex flex-col items-center justify-center h-80 gap-6">
                <IconUfo size={28} class="rotate-[-12deg]" />
                <h4 class="">No drafts</h4>
                <button on:click={create} class="btn_secondary w-40">
                    Create a market
                </button>
            </div>
        {/if}
        <div />
    </div>
</ColumnLayout>
