<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import { draftsStore } from "$lib/marketDraftStore.js";
    import { onMount } from "svelte";
    import {
        PUBLIC_OP_MAIN_PROGRAM_ADDR,
        PUBLIC_SOLANA_USDC_ADDR,
    } from "$env/static/public";
    import { PublicKey, Transaction } from "@solana/web3.js";
    // import {
    //     Dialog,
    //     DialogDescription,
    //     DialogOverlay,
    // } from "@rgossiaux/svelte-headlessui";
    import { web3Store } from "$lib/web3Store.js";
    import { goto } from "$app/navigation";
    import debounce from "lodash/debounce.js";
    import { Modal, modalStore } from "$lib/modals/modalStore.js";
    import base58 from "bs58";
    import { TxStatus, web3Workspace } from "$lib/web3Workspace.js";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import MainHeader from "$lib/components/header.svelte";
    import {
        IconCircleX,
        IconDotsVertical,
        IconHexagon3d,
        IconInfoCircle,
        IconMinus,
        IconPlus,
        IconTrash,
        IconX,
    } from "@tabler/icons-svelte";
    import { autoresizeTextarea } from "$lib/utils/dom.js";
    import { usd } from "$lib/utils/format.js";
    import { USDC_PER_DOLLAR, initMarketInstruction } from "$lib/utils/op.js";
    import { trpc } from "$lib/trpc.js";
    import { api } from "$lib/api.js";
    import InputWithSlider from "$lib/components/input_with_slider.svelte";
    import MenuButton from "$lib/components/menu_button.svelte";
    import { browser } from "$app/environment";
    import Dialog from "$lib/elements/dialog.svelte";

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
        preparing: "Preparing your request...",
        checkout: "Waiting for checkout...",
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
        const address = $web3Store?.solana?.address;
        const polyAddress = $web3Store?.polymarket?.address;
        const metadata = $draftsStore[data.draft_id].metadata;
        const usdcBalance = Number(
            $web3Store?.solanaUsdc?.balances.USDC?.amount ?? 0n
        );
        const marketAddress = base58.decode(data.draft_id);
        const subsidy =
            (($draftsStore[data.draft_id].subsidy ?? 0) / 100) *
            USDC_PER_DOLLAR;

        if (!address || !polyAddress) {
            modalStore.openModal(Modal.login);
            return;
        }

        const publicKey = new PublicKey(address);

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

        const ipfsResponse = await api.storeMarketIpfs.mutate(metadata);

        loadingMessage = loadingMessages.preparing;

        const instructions = await initMarketInstruction(
            new PublicKey(PUBLIC_SOLANA_USDC_ADDR),
            new PublicKey(PUBLIC_OP_MAIN_PROGRAM_ADDR),
            publicKey,
            ipfsResponse.cid,
            marketAddress,
            subsidy
        );

        if (usdcBalance < subsidy) {
            loadingMessage = loadingMessages.checkout;
            const toppedUp = await $web3Workspace.web3Sol
                .topup((subsidy - usdcBalance) / 100)
                .then(() => {
                    return true;
                })
                .catch((e) => {
                    errorMessage =
                        "Unable to fund your account. Please check the console.";
                    console.error(e);
                    return false;
                });
            if(!toppedUp) return;
        }

        loadingMessage = loadingMessages.signing;

        const signedTx = (await $web3Workspace.web3Sol.signTransaction([
            instructions,
        ])) as Transaction;

        console.log("Signed create market instruction: ", signedTx);

        loadingMessage = loadingMessages.sending;

        const res = await api.bridgeOpenPredictTransaction.query({
            amount: 100000,
            inputPolyWallet: polyAddress,
            opTransaction: base58.encode(
                signedTx.serialize({
                    requireAllSignatures: false,
                })
            ),
        });

        if (res.error) {
            errorMessage = `Unable to execute transaction: ${res.error}`;
            return;
        }

        loadingMessage = loadingMessages.redirecting;

        loadingMessage = loadingMessages.redirecting;
        setTimeout(() => {
            draftsStore.deleteDraft(data.draft_id);
            goto(`/${data.draft_id}`);
        }, 15000);

        // $web3Workspace.handleTransaction(
        //     [instructions],
        //     (s) => {
        //         switch (s) {
        //             case TxStatus.SIGNING:
        //                 loadingMessage = loadingMessages.signing;
        //                 break;
        //             case TxStatus.SENDING:
        //                 loadingMessage = loadingMessages.sending;
        //                 break;
        //             case TxStatus.CONFIRMING:
        //                 loadingMessage = loadingMessages.confirming;
        //                 break;
        //         }
        //     },
        //     (s, hash) => {
        //         loadingMessage = loadingMessages.redirecting;
        //         setTimeout(() => {
        //             draftsStore.deleteDraft(data.draft_id);
        //             goto(`/${data.draft_id}`);
        //         }, 15000);
        //     },
        //     (e) => {
        //         errorMessage = `Could not publish market. Error: ${e}`;
        //         loadingMessage = "";
        //     }
        // );
    }

    async function handlePublishMarket() {
        errorMessage = "";
        try {
            await publishMarket();
        } catch (e) {
            console.error(e);
            loadingMessage = "";
            errorMessage = "Error publishing your market: " + e;
        }
    }
