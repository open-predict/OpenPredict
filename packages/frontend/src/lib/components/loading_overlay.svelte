<script lang="ts">
    import { IconCircleCheck, IconCircleX } from "@tabler/icons-svelte";
    import { Spinner } from "flowbite-svelte";
    export let loadingMessage = "";
    export let errorMessage = "";
    export let completedMessage = "";
    export let variant: undefined | "red" | "green" = undefined;
    export let onClose: () => void;
</script>

{#if loadingMessage || errorMessage || completedMessage}
    <div
        class="fixed top-0 flex flex-col justify-center items-center left-0 z-50 w-full h-full bg-white/95 gap-8 text-center"
    >
        {#if errorMessage}
            <div class={"text-red-500"}>
                <IconCircleX size={50} stroke={1.5} />
            </div>
            <p class="text-gray-700 max-w-sm">
                {errorMessage}
            </p>
            <button class="btn_secondary w-40" on:click={onClose}>
                Close
            </button>
        {:else if completedMessage}
            <div class={"text-green-500"}>
                <IconCircleCheck size={50} stroke={1.5} />
            </div>
            <p class=" text-gray-700 max-w-sm">
                {completedMessage}
            </p>
            <button class="btn_secondary w-40" on:click={onClose}>
                Close
            </button>
        {:else if loadingMessage}
            <div class="text-gray-700">
                <Spinner color={variant ?? "gray"} />
            </div>
            <p class=" text-gray-700">
                {loadingMessage}
            </p>
        {/if}
    </div>
{/if}
