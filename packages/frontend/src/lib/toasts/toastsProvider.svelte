<script lang="ts">
    import { toastsStore } from "$lib/toasts/toastsStore";
    import { crossfade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { flip } from "svelte/animate"
    import { IconAlertCircle, IconX } from "@tabler/icons-svelte";

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;
            return {
                duration: 500,
                easing: quintOut,
                css: (t) => `
				transform: ${transform};
				opacity: ${t}
			`,
            };
        },
    });

</script>

<div
    class="absolute pointer-events-none z-50 top-0 right-0 left-0 bottom-0 flex flex-col justify-end items-center p-8"
>
    {#each $toastsStore as toast, index(toast.id)}
        <div
            class={`pointer-events-auto h-10 p-2.5 pl-6 text-sm flex justify-center items-center rounded-full shadow-2xl gap-4 my-2 stroke-white text-white ${
                toast.variant === "success"
                    ? "bg-emerald-600"
                    : toast.variant === "error"
                    ? "bg-red-700"
                    : "bg-black"
            }`}
            in:receive={{ key: toast.id }}
			out:send={{ key: toast.id }}
            animate:flip
        >
            {#if toast.variant === "error"}
                <IconAlertCircle />
            {/if}
            <p>
                {toast.title}
            </p>
            <div class="bg-white/50 w-0.5 h-full" />
            <p>
                {toast.message}
            </p>
            <button
                class="action_icon h-6 w-6 bg-white/25 text-white stroke-white hover:stroke-white hover:text-white hover:bg-white/20 ring-0"
                on:click|stopPropagation|preventDefault={(e) => {
                    e.stopPropagation();
                    toastsStore.remove(toast.id)
                }}
            >
                <IconX size={15} />
            </button>
        </div>
    {/each}
</div>
