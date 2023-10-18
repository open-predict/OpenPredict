<script lang="ts">
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import { IconLoader } from "@tabler/icons-svelte";

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

<div class="items-center text-center">
    {#if $web3Store?.solanaAddress === null}
        <h3 class="font-semibold text-xl text-neutral-800 dark:text-white">Join OpenPredict</h3>
        <div class="mt-2">
            <p class="text-neutral-400">
                {"Login with email"}
            </p>
            <div class="mt-8 flex flex-col gap-4">
                <input
                    type="email"
                    name="email"
                    id="email"
                    class="block text-sm w-full rounded-xl border-0 py-2 px-4 ring-1 ring-inset sm:leading-6 bg-white dark:bg-neutral-900 dark:ring-neutral-800 dark:placeholder:text-neutral-500 dark:text-white dark:focus:ring-indigo-900"
                    placeholder="you@email.com"
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
                        <IconLoader class="animate-spin text-white" />
                    {:else}
                        Login
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
        </div>
    {:else if $web3Store?.solanaAddress === undefined}
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
