<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { goto } from "$app/navigation";
    import { draftsStore } from "$lib/marketDraftStore";
    import debounce from "lodash/debounce.js";
    import {
        IconArrowRight,
        IconCircleOff,
        IconLoader,
        IconLoader2,
        IconPackageOff,
        IconSearch,
        IconX,
    } from "@tabler/icons-svelte";
    import { api } from "$lib/api";
    import { PublicKey } from "@solana/web3.js";
    import Dialog from "$lib/elements/dialog.svelte";
    import { result } from "lodash";
    import { onMount, tick } from "svelte";

    let searchTerm = "";
    let debouncedSearchTerm = "";
    let loading = false;
    let results = [] as TResult[];
    let selected = 0;

    onMount(() => {
        document.getElementById("search_input")?.focus();
    });

    const searchDebounce = debounce((e) => {
        debouncedSearchTerm = e;
        loading = true;
        api.searchMarkets
            .query({
                term: debouncedSearchTerm,
                limit: 8,
            })
            .then((rawResponse) => {
                let _results: TResult[] = [];
                if (!rawResponse.data) return _results;
                for (const res of rawResponse.data) {
                    try {
                        if (res.opMarket && res.opMarket.metadata)
                            _results.push({
                                id: new PublicKey(
                                    res.opMarket.data.data.AmmAddress
                                ).toBase58(),
                                title: res.opMarket.metadata.title,
                                description: res.opMarket.metadata.description,
                            });
                        if (res.pmMarket)
                            _results.push({
                                id: res.pmMarket.data.condition_id,
                                title: res.pmMarket.data.question,
                                description: res.pmMarket.data.description,
                            });
                    } catch (e) {
                        console.error(e);
                    }
                }
                results = _results;
                loading = false;
            })
            .catch((e) => {
                console.error(e);
                loading = false;
            });
    }, 400);

    type TResult = {
        id: string;
        title?: string;
        description?: string;
    };

    $: searchDebounce(searchTerm);

    const close = () => {
        modalStore.closeModal(Modal.search_markets);
    };

    const onKeyDown = async (
        e: KeyboardEvent & {
            currentTarget: EventTarget & HTMLDivElement;
        }
    ) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        switch (e.key) {
            case "ArrowUp":
                selected =
                    selected - 1 >= 0 ? selected - 1 : results.length - 1;
                break;

            case "ArrowDown":
                selected = selected + 1 < results.length ? selected + 1 : 0;
                break;

            case "Enter":
                close();
                close();
                if (results[selected].id) goto(`/${results[selected].id}`);
                break;

            case "Escape":
                close();
                break;

            default:
                break;
        }
        const resultList = document.getElementById("results");
        const element = resultList?.children.item(selected);
        if (element) {
            element.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    };
</script>

<Dialog open={$modalStore.search_markets} {close}>
    <div
        class="modal_card text-neutral-800 dark:text-neutral-300 divide-y divide-neutral-200 dark:divide-neutral-800"
        on:keydown={onKeyDown}
    >
        <div class="flex items-center px-5">
            <div
                class="pointer-events-none h-5 w-5 flex justify-center items-center"
            >
                {#if loading}
                    <IconLoader2 class="animate-spin" stroke={1.5} size={20} />
                {:else}
                    <IconSearch size={20} stroke={1.5} />
                {/if}
            </div>
            <input
                id="search_input"
                placeholder="Search markets"
                bind:value={searchTerm}
                class="h-16 w-full bg-transparent outline-none pl-4 pr-4 pt-1 text-md placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            <button class="action_icon ml-auto" on:click={close}>
                <IconX size={18} />
            </button>
        </div>
        <div
            id="results"
            class={`overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800 bg-neutral-100 dark:bg-neutral-900 md:max-h-96 md:h-96 ${
                loading ? "animate-pulse" : ""
            }`}
        >
            {#if results.length > 0}
                {#each results as res, i}
                    <a
                        href={`/${res.id}`}
                        class={`overflow-hidden group max-h-24 text-left p-4 flex flex-col gap-2 cursor-pointer hover:bg-white dark:hover:bg-neutral-800 ${
                            selected === i ? "bg-white dark:bg-neutral-800" : ""
                        }`}
                    >
                        <p
                            class="line-clamp-1 max-w-full dark:text-neutral-200 group-visited:dark:text-indigo-200 group-visited:text-indigo-900"
                        >
                            {res.title}
                        </p>
                        <p class="line-clamp-1 text-sm">
                            {res.description}
                        </p>
                    </a>
                {/each}
                <div />
            {:else}
                <div
                    class="p-2 py-10 h-full gap-2 flex flex-col items-center justify-center text-sm"
                >
                    <IconCircleOff size={20} stroke={1.5} />
                    <p>{`No markets found`}</p>
                </div>
            {/if}
        </div>
        <div class="p-4">
            <button
                on:click={() => goto("/drafts/" + draftsStore.createDraft())}
                class="btn_primary w-full"
            >
                <span>Create a market</span>
                <IconArrowRight stroke={1.5} size={20} />
            </button>
        </div>
    </div>
</Dialog>
