<script>
    import UserButton from "./user_button.svelte";
    import Login from "./login.svelte";
    import { web3Store } from "$lib/web3Store";
    import Logo from "../elements/logo.svelte";
    import WalletWidget from "./wallet_widget.svelte";
    import BetaIndicator from "$lib/elements/beta_indicator.svelte";
    import Navigation from "$lib/components/navigation.svelte";
    import Links from "./links.svelte";
    import MobileBanner from "./mobile_banner.svelte";
    import MobileNavigation from "./mobile_navigation.svelte";
</script>

<div class="flex w-full min-h-full bg-gray-100 dark:bg-black">
    <!-- left column -->
    <header
        class="sticky top-0 hidden md:block md:w-1/12 lg:w-1/4 xl:w-3/10 max-h-screen bg-transparent"
    >
        <div class="ml-auto max-w-xs h-full">
            <!-- desktop navigation -->
            <a
                href="/"
                class="flex justify-center p-2.5 xl:pl-0 gap-1 lg:justify-start items-center h-16 border-b border-gray-200 dark:border-neutral-900"
            >
                <div class="w-10 h-10 flex justify-center items-center">
                    <Logo size={32} />
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
    </header>

    <!-- center column -->
    <div
        class={`h-auto w-full max-w-full md:w-6/12 lg:w-5/12 xl:w-4/10 bg-white dark:bg-black`}
    >
        <MobileBanner />

        <!-- main header -->
        <slot name="main-header" class="sticky top-0" />

        <!-- main content -->
        <div
            class="w-full max-w-full border-r border-l border-gray-200 dark:border-neutral-900 pb-16"
            style="min-height: calc(100% - 4rem)"
        >
            <slot name="main" />
        </div>

        <!-- main footer -->
        {#if $$slots["main-footer"]}
            <div
                class="sticky bottom-16 md:bottom-0 h-16 w-full overflow-visible shadow-2xl border-r border-l border-gray-200 dark:border-neutral-900"
            >
                <slot name="main-footer" />
            </div>
        {/if}
    </div>

    <MobileNavigation />

    <!-- right column -->
    <div
        class="sticky top-0 hidden md:block md:w-5/12 lg:w-1/4 xl:w-3/10 max-h-screen"
    >
        <div class="max-w-xs">
            <div
                class="h-16 flex justify-end items-center gap-2.5 border-b border-gray-200 dark:border-neutral-900"
            >
                <WalletWidget />
                <UserButton />
            </div>
            <div class="flex flex-col p-4 xl:pr-0 gap-2.5">
                {#if $web3Store?.solanaAddress === null}
                    <div
                        class="ring-1 rounded-2xl p-6 pt-10 mb-4 bg-white ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-900"
                    >
                        <Login />
                    </div>
                {/if}
                <slot name="right" />
            </div>
        </div>
    </div>
</div>
