<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import type { TLinkDef } from "$lib/utils";
    export let LinkDef: TLinkDef;
    $:splitPath = browser ? $page.url.pathname.split("/") : [];
    $:selected = splitPath.length === 2 && "/" + splitPath[1] === LinkDef.href
</script>

<a
        href={LinkDef.href}
        class={`flex justify-center lg:justify-start items-center gap-4 rounded-full w-full lg:px-4 lg:py-3 hover:bg-gray-100 ${selected ? "text-black font-semibold" : "text-gray-600"}`}
    >
        <LinkDef.Icon size={20} stroke={selected ? 2.5 : 2} />
        <span class="hidden lg:block">
            {LinkDef.name}
        </span>
</a>