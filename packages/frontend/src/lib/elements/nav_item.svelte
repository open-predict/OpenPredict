<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    type TLinkDef = { href: string, name: string, Icon: any }
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
                class={`h-8 w-8 flex justify-center items-center rounded-xl ring-1 bg-white dark:bg-neutral-900 ${selected 
                    ? "ring-indigo-300 text-indigo-600 dark:ring-indigo-900 dark:text-indigo-500" 
                    : "ring-neutral-200 text-neutral-600 dark:text-neutral-400 dark:ring-transparent"
                } group-hover:ring-indigo-200 group-hover:text-indigo-700 group-hover:dark:ring-indigo-800 group-hover:dark:text-indigo-400`}
            >
                <LinkDef.Icon size={16} stroke={1.8} />
            </div>
        </div>
        <span class={`hidden lg:block text-md font-medium ${selected ? "dark:text-white text-neutral-900" : "text-neutral-600 dark:text-neutral-400"} group-hover:text-neutral-900 dark:group-hover:text-neutral-200`}>
            {LinkDef.name}
        </span>
</a>