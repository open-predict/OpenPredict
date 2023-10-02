<script lang="ts">
    import NavItem from "$lib/elements/nav_item.svelte";
    import IconGithub from "@tabler/icons-svelte/dist/svelte/icons/IconBrandGithub.svelte";
    import IconDiscord from "@tabler/icons-svelte/dist/svelte/icons/IconBrandDiscord.svelte";
    import IconBadge from "@tabler/icons-svelte/dist/svelte/icons/IconBadge.svelte";

    const links: {
        Icon: any;
        name: string;
        href: string;
        target?: string;
        referrerpolicy?: ReferrerPolicy;
    }[] = [
        {
            name: "About us",
            Icon: IconBadge,
            href: "/about"
        },
        {
            name: "Discord",
            Icon: IconDiscord,
            href: "https://discord.gg/k7NymNAS7h",
            target: "_blank",
            referrerpolicy: "no-referrer",
        },
        {
            name: "Github",
            Icon: IconGithub,
            href: "https://github.com/open-predict/OpenPredict",
            target: "_blank",
            referrerpolicy: "no-referrer",
        },
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
</div>
