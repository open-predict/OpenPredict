<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte";
    import IconX from "@tabler/icons-svelte/dist/svelte/icons/IconX.svelte";
    import { draftsStore } from "$lib/marketDraftStore.js";
    import { onMount } from "svelte";
    import {
        PUBLIC_MAIN_PROGRAM_ID,
        PUBLIC_USDC_MINT_ADDR,
    } from "$env/static/public";
    import { PublicKey } from "@solana/web3.js";
    import {
        Dialog,
        DialogDescription,
        DialogOverlay,
    } from "@rgossiaux/svelte-headlessui";
    import { web3Store } from "$lib/web3Store.js";
    import { goto } from "$app/navigation";
    import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
    import IconMinus from "@tabler/icons-svelte/dist/svelte/icons/IconMinus.svelte";
    import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader2.svelte";
    import {
        USDC_PER_DOLLAR,
        TxStatus,
        autoresizeTextarea,
        usdFormatter,
        initMarketInstruction,
    } from "$lib/utils.js";
    import debounce from "lodash/debounce.js";
    import { Modal, modalStore } from "$lib/modals/modalStore.js";
    import base58 from "bs58";
    import { trpcc } from "../../../lib/trpc.js";
    import { web3Workspace } from "$lib/web3Workspace.js";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import MainHeader from "$lib/components/main_header.svelte";

    export let data;

    $: draft = $draftsStore[data.draft_id];

    let title = "";
    let description = "";

    let cents = 500; // cents
    const centsStep = 100;
    let defaultCents = 1000;

    let deleteModal = false;
    let loading = false;
    let setInitial = false;

    const loadingMessages = {
        ipfs: "Saving your market details with IPFS...",
        signing: "Signing your transaction...",
        sending: "Sending your transaction to the network...",
        confirming: "Confirming the transaction...",
        redirecting: "Redirecting you to your market...",
    };

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";

    onMount(() => {
        const draft = $draftsStore[data.draft_id];
        if (draft.metadata) {
            title = draft.metadata.title;
            description = draft.metadata.description;
        } else {
            alert("something went wrong parsing this draft");
        }
        if (draft.subsidy) {
            cents = draft.subsidy;
        }
        setInitial = true;
    });

    const titleDebounce = debounce((e) => {
        draftsStore.updateMetadata(data.draft_id, "title", e);
    }, 100);

    const descripDebounce = debounce((e) => {
        draftsStore.updateMetadata(data.draft_id, "description", e);
    }, 100);

    $: if (setInitial) titleDebounce(title);
    $: if (setInitial) descripDebounce(description);
    $: if (setInitial) draftsStore.updateSubsidy(data.draft_id, cents);

    function deleteDraft() {
        draftsStore.deleteDraft(data.draft_id);
        goto("/drafts");
    }

    async function publishMarket() {
        const publicKey = $web3Store?.publicKey;
        const usdcAmount = $web3Store?.usdc?.amount;
        const metadata = $draftsStore[data.draft_id].metadata;
        const marketAddress = base58.decode(data.draft_id);
        const subsidy =
            (($draftsStore[data.draft_id].subsidy ?? 0) / 100) *
            USDC_PER_DOLLAR;

        if (!publicKey) {
            modalStore.openModal(Modal.login);
            return;
        }

        // if (!usdcAmount || Number(usdcAmount) < subsidy) {
        //     alert("Will add swap to instruction set ")
        //     return;
        // }

        if (!subsidy) {
            errorMessage = "Please make the market subsidy greater than 0";
            return;
        }

        if (subsidy > USDC_PER_DOLLAR * 50) {
            errorMessage =
                "Please make the market subsidy less than $50. Subsidies are capped while OpenPredict is in beta.";
            return;
        }

        if (!metadata || !metadata.title) {
            errorMessage = "Please fill in the market title and description";
            return;
        }

        loadingMessage = loadingMessages.ipfs;

        const ipfsResponse = await trpcc.storeMarketIpfs.mutate(metadata);

        const instructions = await initMarketInstruction(
            new PublicKey(PUBLIC_USDC_MINT_ADDR),
            new PublicKey(PUBLIC_MAIN_PROGRAM_ID),
            publicKey,
            ipfsResponse.cid,
            marketAddress,
            subsidy
        );

        const neededUsdc = !$web3Store.usdc
            ? subsidy
            : parseInt($web3Store.usdc.amount) - subsidy < 0
            ? subsidy - parseInt($web3Store.usdc.amount)
            : undefined;
        $web3Workspace.handleTransaction(
            [instructions],
            (s) => {
                switch (s) {
                    case TxStatus.SIGNING:
                        loadingMessage = loadingMessages.signing;
                        break;
                    case TxStatus.SENDING:
                        loadingMessage = loadingMessages.sending;
                        break;
                    case TxStatus.CONFIRMING:
                        loadingMessage = loadingMessages.confirming;
                        break;
                }
            },
            (s, hash) => {
                loadingMessage = loadingMessages.redirecting;
                setTimeout(() => {
                    draftsStore.deleteDraft(data.draft_id);
                    goto(`/${data.draft_id}`);
                }, 15000);
            },
            (e) => {
                errorMessage = `Could not publish market. Error: ${e}`;
                loadingMessage = "";
            }
        );
    }

    async function handlePublishMarket() {
        errorMessage = "";
        try {
            await publishMarket();
        } catch (e) {
            console.error(e);
            errorMessage = "Error publishing your market. Check the console.";
        }
    }