</script>

<ColumnLayout>
    <MainHeader slot="main-header">
        <h3 slot="center" class="font-medium">Create a prediction market</h3>
        <MenuButton slot="right">
            <button
                on:click|stopPropagation|preventDefault={() => {
                    deleteModal = true;
                }}
                class="flex items-center gap-10 py-2 px-3 text-sm bg-neutral-900 text-neutral-300 font-medium hover:text-white hover:bg-neutral-800"
            >
                {`Delete draft`}
                <IconTrash size={14} />
            </button>
        </MenuButton>
    </MainHeader>
    <div
        slot="main"
        class="divide-y w-full max-w-full divide-neutral-200 dark:divide-neutral-900"
    >
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
        <div class="w-full max-w-full p-4 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <h4 class="text-xl font-semibold">Market details</h4>
                </div>
                <div
                    class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
                />
                <label for="title" class="w-full font-semibold">
                    {"Title"}
                    <span>
                        {""}
                    </span>
                </label>
                <textarea
                    id="title"
                    name="title"
                    rows={1}
                    placeholder="Question title"
                    bind:value={title}
                    use:autoresizeTextarea
                    class="basic_input text-base"
                />
                <label for="description" class="w-full font-semibold mt-4">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    bind:value={description}
                    use:autoresizeTextarea
                    placeholder="Describe your market and detail how you plan to resolve it."
                    rows={3}
                    class="basic_input text-base"
                />
                
                <div class="flex justify-between items-center mt-4">
                    <label for="title" class="w-full font-semibold">
                        {"Subsidy"}
                        <span>
                            {""}
                        </span>
                    </label>
                    <p class="text-xs whitespace-nowrap leading-none">
                        {`Balance (USD): ${
                            $web3Store?.solanaUsdc?.balances.USDC?.usd ??
                            "$0.00"
                        }`}
                    </p>
                </div>
                <InputWithSlider
                    step={100}
                    setSliderStep
                    onChange={(e) => {
                        const allowed = e.currentTarget.value.replace(
                            /[^0-9.]+/g,
                            ""
                        );
                        const num = parseFloat(allowed);
                        if (isNaN(num)) {
                            cents = defaultCents;
                        } else {
                            cents = num * 100;
                            e.currentTarget.value = usd.format(cents / 100); // sometimes wasn't updating
                        }
                    }}
                    bind:value={cents}
                    formatted={usd.format(cents / 100)}
                    max={10000}
                    min={0}
                />
            </div>
            <div class="flex flex-col gap-2 mt-4">
                <div class="flex justify-between items-center">
                    <h4 class="text-xl font-semibold">Summary</h4>
                </div>
                <div
                    class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
                />
                <div class="flex flex-col gap-4">
                    {#if errorMessage}
                        <div
                        class="flex gap-4 p-4 rounded-xl ring-1 bg-red-500/10 text-red-800 ring-red-400 dark:text-white dark:ring-red-950"
                        >
                        <IconCircleX />
                        <div>
                            {errorMessage}
                        </div>
                    </div>
                    {/if}
                    {#if cents / 100 > ($web3Store?.solanaUsdc?.balances?.USDC?.ui ?? 0)}
                        <div
                            class="flex gap-4 p-4 rounded-xl ring-1 bg-indigo-500/10 text-indigo-800 ring-indigo-400 dark:text-white dark:ring-indigo-950"
                        >
                            <IconInfoCircle size={24} />
                            {`You will be redirected to a payment form to fund your account.`}
                        </div>
                    {/if}
                    <button
                        class={"btn_primary mt-2"}
                        on:click={handlePublishMarket}
                    >
                        {`Create market`}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div slot="right">
        
    </div>
</ColumnLayout>

<Dialog open={deleteModal} close={() => (deleteModal = false)}>
    <div class="modal_card md:max-w-sm p-4 gap-4">
        <h3
            class="text-left font-semibold text-lg text-neutral-800 dark:text-white whitespace-pre-wrap"
        >
            Delete this draft?
        </h3>
        <div class="flex flex-nowrap gap-2 w-full mt-2">
            <button
                class="btn_secondary w-full"
                on:click={() => (deleteModal = false)}
                >
                Cancel
            </button>
            <button
                class="bg-red-500 w-full p-2 text-white font-semibold text-sm rounded-xl"
                on:click={() => deleteDraft()}
            >
                Delete
            </button>
        </div>
    </div>
</Dialog>
