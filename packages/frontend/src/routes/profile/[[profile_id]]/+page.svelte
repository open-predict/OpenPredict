<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import { PublicKey } from "@solana/web3.js";
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui";
    import { PUBLIC_MAIN_PROGRAM_ID } from "$env/static/public";
    import {
        autoresizeTextarea,
        generateProfileImage,
        readablePublicKey,
        createProfileInstruction,
        TxStatus,
        getChance,
        USDC_PER_DOLLAR,
    } from "$lib/utils";
    import { trpcc } from "$lib/trpc.js";
    import SuperJSON from "superjson";
    import MarketCardSmall from "$lib/components/market_card_small.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore.js";
    import AccountSummary from "$lib/components/account_summary.svelte";
    import IconLoading from "@tabler/icons-svelte/dist/svelte/icons/IconLoader.svelte";
    import { page } from "$app/stores";
    import CopyButton from "$lib/elements/copy_button.svelte";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import debounce from "lodash/debounce.js";
    import MainHeader from "$lib/components/main_header.svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import type { TProfilePageData } from "./+page.js";

    export let data;
    let { profile, markets, id, positions } =
        SuperJSON.deserialize<TProfilePageData>(data);

    enum Tabs {
        // Activity = "activity",
        Markets = "markets",
        Positions = "positions",
    }

    let currentTab = Tabs.Markets;
    let showHeader = false;
    let creatingUsername = false;
    let editingProfile = false;
    let name = "";
    // let image = "";
    let username = "";
    let description = "";

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";
    let usernameTaken = false;

    $: ({ solanaAddress } = $web3Workspace);
    $: $page.url.pathname, refreshProfile();


    const usernameDebounce = debounce((n: string) => {
        checkUsername(n)
    }, 100);

    $: usernameDebounce(username);

    async function checkUsername(un: string): Promise<void> {
        if(!un) return;
        usernameTaken = await trpcc.checkUsername.query({
            name: un
        })
    }

    async function refreshProfile() {
        const split = $page.url.pathname.split("/");
        const urlId = split.length > 1 ? split[2] : undefined;
        id = urlId
            ? urlId
            : $web3Store?.solanaAddress
            ? $web3Store?.solanaAddress
            : null;
        if (!id || id.length < 32) {
            profile = null;
            positions = undefined;
            markets = undefined;
            if(browser) goto("/")
            return;
        }
        const profileRes = await trpcc.getUser.query({
            userId: [id],
        });

        profile = await profileRes.get(id);
        name = profile?.metadata.name ?? "";
        description = profile?.metadata.description ?? "";
        username = profile?.username ?? "";

        positions = await trpcc.getMarketAccounts.query({
            userId: id,
        });
        markets = await trpcc.getUserMarkets.query({
            userId: id,
        });
    }
    
    async function saveProfile(initUsername: boolean = false) {
        if (!solanaAddress) return;

        if (initUsername) {
            if (!username) {
                alert("Please set a valid username");
                return;
            }
            if (!!profile?.username) {
                alert("You cannot change your username.");
                return;
            }
        }

        loadingMessage = "Saving with IPFS...";

        const ipfsResponse = await trpcc.storeUserProfileIpfs.mutate({
            version: 0,
            links: [],
            description: description,
            name: name,
        });

        loadingMessage = "Preparing instructions...";

        const instructions = await createProfileInstruction(
            new PublicKey(solanaAddress),
            initUsername ? username : (profile?.username as string),
            new PublicKey(PUBLIC_MAIN_PROGRAM_ID),
            ipfsResponse.cid
        );

        await $web3Workspace.handleTransaction(
            [instructions],
            (s) => {
                switch (s) {
                    case TxStatus.SIGNING:
                        loadingMessage = "Signing transaction...";
                        break;
                    case TxStatus.SENDING:
                        loadingMessage = "Sending transaction...";
                        break;
                    case TxStatus.CONFIRMING:
                        loadingMessage = "Confirming transaction...";
                }
            },
            async (h, s) => {
                await refreshProfile();
                loadingMessage = "";
                completedMessage = "Profile saved!";
            },
            (e) => {
                loadingMessage = "";
                if (e instanceof Error) {
                    errorMessage = e.message;
                } else {
                    errorMessage =
                        "Couldn't save your profile. Please try again.";
                }
            }
        );
    }
</script>

