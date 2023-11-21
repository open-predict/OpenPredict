<script lang="ts">
    import { goto } from "$app/navigation";
    import { api } from "$lib/api";
    import Pill from "$lib/elements/pill.svelte";
    import type { TUserMinimal } from "$lib/types";
    import { generateProfileImage, format } from "$lib/utils";
    import type { TUser } from "@am/backend/types/user";
    import { IconLoader } from "@tabler/icons-svelte";
    import { image } from "d3";
    import { createPopperActions } from "svelte-popperjs";

    const [popperRef, popperContent] = createPopperActions();

    export let id: string;
    export let user: TUser | null | undefined = undefined;
    export let userMinimal: TUserMinimal | undefined = undefined;

    $: !user
        ? api.getUser.query({ userId: [id] }).then((res) => {
              return res.get(id);
          })
        : undefined;
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

<a href={`/user/${id}`} class="flex">
    <Pill>
        <div
            use:popperRef
            class="w-4 h-4 rounded-full ring-1 ring-inset ring-neutral-400 overflow-hidden flex-shrink-0"
        >
            <img
                class="h-full w-full rounded-full overflow-hidden flex flex-shrink-0"
                src={user?.metadata?.image ??
                    userMinimal?.image ??
                    generateProfileImage(id)}
                alt="user avatar"
            />
        </div>
        <span
            class="group-hover/pill:underline text-ellipsis overflow-hidden group-hover/pill:text-neutral-900 dark:group-hover/pill:text-neutral-200"
        >
            {user?.username ??
                userMinimal?.name ??
                format.readableAddress(id) ??
                "--"}
        </span>
    </Pill>
</a>
