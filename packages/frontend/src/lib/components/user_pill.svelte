<script lang="ts">
    import { goto } from "$app/navigation";
    import { getUser } from "$lib/api";
    import Pill from "$lib/elements/pill.svelte";
    import { generateProfileImage, readableAddress } from "$lib/utils";
    import IconLoader from "@tabler/icons-svelte/dist/svelte/icons/IconLoader.svelte";
    import { createPopperActions } from "svelte-popperjs";

    const [popperRef, popperContent] = createPopperActions();
    export let id: string;

    let showPopup = false;

    $: userResponse = getUser(id);
</script>
<!-- 
{#if showPopup}
    <div
        use:popperContent={{
            placement: "top",
            strategy:  "fixed",
            modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
        }}
        class="relative flex items-center justify-center"
    >
        <div class="absolute z-11 bottom-0 bg-white w-2 h-2 -mb-1 rotate-45" />
        <div
            class="relative h-12 py-1 px-2.5 z-10 bg-white text-xs rounded-lg text-black shadow-xl"
        >
            Subsidy
        </div>
    </div>
{/if} -->

<a
    href={`/user/${id}`}
 >
    <Pill>
        <div
            use:popperRef
            class="w-4 h-4 rounded-full ring-1 ring-inset ring-neutral-400 overflow-hidden p-0.5"
        >
            {#await userResponse}
                <IconLoader class="animate-spin" size={12} />
            {:then user}
                <img
                    class=""
                    src={user?.metadata.image ?? generateProfileImage(id)}
                    alt="user avatar"
                />
            {/await}
        </div>
        <span>
            {#await userResponse}
                {"..."}
            {:then user}
                {#if user?.username}
                    {user.username}
                {:else if id}
                    {readableAddress(id)}
                {:else}
                    {"- -"}
                {/if}
            {/await}
        </span>
    </Pill>
</a>
