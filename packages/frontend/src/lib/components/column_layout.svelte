<script>
    import UserButton from "./user_button.svelte";
    import Login from "./login.svelte";
    import { web3Store } from "$lib/web3Store";
    import Logo from "../elements/logo.svelte";
    import WalletWidget from "./wallet_widget.svelte";
    import BetaIndicator from "$lib/elements/beta_indicator.svelte";
    import Navigation from "$lib/components/navigation.svelte";
    import Links from "./links.svelte";
    import MobileNavigation from "./mobile_navigation.svelte";
</script>

<div class="relative flex w-full min-h-full bg-neutral-50 dark:bg-black">
    <!-- left column -->
    <div
        class="sticky top-0 hidden md:block md:w-1/12 lg:w-2/12 xl:w-3/12 max-h-screen"
    >
        <div class="ml-auto max-w-xs h-full">
            <a
                href="/"
                class="flex justify-center p-2.5 xl:pl-0 gap-1 lg:justify-start items-center h-16 border-b border-neutral-200 dark:border-neutral-900"
            >
                <div class="w-10 h-10 flex justify-center items-center">
                    <Logo size={22} />
                </div>
                <h1
                    class="hidden lg:block text-md font-semibold xl:text-lg text-black dark:text-white mr-4"
                >
                    OpenPredict
                </h1>
                <BetaIndicator />
            </a>
            <div
                class="h-full max-h-[calc(100%-6rem)] flex flex-col p-2.5 xl:pl-0"
            >
                <Navigation />
                <div class="mt-auto" />
                <Links />
            </div>
            <div class="pr-8 py-4 pl-4 text-xs overflow-clip" />
        </div>
        <slot name="left" />
    </div>

    <!-- center column -->
    <div
        class={`sticky bottom-0 min-h-screen self-end w-full md:w-6/12 lg:w-6/12 xl:w-5/12 bg-white dark:bg-black`}
    >
        <!-- <MobileBanner /> -->

        <!-- main header -->
        <slot name="main-header" class="sticky top-0 w-full" />

        <!-- main content -->
        <div
            class="max-w-full min-h-full border-r border-l border-neutral-200 dark:border-neutral-900 pb-16 z-0"
            style="min-height: calc(100vh - 4rem)"
        >
            <slot name="main" />
        </div>

        <!-- main footer -->
        {#if $$slots["main-footer"]}
            <div
                class="sticky bottom-16 md:bottom-0 h-16 w-full overflow-visible shadow-2xl border-r border-l border-neutral-200 dark:border-neutral-900"
            >
                <slot name="main-footer" />
            </div>
        {/if}
    </div>

    <MobileNavigation />

    <!-- right column -->
    <div class="hidden relative md:block md:w-5/12 lg:w-4/12 xl:w-4/12">
        <div class="h-full max-w-xs">
            <div class="sticky top-0 w-full h-16 z-50">
                <div
                    class="h-full w-full flex justify-end items-center gap-2 border-b border-neutral-200 dark:border-neutral-900 dark:bg-black/80"
                >
                    <!-- {#if $web3Store?.polygon !== null}
                        <div
                            class="flex flex-nowrap justify-evenly overflow-hidden w-48 items-center rounded-2xl ring-1 h-10 divide-x bg-white ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-900 divide-neutral-900"
                        >
                            <WalletWidget />
                        </div>
                    {/if} -->
                    <UserButton />
                </div>
                {#if $web3Store?.polygon === null}
                <div
                    class="flex flex-col p-4 xl:pr-0 gap-4 border-b border-neutral-200 dark:border-neutral-900"
                >
                    <div class="p-3">
                        <Login />
                    </div>
                </div>
                {/if}
            </div>
            <div class="flex flex-col p-4 xl:pr-0 gap-4">
                <slot name="right" />
            </div>
        </div>
    </div>
</div>
