<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import { IconLoader, IconLoader2, IconLoader3 } from "@tabler/icons-svelte";

    let loading = false;
    let email = "";

    async function handleLogin() {
        loading = true;
        await $web3Workspace.login(email);
        loading = false;
    }

    function close() {
        modalStore.closeModal(Modal.login);
    }
</script>

<div class="flex flex-col">
    {#if $web3Store?.polygon === null}
        <h3
            class="font-semibold text-lg text-neutral-800 dark:text-white whitespace-pre-wrap"
        >
            {`Start trading on OpenPredict.`}
            <span class="text-neutral-500">
                {` \nLogin with email.`}
            </span>
        </h3>
        <div class="flex flex-col gap-4 mt-6">
            <input
                type="email"
                name="email"
                id="email"
                class={`basic_input`}
                placeholder="make@predictions.com"
                on:keypress={(e) => {
                    if (e.key === "Enter") handleLogin();
                }}
                bind:value={email}
            />
            <button
                on:click={handleLogin}
                disabled={loading}
                class={`btn_primary`}
            >
                {#if loading}
                    <IconLoader size={20} class="animate-spin text-white" />
                {:else}
                    Signup / Login
                {/if}
            </button>
        </div>
        <!-- <div class="relative my-8 mx-10">
                <div
                    class="absolute inset-0 flex items-center"
                    aria-hidden={true}
                >
                    <div class="w-full border-t border-gray-300" />
                </div>
                <div class="relative flex justify-center">
                    <span class="bg-white px-2 text-sm text-gray-500"
                        >or connect a wallet</span
                    >
                </div>
            </div> -->
    {:else if $web3Store?.polygon === undefined}
        <IconLoader class="animate-spin text-gray-400" />
        <p class="text-gray-500 text-center">
            {"Loading..."}
        </p>
    {:else}
        <h3 class="font-semibold text-gray-900 text-xl">Already connected!</h3>
        <p class="text-xl text-gray-500 mt-3">
            {`You're currently logged in with email.`}
        </p>
    {/if}
</div>