<ColumnLayout>
    <MainHeader slot="main-header" fadeHeader />
    <div slot="main" class="flex flex-col bg-white">
        <div class="h-40 w-full object-cover -mt-16 bg-gradient-to-br from-sky-100 to-indigo-200" />
        <div
            class="rounded-full -mt-16 ring-4 ring-white bg-gray-500 h-32 w-32 ml-8 overflow-hidden"
        >
            {#if id}
                <img
                    src={generateProfileImage(id)}
                    alt="profile"
                />
            {/if}
        </div>
        <div class="p-4 -mt-16 h-16 w-2/3 ml-auto flex flex-col items-end">
            {#if id}
                <p
                    class={`text-xs text-gray-500 rounded-md flex items-center gap-1.5`}
                >
                    {`${id ? readablePublicKey(new PublicKey(id)) : "n/a"}`}
                    <CopyButton value={id} />
                </p>
            {/if}
        </div>
        <div class="flex flex-col p-8 gap-2 items-start">
            <p
                class={`text-xl font-semibold ${
                    !profile?.metadata.name ? "text-gray-400" : ""
                }`}
            >
                {!!profile?.metadata.name ? profile?.metadata.name : "- -"}
            </p>
            <p
                class={`text-sm px-1.5 py-0.5 bg-gray-200 rounded-md flex items-center gap-1.5`}
            >
                <span class="text-gray-500">
                    {"@"}
                </span>
                {profile?.username
                    ? profile.username
                    : id
                    ? readablePublicKey(new PublicKey(id))
                    : ""}
            </p>
            {#if profile?.metadata.description}
                <p
                    class={`mt-4 ${
                        !profile?.metadata.description ? "text-gray-400" : ""
                    }`}
                >
                    {profile?.metadata.description ?? "No description"}
                </p>
            {/if}
        </div>
        {#if id && solanaAddress && id === solanaAddress}
            <div class="px-8 pb-8 flex gap-2">
                {#if !profile?.username}
                    <button
                        class="btn_primary px-6 mt-6"
                        on:click={() => (creatingUsername = true)}
                    >
                        Claim username
                    </button>
                {:else}
                    <button
                        class="btn_secondary px-6 mt-6"
                        on:click={() => (editingProfile = true)}
                    >
                        Edit profile
                    </button>
                {/if}
            </div>
        {/if}
        <nav class="flex space-x-8 px-8 border-b border-gray-200">
            {#each Object.entries(Tabs) as [_t, tab]}
                <button
                    on:click={() => (currentTab = tab)}
                    aria-current={currentTab === tab ? "page" : undefined}
                    class={`flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                        tab === currentTab
                            ? "border-black text-black"
                            : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                    }`}
                >
                    {_t}
                    <span
                        class={`ml-3 hidden rounded-full py-0.5  px-2.5 text-xs font-medium md:inline-block ${
                            tab === currentTab
                                ? "bg-gray-700 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {#if tab === Tabs.Positions}
                            {positions?.size ?? 0}
                        {/if}
                        {#if tab === Tabs.Markets}
                            {markets?.size ?? 0}
                        {/if}
                    </span>
                </button>
            {/each}
        </nav>
        <div class="divide-y divide-gray-200">
            {#if currentTab === Tabs.Positions}
                {#if positions && solanaAddress}
                    {#each Array.from(positions) as [market, marketUserChaindata]}
                        <a
                            href={`/${market}`}
                            class="flex flex-col p-8 gap-2 pb-4"
                        >
                            <div>
                                <p class="text-gray-800 text-md">
                                    {marketUserChaindata?.market?.metadata
                                        ?.title ?? "No title found"}
                                </p>
                            </div>
                            <div
                                class="w-full flex flex-nowrap justify-between items-center"
                            >
                                <p class="font-semibold text-gray-900">
                                    {(
                                        getChance(
                                            marketUserChaindata.market.data.data
                                                .Yes,
                                            marketUserChaindata.market.data.data
                                                .No
                                        ) * 100
                                    ).toFixed(1)}%
                                </p>
                                <div
                                    class="flex flex-col justify-center items-end"
                                >
                                    <p class={`text-base`}>
                                        {Math.abs(
                                            Number(
                                                marketUserChaindata.account
                                                    .Shares
                                            ) / USDC_PER_DOLLAR
                                        ).toFixed(2)}
                                        <span
                                            class={Number(
                                                marketUserChaindata.account
                                                    .Shares
                                            ) /
                                                USDC_PER_DOLLAR >
                                            0
                                                ? "text-green-500"
                                                : "text-red-500"}
                                        >
                                            {Number(
                                                marketUserChaindata.account
                                                    .Shares
                                            ) /
                                                USDC_PER_DOLLAR >
                                            0
                                                ? "YES"
                                                : "NO"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </a>
                    {/each}
                {/if}
            {/if}
            {#if currentTab === Tabs.Markets}
                {#if markets}
                    {#each Array.from(markets) as [address, chainData]}
                        <div class="hover:bg-white">
                            <a href={`/${address}`}>
                                <MarketCardSmall market={chainData} />
                            </a>
                        </div>
                    {/each}
                {/if}
            {/if}
            <div />
        </div>
    </div>
    <div slot="right">
        {#if $web3Store?.solanaAddress}
            <div class="bg-white ring-1 rounded-3xl ring-gray-200">
                <AccountSummary />
            </div>
        {/if}
    </div>
</ColumnLayout>

<Dialog
    open={creatingUsername}
    on:close={() => (creatingUsername = false)}
    class="modal_root"
>
    <DialogOverlay class="modal_overlay" />

    <div class="modal_card">
        <LoadingOverlay
            {loadingMessage}
            {errorMessage}
            {completedMessage}
            onClose={() => {
                if (!errorMessage) {
                    editingProfile = true;
                }
                loadingMessage = "";
                errorMessage = "";
                completedMessage = "";
            }}
        />

        <div class="p-8 text-left flex gap-4 flex-col">
            <h4 class="text-xl font-semibold">Claim a username</h4>
            {#if usernameTaken}
                <div
                    class={`bg-red-500/10 text-red-700 px-4 py-2.5 rounded-2xl flex items-center text-left gap-4 w-full`}
                >
                    <p class="text-md">
                        {`The username '${username}' has already been claimed.`}
                    </p>
                </div>
            {/if}
            <input
                id="username"
                name="username"
                placeholder="Username..."
                bind:value={username}
                class="block w-full rounded-xl border-0 py-2 px-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:leading-6"
            />
        </div>
        <div class="flex flex-col p-4 gap-2.5">
            <div
                class={`bg-red-500/10 text-red-700 px-4 py-2.5 rounded-2xl flex items-center text-left gap-4 w-full`}
            >
                <p class="text-md">
                    {`WARNING: you cannot change your username once it has been set.`}
                </p>
            </div>
            <button
                class={`btn_primary`}
                on:click={() => saveProfile(true)}
                disabled={!!loadingMessage}
            >
                {#if loadingMessage}
                    <IconLoading class="animate-spin" />
                    {loadingMessage}
                {:else}
                    Save
                {/if}
            </button>
        </div>
    </div>
</Dialog>

<Dialog
    open={editingProfile}
    on:close={() => (editingProfile = false)}
    class="modal_root"
>
    <DialogOverlay class="modal_overlay" />

    <div class="modal_card">
        <LoadingOverlay
            {loadingMessage}
            {errorMessage}
            {completedMessage}
            onClose={() => {
                if (!errorMessage) {
                    creatingUsername = false;
                    editingProfile = false;
                }
                loadingMessage = "";
                errorMessage = "";
                completedMessage = "";
            }}
        />
        <div class="p-8 text-left flex gap-4 flex-col">
            <h4 class="text-xl font-semibold">Edit your profile</h4>
            <input
                id="name"
                name="name"
                placeholder="Full name..."
                bind:value={name}
                class="block w-full rounded-xl border-0 py-2 px-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:leading-6"
            />
            <textarea
                bind:value={description}
                use:autoresizeTextarea
                name="description"
                placeholder="Description..."
                rows={3}
                id="description"
                class="mt-2 w-full rounded-xl border-0 py-2 px-4 text-gray-900 bg-gray-100 ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            />
        </div>
        <div class="flex flex-col p-4 gap-2.5">
            <button
                class={`btn_primary`}
                disabled={!!loadingMessage}
                on:click={() => saveProfile(false)}
            >
                {#if loadingMessage}
                    <IconLoading class="animate-spin" />
                    {loadingMessage}
                {:else}
                    Save
                {/if}
            </button>
        </div>
    </div>
</Dialog>
