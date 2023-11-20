<script lang="ts">
    import { web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import type {
        pmMarketFulldata,
        pmTokenData,
    } from "@am/backend/types/market";
    import Toggle from "$lib/elements/toggle.svelte";
    import {
        IconEaseInOutControlPoints,
        IconLivePhoto,
    } from "@tabler/icons-svelte";
    import {
        Chain,
        ClobClient,
        OrderType,
        AssetType,
    } from "$lib/clob";
    import { usd } from "$lib/utils/format";
    import {
        getAllowances,
        getOrderbookSummary,
        setAllowances,
    } from "$lib/utils/pm";
    import { SignatureType } from "@polymarket/order-utils";
    import InputWithSlider from "./input_with_slider.svelte";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import TradeLayout from "./trade_layout.svelte";

    export let market: pmMarketFulldata;
    export let updateMarket: (market: pmMarketFulldata) => void;
    export let selectedTokenId: string;
    export let updateSelectedToken: (v: string) => void;

    let selectedToken: pmTokenData | undefined;

    let prices: Record<
        string,
        {
            b: number;
            s: number;
        }
    > = {};

    async function selectToken(token_id: string) {
        // if (selectedTokenId !== token_id) {
        //     updateSelectedToken(token_id);
        // }
        if (!$web3Store?.polygon?.address) {
            modalStore.openModal(Modal.login);
            return;
        }
        var content = document.getElementById("content");
        price = prices[token_id]?.b ?? 0.5;
        if (selectedToken && selectedToken.token_id === token_id) {
            selectedToken = undefined;
            // if (content) {
            //     content.style.minHeight = content.scrollHeight + "px";
            //     await delay(50);
            //     content.style.minHeight = "";
            //     content.style.maxHeight = "";
            // }
        } else {
            selectedToken = market.data.tokens.find(
                (t) => t.token_id === token_id
            );
            // if (selectedToken && content) {
            //     await tick();
            //     content.style.maxHeight = content.scrollHeight + "px";
            // }
        }
    }

    // $: selectedTokenId, selectToken(selectedTokenId);

    async function getPrices(td: pmTokenData[]) {
        for (const t of td) {
            const summary = await getOrderbookSummary(t.token_id, market);
            prices[t.token_id] = {
                b: (summary?.buy ?? 0.5) ,
                s: summary?.sell ?? 0.5,
            };
        }
    }

    $: getPrices(market.data.tokens);

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";

    let orderType: "limit" | "market" = "limit";
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
        if (!selectedToken) return;

        if (!$web3Workspace.polyClob) {
            modalStore.openModal(Modal.login);
            return;
        }

        const wallet = await $web3Workspace.web3Evm.getWallet();
        const rpc = $web3Workspace.web3Evm.rpc;

        if (!wallet) {
            console.log("Missing wallet");
            return;
        }
        if (!rpc) {
            console.log("Missing rpc.");
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

        console.log("Resp", resp);
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
</script>

<TradeLayout
    tokens={market.data.tokens.map((t) => ({
        id: t.token_id,
        outcome: t.outcome,
        color: t.outcome,
        ask: (prices[t.token_id] ? prices[t.token_id].s : 0) * 100,
        bid: (prices[t.token_id] ? prices[t.token_id].b : 0) * 100,
    }))}
    selectedToken={selectedToken
        ? {
              id: selectedToken.token_id,
              outcome: selectedToken.outcome,
              color: selectedToken.outcome,
          }
        : undefined}
    execute={() => buyShares()}
    selectToken={(t) => {
        selectToken(t.id);
    }}
>
    {#if selectedToken}
        <div class="flex mb-1 gap-3 justify-between flex-row">
            <label for="thing" class="w-1/3 font-semibold mt-2">
                {"Order type"}
            </label>
            <div class="w-2/3 xl:w-1/3 h-11">
                <Toggle
                    selected={orderType === "limit" ? "left" : "right"}
                    onSelect={(s) =>
                        (orderType = s === "left" ? "limit" : "market")}
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
            <div class="flex flex-col mb-1 gap-3 justify-between xl:flex-row">
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
        <div class="flex flex-col mb-1 gap-3 justify-between xl:flex-row">
            <label for="thing" class="w-full xl:w-2/3 font-semibold xl:mt-2">
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
            <div class="py-2 text-sm flex justify-between items-center">
                <h5 class="font-semibold">
                    {`Payout if {direction ? "Yes" : "No"}`}
                </h5>
                <p>
                    <span
                        class={`font-semibold ${
                            selectedToken.outcome.toLowerCase() === "no"
                                ? "dark:text-red-400"
                                : selectedToken.outcome.toLowerCase() === "yes"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "dark:text-indigo-400"
                        }`}
                    >
                        {`+ ${usd.format(shares)}`}
                    </span>
                </p>
            </div>
        </div>
    {/if}
    <span slot="confirm">
        {`Buy ${shares} '${selectedToken?.outcome}' shares`}
    </span>
</TradeLayout>

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
