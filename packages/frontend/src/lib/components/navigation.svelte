<script lang="ts">
    import { browser } from "$app/environment";
    import IconCards from "@tabler/icons-svelte/dist/svelte/icons/IconCards.svelte";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUser.svelte";
    import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte";
    import IconWallet from "@tabler/icons-svelte/dist/svelte/icons/IconWallet.svelte";
    import IconPencil from "@tabler/icons-svelte/dist/svelte/icons/IconEditCircle.svelte";
    import { goto } from "$app/navigation";
    import { draftsStore } from "$lib/marketDraftStore";
    import NavItem from "$lib/elements/nav_item.svelte";

    $: creatingMarket = browser
        ? window.location.href.includes("/drafts/")
        : false;

    const links: {
        Icon: any;
        name: string;
        href: string;
        target?: string;
        referrerpolicy?: ReferrerPolicy;
    }[] = [
        { name: "Home", href: "/", Icon: IconCards },
        { name: "Drafts", href: "/drafts", Icon: IconPencil },
        { name: "Profile", href: `/profile`, Icon: IconUser },
        // { name: "Activity", href: "/activity", Icon: IconActivity },
        // { name: "My Markets", href: "/markets", Icon: IconNotebook },
        { name: "Wallet", href: `/wallet`, Icon: IconWallet },
    ];
</script>

<div class="flex flex-col justify-start items-start gap-4 mt-4">
    {#each links as link}
        <NavItem
            LinkDef={link}
            target={link.target}
            referrerpolicy={link.referrerpolicy}
        />
    {/each}

    {#if !creatingMarket}
        <div class="w-full lg:pr-4">
            <button
                on:click={() => goto("/drafts/" + draftsStore.createDraft())}
                class={`h-10 w-full flex justify-center lg:justify-start items-center gap-2 lg:py-3 group`}
            >
                <div class={`h-10 w-10 flex justify-center items-center`}>
                    <div
                        class={`h-8 w-8 flex justify-center items-center rounded-xl ring-inset ring-2 bg-gradient-to-br ring-indigo-500 dark:from-indigo-500 dark:via-violet-500 dark:to-indigo-500 text-white shadow-md group-hover:shadow-indigo-800/80`}
                    >
                        <IconPlus />
                    </div>
                </div>
                <span
                    class={`hidden lg:block text-md text-indigo-400 font-medium group-hover:text-white`}
                >
                    Create
                </span>
            </button>
        </div>
    {/if}
</div>
