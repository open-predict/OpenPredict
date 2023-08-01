<script>
    import IconCards from "@tabler/icons-svelte/dist/svelte/icons/IconCards.svelte";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUserCircle.svelte";
    import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
    import IconBack from "@tabler/icons-svelte/dist/svelte/icons/IconArrowLeft.svelte";
    import IconWallet from "@tabler/icons-svelte/dist/svelte/icons/IconWallet.svelte";
    import IconSearch from "@tabler/icons-svelte/dist/svelte/icons/IconSearch.svelte";
    import IconGithub from "@tabler/icons-svelte/dist/svelte/icons/IconBrandGithub.svelte";
    import IconDiscord from "@tabler/icons-svelte/dist/svelte/icons/IconBrandDiscord.svelte";
    import IconPencil from "@tabler/icons-svelte/dist/svelte/icons/IconEditCircle.svelte";
    import UserButton from "./user_button.svelte";
    import Login from "./login.svelte";
    import { goto } from "$app/navigation";
    import { draftsStore } from "$lib/marketDraftStore";
    import { web3Store } from "$lib/web3Store";
    import { browser } from "$app/environment";
    import Logo from "./logo.svelte";
    import NavItem from "./nav_item.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    export let transparentHeader = false;
    $: locationSplit = browser ? window.location.pathname.split("/") : [];

    $: creatingMarket = browser
        ? window.location.href.includes("/drafts/")
        : false;

    const links = [
        { name: "Markets", href: "/", Icon: IconCards },
        // { name: "Activity", href: "/activity", Icon: IconActivity },
        // { name: "My Markets", href: "/markets", Icon: IconNotebook },
        { name: "Drafts", href: "/drafts", Icon: IconPencil },
        { name: "Profile", href: `/profile`, Icon: IconUser },
        // { name: "Github", href: `github.com`, Icon: IconUser },
    ];
</script>

<div
    id="column_layout_root"
    class="absolute top-0 bottom-0 right-0 left-0 grid md:grid-cols-11 lg:grid-cols-12 xl:grid-cols-10 items-stretch"
