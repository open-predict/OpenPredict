<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";
    import Header from "$lib/components/header.svelte";
    import CopyButton from "$lib/elements/copy_button.svelte";
    import Logo from "$lib/elements/logo.svelte";
    import MobileMenuButton from "$lib/elements/mobile_menu_button.svelte";
    import Pill from "$lib/elements/pill.svelte";
    import { readableAddress, usd } from "$lib/utils/format";
    import { web3Store } from "$lib/web3Store";
    import { web3Workspace } from "$lib/web3Workspace";
    import {
        IconArrowRight,
        IconChevronDown,
        IconChevronRight,
        IconCurrencySolana,
    } from "@tabler/icons-svelte";

    let showDetails = false;

    $: funds = ($web3Store?.polymarket?.balances.USDC?.ui ?? 0) + ($web3Store?.solanaUsdc?.balances.USDC?.ui ?? 0)
</script>

<ColumnLayout>
    <Header slot="main-header">
        <div slot="center">
            <h2 class="text-white font-semibold">Wallet</h2>
        </div>
        <div slot="right" class="md:hidden">
            <MobileMenuButton />
        </div>
    </Header>
    <div slot="main" class="w-full max-w-full">
        <div
            class="flex flex-col w-full h-full justify-center items-center p-6 pt-20 pb-10 gap-3"
        >
            <span class="text-4xl text-white">
                {usd.format(Number(funds))}
            </span>
            <p class="text-neutral-400 text-sm">Available for trading</p>
            <!-- <div
                class="flex flex-row gap-1 mt-8 flex-wrap justify-center items-center"
            >
                <Pill>
                    <div
                        class="h-5 w-5 overflow-hidden rounded-full flex justify-center items-center p-1"
                    >
                        <img
                            src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                            alt="polygon logo"
                        />
                    </div>
                    {$web3Store?.polygon?.balances?.MATIC?.usd ?? "$-.--"}
                </Pill>
                <Pill>
                    <div
                        class="h-5 w-5 overflow-hidden rounded-full flex justify-center items-center p-1"
                    >
                        <img
                            src="https://cryptologos.cc/logos/solana-sol-logo.png"
                            alt="solana logo"
                        />
                    </div>

                    {$web3Store?.solana?.balances?.SOL?.usd ?? "$-.--"}
                </Pill>
                <Pill>
                    <div class="flex justify-center items-center">
                        <div
                            class="h-4 w-4 overflow-hidden rounded-full flex justify-center items-center"
                        >
                            <img
                                src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                                alt="polygon logo"
                            />
                        </div>
                        <div
                            class="h-4 w-4 -ml-1 overflow-hidden rounded-full flex justify-center items-center shadow-black shadow-xl"
                        >
                            <img src="/usdc.svg" alt="usdc logo" />
                        </div>
                    </div>
                    {$web3Store?.polymarket?.balances?.USDC?.usd ?? "$-.--"}
                </Pill>
                <Pill>
                    <div class="flex justify-center items-center">
                        <div
                            class="h-4 w-4 overflow-hidden rounded-full flex justify-center items-center"
                        >
                            <img
                                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                                alt="solana logo"
                            />
                        </div>
                        <div
                            class="h-4 w-4 -ml-1 overflow-hidden rounded-full flex justify-center items-center shadow-black shadow-xl"
                        >
                            <img src="/usdc.svg" alt="usdc logo" />
                        </div>
                    </div>
                    {$web3Store?.solanaUsdc?.balances?.USDC?.usd ?? "$-.--"}
                </Pill>
            </div> -->
            <div
                class={`flex flex-col w-full rounded-2xl ${
                    showDetails ? "bg-neutral-950/70" : ""
                }`}
            >
                <button
                    on:click={() => (showDetails = !showDetails)}
                    class="text-indigo-300 text-sm hover:text-indigo-400 p-2"
                >
                    {`${showDetails ? "Hide" : "View"} wallet details`}
                    <IconChevronDown
                        class={`inline-block transition-all ${
                            showDetails ? "-rotate-180" : ""
                        }`}
                        size={16}
                    />
                </button>
                {#if showDetails}
                    <div
                        class="w-full p-4 border-t border-neutral-900/60 flex flex-col gap-4"
                    >
                        <div
                            class="flex flex-col bg-neutral-950 p-3 rounded-2xl"
                        >
                            <div class="flex items-center gap-2 pb-3">
                                <img
                                    class="h-4 w-4"
                                    src="https://cryptologos.cc/logos/polygon-matic-logo.png"
                                    alt="polygon logo"
                                />
                                <span class="text-white font-semibold text-sm"
                                    >Polygon</span
                                >
                            </div>
                            <table
                                class="text-left w-full text-sm table-auto text-neutral-300"
                            >
                                <thead class="h-10">
                                    <tr>
                                        <th>Address</th>
                                        <th>Currency</th>
                                        <th>Amount</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody class="text-neutral-300">
                                    <tr
                                        class="border-t border-neutral-900 h-10"
                                    >
                                        <td>
                                            {`${readableAddress(
                                                $web3Store?.polygon?.address ?? ""
                                            )}`}
                                            <CopyButton
                                                value={$web3Store?.polygon?.address ??
                                                    ""}
                                            />
                                        </td>
                                        <td> MATIC </td>
                                        <td>
                                            {$web3Store?.polygon?.balances?.MATIC?.ui}
                                        </td>
                                        <td>
                                            {$web3Store?.polygon?.balances?.MATIC?.usd}
                                        </td>
                                    </tr>
                                    <tr class="h-10">
                                        <td
                                            >{`${readableAddress(
                                                $web3Store?.polymarket?.address ?? ""
                                            )}`}
                                            <CopyButton
                                                value={$web3Store?.polymarket?.address ??
                                                    ""}
                                            />
                                        </td>
                                        <td> USDC </td>
                                        <td>
                                            {$web3Store?.polymarket?.balances?.USDC?.ui}
                                        </td>
                                        <td>
                                            {$web3Store?.polymarket?.balances?.USDC?.usd}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            class="flex flex-col bg-neutral-950 p-3 rounded-2xl"
                        >
                            <div class="flex items-center gap-2 pb-3">
                                <img
                                    class="h-4 w-4"
                                    src="https://cryptologos.cc/logos/solana-sol-logo.png"
                                    alt="solana logo"
                                />
                                <span class="text-white font-semibold text-sm">
                                    Solana
                                </span>
                            </div>
                            <table
                                class="text-left w-full text-sm table-auto text-neutral-300"
                            >
                                <thead class="h-10">
                                    <tr>
                                        <th>Address</th>
                                        <th>Currency</th>
                                        <th>Amount</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody class="text-neutral-300">
                                    <tr
                                        class="border-t border-neutral-900 h-10"
                                    >
                                        <td>
                                            {`${readableAddress(
                                                $web3Store?.solana?.address ?? ""
                                            )}`}
                                            <CopyButton
                                                value={$web3Store?.solana?.address ??
                                                    ""}
                                            />
                                        </td>
                                        <td>SOL</td>
                                        <td>
                                            {$web3Store?.solana?.balances?.SOL?.ui}
                                        </td>
                                        <td>
                                            {$web3Store?.solana?.balances?.SOL?.usd}
                                        </td>
                                    </tr>
                                    <tr
                                        class="border-t border-neutral-900 h-10"
                                    >
                                        <td>
                                            {`${readableAddress(
                                                $web3Store?.solanaUsdc?.address ??
                                                    ""
                                            )}`}
                                            <CopyButton
                                                value={$web3Store?.solanaUsdc?.address ??
                                                    ""}
                                            />
                                        </td>
                                        <td>USDC</td>
                                        <td>
                                            {$web3Store?.solanaUsdc?.balances?.USDC?.ui}
                                        </td>
                                        <td>
                                            {$web3Store?.solanaUsdc?.balances?.USDC?.usd}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                {/if}
            </div>
            <!-- <a
                href="/settings#swaps"
                class="text-indigo-300 text-sm hover:underline underline-offset-4 hover:text-indigo-400 transition-all"
            >
                Manage auto swap settings
                <IconArrowRight class="inline-block" size={16} />
            </a> -->
        </div>
        <div class="flex flex-col p-6">
            <div class="flex flex-col gap-2">
                <h4 class="text-xl font-semibold text-neutral-200">
                    Fund your account
                </h4>
                <div class="w-full border-t border-neutral-900" />
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                <button
                    on:click={() => $web3Workspace.web3Evm.topup(10000)}
                    class="flex flex-col gap-2 text-left bg-neutral-950 text-white text-2xl p-6 rounded-2xl hover:bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-900"
                >
                    <span class="font-semibold"> Use debit/credit </span>
                    <p
                        class="text-sm text-neutral-400 whitespace-pre-wrap text-left"
                    >
                        {`Fund your account with a card payment by checking out with Moonpay`}
                    </p>
                </button>
                <button
                    class="flex flex-col gap-2 bg-neutral-950 text-left text-white text-2xl p-6 rounded-2xl hover:bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-900"
                >
                    <span class="font-semibold">Transfer from wallet</span>
                    <p
                        class="text-sm text-neutral-400 whitespace-pre-wrap text-left"
                    >
                        {`Receive funds from an external wallet`}
                    </p>
                </button>
                <button
                    class="flex flex-col gap-2 bg-neutral-950 text-white text-2xl p-6 rounded-2xl hover:bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-900"
                >
                    <span class="font-semibold">External sites</span>
                    <p
                        class="text-sm text-neutral-400 whitespace-pre-wrap text-left"
                    >
                        {`Use a third party site to purchase and send USDC to your OpenPredict wallet`}
                    </p>
                </button>
                <button
                    on:click={() => {
                        
                    }}
                    class="flex flex-col gap-2 bg-neutral-950 text-white text-2xl p-6 rounded-2xl hover:bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-900"
                >
                    <span class="font-semibold">Airdrop</span>
                    <p
                        class="text-sm text-neutral-400 whitespace-pre-wrap text-left"
                    >
                        {`Use a third party site to purchase and send USDC to your OpenPredict wallet`}
                    </p>
                </button>
            </div>
        </div>
        <div class="flex flex-col p-6">
            <div class="flex flex-col gap-2">
                <h4 class="text-xl font-semibold text-neutral-200">
                    Manage funds
                </h4>
                <div class="w-full border-t border-neutral-900" />
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                <button
                    class="flex flex-col gap-2 bg-neutral-950 text-white text-2xl p-6 rounded-2xl hover:bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-900"
                >
                    <span class="font-semibold"> Swaps </span>
                    <p
                        class="text-sm text-neutral-400 whitespace-pre-wrap text-left"
                    >
                        {`Manually swap one asset in your wallet for another`}
                    </p>
                </button>
                <button
                    class="flex flex-col gap-2 bg-neutral-950 text-white text-2xl p-6 rounded-2xl hover:bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-900"
                >
                    <span class="font-semibold"> Send funds </span>
                    <p
                        class="text-sm text-neutral-400 whitespace-pre-wrap text-left"
                    >
                        {`Send funds to a user or external wallet`}
                    </p>
                </button>
            </div>
        </div>
    </div>
</ColumnLayout>
