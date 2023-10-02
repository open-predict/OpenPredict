<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import type { TLinkDef } from "$lib/utils";
    export let LinkDef: TLinkDef;
    export let target: string | undefined = undefined;
    export let referrerpolicy: ReferrerPolicy | undefined = undefined;
    $:splitPath = browser ? $page.url.pathname.split("/") : [];
    $:selected = splitPath.length === 2 && "/" + splitPath[1] === LinkDef.href
</script>

<a
        href={LinkDef.href}
        target={target}
        referrerpolicy={referrerpolicy}
        class={`h-10 w-full flex justify-center lg:justify-start items-center gap-2 lg:py-3 group`}
    >
        <div class={`h-10 w-10 flex justify-center items-center`}>
            <div 
                class={`h-8 w-8 flex justify-center items-center rounded-xl ring-1 dark:bg-neutral-900 ${selected 
                    ? "ring-indigo-900 text-indigo-500" 
                    : "ring-transparent dark:text-neutral-400"
                } group-hover:dark:ring-indigo-800 group-hover:dark:text-indigo-300 shadow-xl group-hover:shadow-indigo-500/20`}
            >
                <LinkDef.Icon size={18} stroke={1.5} />
            </div>
        </div>
        <span class={`hidden lg:block text-md font-medium ${selected ? "dark:text-white" : "dark:text-neutral-400"} group-hover:text-neutral-200`}>
            {LinkDef.name}
        </span>
</a>