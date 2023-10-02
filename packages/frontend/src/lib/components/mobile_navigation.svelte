<script>
    import IconCards from "@tabler/icons-svelte/dist/svelte/icons/IconCards.svelte";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUserCircle.svelte";
    import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
    import IconWallet from "@tabler/icons-svelte/dist/svelte/icons/IconWallet.svelte";
    import IconSearch from "@tabler/icons-svelte/dist/svelte/icons/IconSearch.svelte";
    import { goto } from "$app/navigation";
    import { draftsStore } from "$lib/marketDraftStore";
    import { Modal, modalStore } from "$lib/modals/modalStore";
</script>

<nav
    class="fixed bottom-0 flex justify-evenly md:hidden items-center gap-6 w-full h-16 bg-white/90 dark:bg-black/90 border-t border-gray-200 dark:border-neutral-700"
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
