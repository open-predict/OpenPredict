<script lang="ts">
    import {
        PUBLIC_OP_MAIN_PROGRAM_ADDR,
        PUBLIC_PM_PROXY_WALLET_FACTORY,
        PUBLIC_POLYGON_TESTNET,
        PUBLIC_SOLANA_USDC_ADDR,
    } from "$env/static/public";
    import { web3Workspace } from "$lib/web3Workspace";
    import type {
        marketChaindata,
        marketFulldata,
    } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import { IconMinus, IconPlus, IconRefresh } from "@tabler/icons-svelte";
    import { onMount, tick } from "svelte";
    import { USDC_PER_DOLLAR } from "$lib/utils/op";
    import { browser } from "$app/environment";
    import {
        getBuyShareAmount,
        getChance,
        getSellUsdcLimit,
        getUserShares,
        buySharesInstruction,
    } from "$lib/utils/op";
    import { delay } from "$lib/utils/mics";
    import confetti from "canvas-confetti";
    import { web3Store } from "$lib/web3Store";
    import LoadingOverlay from "$lib/components/loading_overlay.svelte";
    import type {
        pmMarketFulldata,
        pmTokenData,
        pmTokenOrderdata,
    } from "@am/backend/types/market";
    import { fade, scale, slide } from "svelte/transition";
    import "$lib/styles/range.css";
    import Toggle from "$lib/elements/toggle.svelte";
    import {
        IconChevronDown,
        IconEaseInOutControlPoints,
        IconExternalLink,
        IconLivePhoto,
    } from "@tabler/icons-svelte";
    import PmPosition from "./pm_position.svelte";
    import Slider from "$lib/elements/slider.svelte";
    import {
        Chain,
        ClobClient,
        OrderType,
        type BalanceAllowanceParams,
        AssetType,
        Side,
    } from "$lib/clob";
    import {
        Interface,
        MaxUint256,
        Transaction,
        accessListify,
        ethers,
        getCreate2Address,
        keccak256,
        toBigInt,
    } from "ethers6";
    import { superjson } from "$lib/superjson";
    import { usd } from "$lib/utils/format";
    import {
        getAllowances,
        getCtfContract,
        getOrderbookSummary,
        getUsdcContract,
        setAllowances,
    } from "$lib/utils/pm";
    import { SignatureType, getContracts } from "@polymarket/order-utils";
    import { defaultAbiCoder, solidityKeccak256 } from "ethers5/lib/utils";
    import { proxyWalletFactoryAbi } from "$lib/abi/pwfAbi";
    import { erc20Abi } from "$lib/abi/erc20Abi";
    import { ctfAbi } from "$lib/abi/ctfAbi";
    import { usdcAbi } from "$lib/abi/usdcAbi";
    import {
        erc1155ApprovalTransaction,
        erc20ApprovalTransaction,
    } from "@polymarket/sdk/lib/utils";
    import InputWithSlider from "./input_with_slider.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";

    export let market: pmMarketFulldata;
    export let direction: boolean;
    export let onClose: () => void;
    export let updateMarket: (market: pmMarketFulldata) => void;

    let selectedToken: pmTokenData | undefined;

    let prices: Record<
        string,
        {
            b: number;
            s: number;
        }
    > = {};

    async function selectToken(token_id: string) {
        if(!$web3Store?.polygon?.address){
            modalStore.openModal(Modal.login)
            return;
        }
        var content = document.getElementById("content");
        price = prices[token_id]?.b ?? 0.5;
        if (selectedToken && selectedToken.token_id === token_id) {
            selectedToken = undefined;
            if (content) {
                content.style.minHeight = content.scrollHeight + "px";
                await delay(50);
                content.style.minHeight = "";
                content.style.maxHeight = "";
            }
        } else {
            selectedToken = market.data.tokens.find(
                (t) => t.token_id === token_id
            );
            if (selectedToken && content) {
                await tick();
                content.style.maxHeight = content.scrollHeight + "px";
            }
        }
    }

    async function getPrices(td: pmTokenData[]) {
        for (const t of td) {
            const summary = await getOrderbookSummary(t.token_id, market);
            prices[t.token_id] = {
                b: summary?.buy ?? 0.5,
                s: summary?.sell ?? 0.5,
            };
        }
    }

    $: getPrices(market.data.tokens);

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";

    let orderType: "limit" | "market" = "limit";

    // capped in beta
    // $: maxBuy = microUsd + maxGap;
    $: maxBuy = 10 * USDC_PER_DOLLAR;

    // $: browser
    //     ? recalc(
    //           market.data.data,
    //           userShares.shares,
    //           userShares.sharesUI,
    //           microUsd,
    //           direction
    //       )
    //     : undefined;

    // function recalc(
    //     data: marketChaindata,
    //     userShares: bigint,
    //     userSharesNumber: number,
    //     microUsdc: number,
    //     direction: boolean
    // ) {
    //     const expected = getBuyShareAmount(
    //         data,
    //         Math.round(microUsdc),
    //         direction
    //     );
    //     expectedShares = BigInt(expected.shares.toString());
    //     expectedChance = expected.newRatio;
    //     expectedYes = BigInt(expected.newYes.toString());
    //     expectedNo = BigInt(expected.newNo.toString());
    //     if (userSharesNumber !== 0)
    //         maxSell = Number(getSellUsdcLimit(data, userShares));
    // }

    let price: number;
    let shares: number = 10;
    $: total = usd.format((price ?? 0) * (shares ?? 0));

    const onPriceChange = (
        e: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => {
        const allowed = e.currentTarget.value.replace(/[^0-9.]+/g, "");
        const num = parseFloat(allowed);
        if (isNaN(num)) {
            price = 0; // change this
        } else {
            price = num;
            e.currentTarget.value = usd.format(price); // wasn't updating
        }
    };

    const onSharesChange = (
        e: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => {
        const allowed = e.currentTarget.value.replace(/[^0-9.]+/g, "");
        const num = parseFloat(allowed) ?? 0;
        if (isNaN(num)) {
            shares = 0; // change this
        } else {
            shares = num;
            e.currentTarget.value = shares.toFixed(1); // wasn't updating
        }
    };

    async function buyShares() {
        if (!$web3Workspace.polyClob) alert("login");
        if (!selectedToken) return;

        const wallet = await $web3Workspace.web3Evm.getWallet();
        const rpc = $web3Workspace.web3Evm.rpc;

        if (!wallet) {
            console.log("Missing wallet");
            return;
        }
        if (!rpc) {
            alert("Missing rpc.");
            return;
        }

        const proxyAddress = await $web3Store?.polymarket?.address;
        if (!proxyAddress) {
            alert("Missing proxy address.");
            return;
        }

        const allowances = await getAllowances(rpc, proxyAddress);
        if (!allowances) {
            alert("Unable to get allowances");
            return;
        }

        setAllowances(proxyAddress, allowances, wallet, rpc);

        const polyProxyClient = new ClobClient(
            "https://clob.polymarket.com",
            Chain.POLYGON,
            $web3Workspace.polyClob.signer,
            $web3Workspace.polyClobApiKeys,
            SignatureType.POLY_PROXY,
            proxyAddress
        );

        const order = await polyProxyClient.createMarketBuyOrder({
            tokenID: selectedToken?.token_id,
            price: price,
            amount: shares,
        });

        const resp = await polyProxyClient.postOrder(order, OrderType.FOK);

        alert("Done");
    }

    const getOrders = async (id: string) => {
        if ($web3Workspace.polyClob) {
            console.log($web3Workspace.polyClobApiKeys);
            const openOrders = await $web3Workspace.polyClob.getOpenOrders({
                market: id,
                owner: $web3Workspace.polyClobApiKeys?.key,
            });
            console.log("openOrders", openOrders);
            const balanceAllowed =
                await $web3Workspace.polyClob.getBalanceAllowance({
                    token_id: id,
                    asset_type: AssetType.CONDITIONAL,
                });
            console.log("balanceAllowed", balanceAllowed);
        }
    };

    const tokenBtnClass = (
        token: pmTokenData,
        selected: typeof selectedToken
    ) => {
        let btn_class = "h-10 w-full rounded-xl font-semibold mt-auto";
        switch (token.outcome.toLowerCase()) {
            case "yes":
                btn_class = selected
                    ? selected?.token_id === token.token_id
                        ? `bg-emerald-500 dark:bg-emerald-600 text-white`
                        : `bg-white text-neutral-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-white dark:opacity-80`
                    : `bg-white text-green-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-green-400`;
                break;
            case "no":
                btn_class = selected
                    ? selected?.token_id === token.token_id
                        ? `bg-red-500 text-white`
                        : `bg-white text-neutral-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-white dark:opacity-80`
                    : `bg-white text-red-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 text-red-400`;
                break;
            default:
                btn_class = selected
                    ? selected?.token_id === token.token_id
                        ? `bg-indigo-600 text-white`
                        : "bg-white text-neutral-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 dark:text-white dark:opacity-80"
                    : "bg-white text-indigo-600 border border-neutral-200 dark:border-0 dark:bg-neutral-900 text-indigo-400";
                break;
        }
        return btn_class;
    };

    $: tradeButtonClass = selectedToken
        ? selectedToken.outcome.toLowerCase() === "yes"
            ? `bg-emerald-500 dark:bg-emerald-600 text-white`
            : selectedToken.outcome.toLowerCase() === "no"
            ? `bg-red-500 text-white`
            : `bg-indigo-600 text-white`
        : `bg-indigo-600 text-white`;
</script>

<div class="flex flex-col gap-4">
    <div
        class={`flex flex-col rounded-2xl overflow-hidden ring-1 ${
            selectedToken
                ? "dark:ring-neutral-900 ring-neutral-200"
                : "dark:ring-transparent ring-neutral-200"
        }`}
    >
        <div
            class="flex gap-3 col-span-3 p-2 bg-neutral-100 dark:bg-neutral-900/60"
        >
            {#each market.data.tokens.sort( (a, b) => b.outcome.localeCompare(a.outcome) ) as token}
                <button
                    on:click={() => selectToken(token.token_id)}
                    class={`h-10 w-full flex px-4 justify-start items-center gap-1 lg:gap-2 rounded-xl font-semibold mt-auto ${tokenBtnClass(
                        token,
                        selectedToken
                    )}`}
                >
                    <span class="opacity-75">Buy</span>
                    {token.outcome}
                    <span class="ml-auto">
                        {(prices[token.token_id]?.b
                            ? (prices[token.token_id]?.b * 100).toFixed(1)
                            : "-- ") + "¢"}
                    </span>
                </button>
            {/each}
        </div>
        <div class="content" id="content">
            {#if selectedToken}
                <div
                    transition:fade={{ duration: 200, delay: 50 }}
                    class={"flex flex-col gap-4 p-3 pt-4 bg-white dark:bg-neutral-950/80 border-t border-neutral-300 dark:border-neutral-900"}
                >
                    <div class="flex mb-1 gap-3 justify-between flex-row">
                        <label for="thing" class="w-1/3 font-semibold mt-2">
                            {"Order type"}
                        </label>
                        <div class="w-2/3 xl:w-1/3 h-11">
                            <Toggle
                                selected={orderType === "limit"
                                    ? "left"
                                    : "right"}
                                onSelect={(s) =>
                                    (orderType =
                                        s === "left" ? "limit" : "market")}
                            >
                                <div class="contents" slot="left">
                                    <IconEaseInOutControlPoints size={12} />
                                    Limit
                                </div>
                                <div class="contents" slot="right">
                                    <IconLivePhoto size={12} />
                                    Market
                                </div>
                            </Toggle>
                        </div>
                    </div>
                    {#if orderType === "limit"}
                        <div
                            class="flex flex-col mb-1 gap-3 justify-between xl:flex-row"
                        >
                            <label
                                for="thing"
                                class="w-full xl:w-2/3 font-semibold xl:mt-2"
                            >
                                {"Limit price"}
                            </label>
                            <InputWithSlider
                                step={0.01}
                                setSliderStep
                                outcome={selectedToken.outcome.toLowerCase()}
                                bind:value={price}
                                onChange={onPriceChange}
                                formatted={(price * 100).toFixed(1) + " ¢"}
                                max={1}
                                min={0}
                            />
                        </div>
                    {/if}
                    <div
                        class="flex flex-col mb-1 gap-3 justify-between xl:flex-row"
                    >
                        <label
                            for="thing"
                            class="w-full xl:w-2/3 font-semibold xl:mt-2"
                        >
                            {"Shares"}
                        </label>
                        <InputWithSlider
                            max={100}
                            min={0}
                            bind:value={shares}
                            outcome={selectedToken.outcome.toLocaleLowerCase()}
                            formatted={(shares ?? 0).toFixed(1)}
                            onChange={onSharesChange}
                        />
                    </div>
                    <div class="flex mb-1 gap-3 justify-between flex-row">
                        <label for="thing" class="w-1/3 font-semibold mt-2">
                            {"Summary"}
                        </label>
                        <div class="flex gap-2">
                            <p class="">Total</p>
                            <h3 class="font-semibold">
                                {total}
                            </h3>
                        </div>
                    </div>
                    <div class="text-neutral-400">
                        <!-- <div
                            class="py-2 text-sm flex justify-between items-center"
                        >
                            <h5 class="">New probability</h5>
                            <span class=""
                                >{`${(expectedChance * 100).toFixed(1)}%`}</span
                            >
                        </div> -->
                        <div
                            class="py-2 text-sm flex justify-between items-center"
                        >
                            <h5 class="font-semibold">
                                {`Payout if ${direction ? "Yes" : "No"}`}
                            </h5>
                            <p>
                                <span
                                    class={`font-semibold ${
                                        selectedToken.outcome.toLowerCase() ===
                                        "no"
                                            ? "dark:text-red-400"
                                            : selectedToken.outcome.toLowerCase() ===
                                              "yes"
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "dark:text-indigo-400"
                                    }`}
                                >
                                    {`+ ${usd.format(shares)}`}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="hidden 2xl:flex" />
                    <button
                        on:click={() => buyShares()}
                        class={`h-10 rounded-xl font-semibold cursor-pointer text-white ${tradeButtonClass}`}
                    >
                        {`Buy ${shares} '${selectedToken.outcome}' shares`}
                    </button>
                </div>
            {/if}
        </div>
    </div>
    <!-- <div class="flex flex-col gap-2">
        <h4 class="font-semibold text-neutral-300">
            {`Limit orders`}
        </h4>
        <p class="text-neutral-300">
            {"You have no active limit orders."}
        </p>
    </div>
    <div class="flex flex-col gap-2">
        <h4 class="font-semibold text-neutral-300 my-1">
            {`Positions`}
        </h4>
        {#each Array.from(market.orderdata.entries()).slice(0, 1) as token}
            {#each token[1].positions.slice(0, 1) as position}
                {#if market.data.tokens.find((t) => t.token_id === token[0])}
                    <PmPosition
                        {market}
                        {updateMarket}
                        {position}
                        token={market.data.tokens.find(
                            (t) => t.token_id === token[0]
                        )}
                    />
                {/if}
            {/each}
        {/each}
    </div> -->
</div>

<style>
    .content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
    }
</style>