</script>

<ColumnLayout>
    <MainHeader slot="main-header">
        <button
            class="rounded-full p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-200 ml-auto"
            on:click={() => (deleteModal = true)}
        >
            <IconTrash stroke={1.5} size={20} />
        </button>
    </MainHeader>
    <div slot="main" class="min-h-full">
        <LoadingOverlay
            {loadingMessage}
            {errorMessage}
            {completedMessage}
            onClose={() => {
                if (loadingMessage) {
                    return;
                }
                loadingMessage = "";
                errorMessage = "";
                completedMessage = "";
            }}
        />
        {#if !!draft}
            <div class="flex flex-col px-10 py-10">
                {#if errorMessage}
                    <div
                        class="px-4 py-2 mb-4 ring-1 rounded-xl ring-red-500 bg-red-50"
                    >
                        <div
                            class="font-semibold text-red-600 text-sm flex items-center justify-between"
                        >
                            <span>Error:</span>
                            <button
                                on:click={() => (errorMessage = "")}
                                class="p-1"
                            >
                                <IconX size={20} stroke={2} />
                            </button>
                        </div>
                        <p class="text-red-500 text-sm pb-2">
                            {errorMessage}
                        </p>
                    </div>
                {/if}
                <label for="title" class="mt-2 text-sm text-gray-600">
                    Title *
                </label>
                <textarea
                    id="title"
                    name="title"
                    rows={1}
                    placeholder="Question title"
                    bind:value={title}
                    use:autoresizeTextarea
                    class="mt-2 w-full rounded-xl border-0 py-1.5 px-3 text-gray-900 bg-gray-100 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                />

                <label for="description" class="mt-10 text-sm text-gray-600">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    bind:value={description}
                    use:autoresizeTextarea
                    placeholder="Describe your market and detail how you plan to resolve it."
                    rows={3}
                    class="mt-2 w-full rounded-xl border-0 py-1.5 px-3 text-gray-900 bg-gray-100 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                />

                <div
                    class="mt-10 pt-10 bg-white ring-1 ring-gray-200 shadow-sm rounded-2xl p-3 px-6 flex flex-col justify-center items-center gap-4"
                >
                    <p
                        class="text-gray-600 flex gap-2 justify-center items-center"
                    >
                        {`Market subsidy`}
                    </p>
                    <div
                        class="w-full flex justify-center items-center gap-2 py-12"
                    >
                        <button
                            on:click={() =>
                                (cents = Math.max(cents - centsStep, 0))}
                            class="p-1 ring-1 rounded-full ring-gray-300 text-gray-400 hover:text-gray-600 hover:ring-gray-400 hover:bg-gray-100"
                        >
                            <IconMinus size={20} />
                        </button>
                        <input
                            type="string"
                            value={usdFormatter.format(cents / 100)}
                            on:change={(e) => {
                                const allowed = e.currentTarget.value.replace(
                                    /[^0-9.]+/g,
                                    ""
                                );
                                const num = parseFloat(allowed);
                                if (isNaN(num)) {
                                    cents = defaultCents;
                                } else {
                                    cents = num * 100;
                                    e.currentTarget.value = usdFormatter.format(
                                        cents / 100
                                    ); // sometimes wasn't updating
                                }
                            }}
                            class="text-4xl max-w-[12rem] sm:max-w-[16rem] text-center text-black outline-none"
                        />
                        <button
                            class="p-1 ring-1 rounded-full ring-gray-300 text-gray-400 hover:text-gray-600 hover:ring-gray-400 hover:bg-gray-100"
                            on:click={() => (cents = cents + centsStep)}
                        >
                            <IconPlus size={20} />
                        </button>
                    </div>
                    <button
                        class={`w-full p-2.5 rounded-full text-white font-semibold cursor-pointer bg-black hover:bg-gray-800`}
                        on:click={handlePublishMarket}
                    >
                        {`Create market`}
                    </button>
                    <p class="text-sm text-gray-500">
                        {`You have ${usdFormatter.format($web3Store?.usdc?.uiAmount ?? 0)}`}
                    </p>
                </div>
            </div>
        {/if}
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

<Dialog
    open={deleteModal}
    on:close={() => (deleteModal = false)}
    class="fixed inset-0 z-10 overflow-y-auto flex min-h-full items-center justify-center text-center"
>
    <DialogOverlay
        class="fixed inset-0 bg-white/80 transition-opacity blur-md"
    />
    <div
        class="bg-white z-10 max-w-xs w-80 ring-1 ring-gray-200 shadow-2xl rounded-2xl p-4 flex justify-center flex-col gap-2 text-left"
    >
        <DialogDescription as="p" class="text-gray-600">
            Are you sure you want to delete this draft?
        </DialogDescription>
        <div class="flex flex-nowrap gap-2 w-full mt-2">
            <button
                class="bg-red-500 w-full p-2 text-white font-semibold text-sm rounded-xl"
                on:click={() => deleteDraft()}
            >
                Delete
            </button>
            <button
                class="bg-gray-200 w-full p-2 text-gray-800 font-semibold text-sm rounded-xl"
                on:click={() => (deleteModal = false)}
            >
                Cancel
            </button>
        </div>
    </div>
</Dialog>
