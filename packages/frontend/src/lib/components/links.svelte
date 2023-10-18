<script lang="ts">
    import NavItem from "$lib/elements/nav_item.svelte";
    import { IconBadge, IconBrandDiscord, IconBrandGithub } from "@tabler/icons-svelte";

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
            Icon: IconBrandDiscord,
            href: "https://discord.gg/k7NymNAS7h",
            target: "_blank",
            referrerpolicy: "no-referrer",
        },
        {
            name: "Github",
            Icon: IconBrandGithub,
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