>
    <!-- left column -->
    <header
        class="sticky top-0 hidden md:block md:col-span-1 lg:col-span-3 xl:col-span-3"
    >
        <div class="sticky top-0 ml-auto max-w-sm max-h-[calc(100%-48px)] h-full">
            <!-- desktop navigation -->
            <a
                href="/"
                class="flex justify-center px-4 gap-2 lg:px-12 lg:pl-9 lg:justify-start items-center h-16"
            >
                <Logo />
                <h1
                    class="hidden lg:block text-md font-extrabold xl:text-lg text-black"
                >
                    OpenPredict
                </h1>
                <span
                    class="hidden xl:block text-xs text-gray-700 bg-white ring-1 ring-gray-400 rounded-full p-0.5 px-2 ml-auto"
                >
                    BETA
                </span>
            </a>
            <div class="flex flex-col px-2 lg:px-4 xl:pr-8 h-full max-h-[calc(100%-48px)]">
                <div
                    class="flex rounded-3xl p-4 flex-col justify-center items-center gap-8 lg:gap-4 bg-white ring-1 ring-gray-200"
                >
                    {#each links as link}
                        <NavItem LinkDef={link} />
                    {/each}
                    {#if !creatingMarket}
                        <button
                            on:click={() =>
                                goto("/drafts/" + draftsStore.createDraft())}
                            class={`btn_primary h-12 hidden lg:flex w-full`}
                        >
                            Create market
                        </button>
                        <button
                            on:click={() =>
                                goto("/drafts/" + draftsStore.createDraft())}
                            class="lg:hidden rounded-full flex flex-col justify-center items-center text-gray-500"
                        >
                            <div class="p-1 bg-black rounded-full text-white">
                                <IconPlus size={30} />
                            </div>
                        </button>
                    {/if}
                </div>
                <div
                    class="flex rounded-3xl p-4 flex-col justify-center items-center gap-8 lg:gap-4  mt-auto"
                >
                    <NavItem
                        LinkDef={{
                            name: "Discord",
                            href: `https://discord.gg/k7NymNAS7h`,
                            Icon: IconDiscord,
                        }}
                    />
                    <NavItem
                        LinkDef={{
                            name: "Github",
                            href: `https://github.com/open-predict/OpenPredict`,
                            Icon: IconGithub,
                        }}
                    />
                </div>
            </div>
            <div class="pr-8 py-4 pl-4 text-xs overflow-clip" />
        </div>
        <slot name="left" />
    </header>

    <!-- center column -->
    <main
        class={`relative col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 bg-gray-50`}
    >
        <!-- mobile banner -->
        {#if !$web3Store?.publicKey}
            <div
                class="md:hidden w-full h-8 flex items-center p-0.5 px-4 pr-1 gap-2 fill-white text-white bg-black"
            >
                <Logo size={18} />
                <p class="text-[0.8rem] font-semibold">OpenPredict</p>
                <button
                    on:click={() => modalStore.openModal(Modal.login)}
                    class="text-xs underline rounded-full text-white p-0.5 px-3 font-semibold ml-auto"
                >
                    Signup / Login
                </button>
            </div>
        {/if}

        <!-- main header -->
        <div
            class={`sticky flex whitespace-nowrap justify-center items-center top-0 z-10 h-16 py-3.5 px-4 gap-4 w-full overflow-hidden border-b border-r border-l border-gray-200 ${
                transparentHeader ? "bg-white/10" : "bg-white/90"
            }`}
        >
            {#if locationSplit.length > 1 && locationSplit[1] !== ""}
                <button
                    class="rounded-full p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-200 mr-2"
                    on:click={() => window.history.back()}
                >
                    <IconBack size={20} />
                </button>
            {:else}
                <div class="md:hidden">
                    <UserButton />
                </div>
            {/if}
            <slot name="main-header" />
        </div>

        <!-- main content -->
        <div
            class="w-full border-r border-l border-gray-200 pb-16"
            style="min-height: calc(100% - 4rem)"
        >
            <slot name="main" />
        </div>

        <!-- main footer -->
        {#if $$slots["main-footer"]}
            <div
                class="sticky bottom-16 md:bottom-0 h-16 w-full overflow-visible shadow-2xl border-r border-l border-gray-200"
            >
                <slot name="main-footer" />
            </div>
        {/if}
    </main>

    <!-- mobile navigation -->
    <nav
        class="fixed bottom-0 flex justify-evenly md:hidden items-center gap-6 w-full h-16 bg-white/90 border-t border-gray-200"
    >
        <a
            href="/"
            class="h-full pt-2 rounded-full flex flex-col justify-center items-center text-black"
        >
            <IconCards />
            <span class="text-[0.7rem] mt-1"> Markets </span>
        </a>
        <button
            on:click={() => modalStore.openModal(Modal.search_markets)}
            class="h-full pt-2 rounded-full flex flex-col justify-center items-center text-gray-500"
        >
            <IconSearch />
            <span class="text-[0.7rem] mt-1"> Search </span>
        </button>
        <button
            on:click={() => goto("/drafts/" + draftsStore.createDraft())}
            class=" h-full rounded-full flex flex-col justify-center items-center text-gray-500"
        >
            <div class="p-1 bg-black rounded-full text-white">
                <IconPlus size={30} />
            </div>
        </button>
        <button
            on:click={() => modalStore.openModal(Modal.account_summary)}
            class="h-full pt-2 rounded-full flex flex-col justify-center items-center text-gray-500"
        >
            <IconWallet />
            <span class="text-[0.7rem] mt-1"> Wallet </span>
        </button>
        <a
            href="/profile"
            class="h-full pt-2 rounded-full flex flex-col justify-center items-center text-gray-500"
        >
            <IconUser />
            <span class="text-[0.7rem] mt-1"> Profile </span>
        </a>
    </nav>

    <!-- right column -->
    <div
        class="sticky top-0 hidden md:block md:col-span-4 lg:col-span-3 xl:col-span-3"
    >
        <div class="sticky top-0 max-w-sm">
            <div class="h-16 flex justify-end items-center pr-4 gap-4">
                <UserButton />
            </div>
            <div class="pr-4 pl-2 lg:pl-4 xl:pl-8">
                {#if $web3Store?.publicKey === null}
                    <div
                        class="bg-white ring-1 rounded-2xl ring-gray-200 p-8 -mt-8 mb-4"
                    >
                        <Login />
                    </div>
                {/if}
                <slot name="right" />
            </div>
        </div>
    </div>
</div>
