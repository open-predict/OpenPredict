<script lang="ts">
    import type {
        marketChaindata,
        marketFulldata,
    } from "@am/backend/types/market";
    import {
        buySharesInstruction,
        getBuyShareAmount,
        getChance,
        getSellUsdcLimit,
        USDC_PER_DOLLAR,
    } from "$lib/utils/op";

    import { TxStatus, web3Workspace } from "$lib/web3Workspace";
    import { web3Store } from "$lib/web3Store";
    import colors from "tailwindcss/colors";
    import { usd } from "$lib/utils/format";
    import InputWithSlider from "./input_with_slider.svelte";
    import TradeLayout from "./trade_layout.svelte";
    import type { TToken, TTokenPrice } from "$lib/types";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import {
        PUBLIC_OP_MAIN_PROGRAM_ADDR,
        PUBLIC_SOLANA_USDC_ADDR,
    } from "$env/static/public";
    import { PublicKey, Transaction } from "@solana/web3.js";
    import confetti from "canvas-confetti";
    import LoadingOverlay from "./loading_overlay.svelte";
    import { api } from "$lib/api";
    import { base58 } from "ethers5/lib/utils";
    import PmPosition from "./pm_position.svelte";

    export let market: marketFulldata;
    export let updateMarket: (market: marketFulldata) => void;

    let tokens: (TTokenPrice & TToken)[] = [
        {
            outcome: "Yes",
            id: "yes",
            color: colors.emerald[500],
            ask: 50,
            bid: 50,
        },
        {
            outcome: "No",
            id: "no",
            color: colors.red[500],
            ask: 50,
            bid: 50,
        },
    ];

    let selectedToken: TToken | undefined;

    async function selectToken(token: TToken | undefined) {
        if (selectedToken?.id === token?.id) {
            selectedToken = undefined;
        } else {
            selectedToken = token;
        }
    }

    const step = 0.1 * USDC_PER_DOLLAR;
    const chance = 0.5;

    let userShares = {
        shares: 0n,
        sharesUI: 0,
        valueCents: 0,
    };

    let defaultMicroUsd = 100;
    let microUsd = 0;
    let expectedShares: bigint = 0n;
    let expectedChance = 0;
    let expectedYes: bigint = 0n;
    let expectedNo: bigint = 0n;
    let maxSell = 0;

    let loadingMessage = "";
    let errorMessage = "";
    let completedMessage = "";

    let orderType: "limit" | "market" = "limit";

    let slider: HTMLInputElement;

    // capped in beta
    $: maxBuy = microUsd + step * 100;

    function recalc(
        data: marketChaindata,
        userShares: bigint,
        userSharesNumber: number,
        microUsdc: number,
        token: TToken | undefined
    ) {
        console.log("refreshing op_trade...");
        const chance = getChance(data.Yes, data.No) * 100;
        tokens[0].bid = chance;
        tokens[0].ask = chance;
        tokens[1].ask = 100 - chance;
        tokens[1].bid = 100 - chance;
        if (token) {
            const expected = getBuyShareAmount(
                data,
                Math.round(microUsdc),
                token.id === "yes"
            );
            expectedShares = BigInt(expected.shares.toString());
            expectedChance = expected.newRatio;
            expectedYes = BigInt(expected.newYes.toString());
            expectedNo = BigInt(expected.newNo.toString());
            if (userSharesNumber !== 0)
                maxSell = Number(getSellUsdcLimit(data, userShares));
        }
    }

    async function executeTrade() {
        const polyAddress = $web3Store?.polymarket?.address;
        const solanaAddress = $web3Store?.solana?.address;

        loadingMessage = "Creating instructions...";

        if (!$web3Store?.solana || !solanaAddress || !polyAddress) {
            modalStore.openModal(Modal.login);
            return;
        }

        if (!selectedToken) {
            alert("Please select an outcome...");
            return;
        }

        const instructions = await buySharesInstruction(
            new PublicKey(PUBLIC_SOLANA_USDC_ADDR),
            new PublicKey(PUBLIC_OP_MAIN_PROGRAM_ADDR),
            new PublicKey($web3Store.solana.address),
            new PublicKey(market.data.data.AmmAddress).toBytes(),
            microUsd,
            selectedToken.id === "yes",
            microUsd,
            0
        );

        const balance = Number($web3Store.solana.balances.USDC?.amount ?? 0);

        // if (Number($web3Store.solana.balances.USDC?.amount ?? 0) < microUsd) {
        //     loadingMessage = "Redirecting to checkout...";
        //     const toppedUp = await $web3Workspace.web3Sol
        //         .topup((microUsd - balance) / 100)
        //         .then(() => {
        //             return true;
        //         })
        //         .catch((e) => {
        //             errorMessage =
        //                 "Unable to fund your account. Please check the console.";
        //             console.error(e);
        //             return false;
        //         });
        //     if (!toppedUp) return;
        // }

        const signedTx = (await $web3Workspace.web3Sol.signTransaction([
            instructions,
        ])) as Transaction;

        console.log("Signed create market instruction: ", signedTx);

        loadingMessage = "Sending your transaction...";

        const res = await api.bridgeOpenPredictTransaction.query({
            amount: microUsd,
            inputPolyWallet: polyAddress,
            opTransaction: base58.encode(
                signedTx.serialize({
                    requireAllSignatures: false,
                })
            ),
        });

        if (res.error) {
            errorMessage = res.error;
            return;
        }

        market.data.PriceHistory.push({
            Yes: expectedYes,
            No: expectedNo,
            Subsidy: market.data.data.Subsidy,
            At: new Date(Date.now() - 1000),
        });
        market.data.data.Yes = expectedYes;
        market.data.data.No = expectedNo;
        const userAccount = market.data.UserAccounts.get(solanaAddress);
        if (userAccount) {
            market.data.UserAccounts.set(solanaAddress, {
                ...userAccount,
                Shares:
                    userAccount?.Shares +
                    (selectedToken?.id === "yes"
                        ? expectedShares
                        : -1n * expectedShares),
            });
        }
        updateMarket(market);

        loadingMessage = "";
        completedMessage = "Trade executed!";

        var myCanvas = document.createElement("canvas");
        myCanvas.className =
            "absolute top-0 left-0 w-full h-full z-20 pointer-events-none";
        document.body.appendChild(myCanvas);
        var myConfetti = confetti.create(myCanvas, {
            resize: true,
        });

        myConfetti({
            particleCount: 200,
        });

        setTimeout(() => {
            completedMessage = "";
            myConfetti.reset();
            document.body.removeChild(myCanvas);
            // onClose();
        }, 5000);
        // },
        // (e) => {
        //     if (e instanceof Error) {
        //         errorMessage = e.message;
        //     } else {
        //         errorMessage =
        //             "Couldn't execute your trade, please try again.";
        //     }
        // }
    }

    $: recalc(
        market.data.data,
        userShares.shares,
        userShares.sharesUI,
        microUsd,
        selectedToken
    );

    $: position = $web3Store?.solana?.address
        ? market.data.UserAccounts.get($web3Store.solana.address)
        : undefined;
    $: positionValue = position ? Number(position.Shares) * (position.Shares < 0n ? -tokens[1].bid : tokens[0].bid) : 0 
</script>

<TradeLayout
    {tokens}
    selectToken={(t) => selectToken(t)}
    execute={() => executeTrade()}
    {selectedToken}
>
    <LoadingOverlay
        variant={selectedToken?.id === "yes" ? "green" : "red"}
        {loadingMessage}
        {errorMessage}
        {completedMessage}
        onClose={() => {
            if (!errorMessage) {
                // onClose();
            }
            loadingMessage = "";
            errorMessage = "";
            completedMessage = "";
        }}
    />
    {#if selectedToken}
        <InputWithSlider
            {step}
            outcome={selectedToken.id.toLowerCase()}
            bind:value={microUsd}
            onChange={(e) => {
                const allowed = e.currentTarget.value.replace(/[^0-9.]+/g, "");
                const num = parseFloat(allowed);
                if (isNaN(num)) {
                    microUsd = defaultMicroUsd;
                } else {
                    microUsd = num * USDC_PER_DOLLAR;
                    e.currentTarget.value = usd.format(
                        microUsd / USDC_PER_DOLLAR
                    ); // sometimes wasn't updating
                }
            }}
            formatted={usd.format(
                (true //buying
                    ? microUsd
                    : Number(expectedShares) *
                      (userShares.shares > 0 ? chance : 1 - chance)) /
                    USDC_PER_DOLLAR
            )}
            max={maxBuy}
            min={0}
        />
        <!-- {#if !buying} -->
        <!-- <button
            on:click={() => (microUsd = maxSell)}
            class={`rounded-lg font-semibold whitespace-nowrap bg-white text-black ring-1 ring-gray-300 text-xs px-2.5 hover:shadow-md`}
        >
            Sell Max
        </button> -->
        <!-- {/if} -->
        <div class="text-neutral-400">
            <!-- {#if !buying}
                <div class="pb-2 text-sm flex justify-between items-center">
                    <span class="">
                        {`Your ${
                            userShares.shares > 0 ? "'Yes'" : "'No'"
                        } shares`}
                    </span>
                    <span class="text-black">
                        {Math.abs(userShares.sharesUI)}
                    </span>
                </div>
            {/if} -->
            <div class="py-2 text-sm flex justify-between items-center">
                <!-- {#if buying}  -->
                <span class="">Shares</span>
                <span>
                    {(Number(expectedShares) / USDC_PER_DOLLAR).toFixed(2)}
                </span>
                <!-- {:else}
                                    <span class="">
                                        {`${
                                            userShares.shares > 0
                                                ? "'Yes'"
                                                : "'No'"
                                        } shares to sell`}
                                    </span>
                                    <span class="">
                                        {(
                                            Number(expectedShares) /
                                            USDC_PER_DOLLAR
                                        ).toFixed(2)}
                                    </span>
                                {/if} -->
            </div>
            <div class="py-2 text-sm flex justify-between items-center">
                <span class="">New probability</span>
                <span class="">{`${(expectedChance * 100).toFixed(1)}%`}</span>
            </div>
            <!-- {#if buying} -->
            <div class="py-2 text-sm flex justify-between items-center">
                <span class="font-semibold"
                    >{`Payout if ${selectedToken.outcome}`}</span
                >
                <span class={`font-semibold text-indigo-400`}
                    >{`+ ${usd.format(
                        Number(
                            (BigInt(expectedShares) - BigInt(microUsd)) / 10000n
                        ) / 100
                    )}`}</span
                >
            </div>
            <!-- {/if} -->
        </div>
    {/if}
    <span slot="confirm">
        {`Buy ${
            Math.round((Number(expectedShares) * 10) / USDC_PER_DOLLAR) / 10
        } '${selectedToken?.outcome}' shares`}
    </span>
</TradeLayout>

{#if position}
    <div class="flex flex-col gap-1 divide-y divide-neutral-100 dark:divide-neutral-900">
        <h4 class="text-md font-semibold mt-2">
            {`Positions`}
        </h4>
        <PmPosition
            token={tokens[0]}
            shares={Math.round(Math.abs(Number(position.Shares) / USDC_PER_DOLLAR)*10)/10}
            sell={() => {}}
            value={usd.format(positionValue/(USDC_PER_DOLLAR * 100))}
        />
        <!-- {#each Array.from(market.orderdata.entries()).slice(0, 1) as token}
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
    {/each} -->
    </div>
{/if}

<!-- {#each Array.from(market.orderdata.entries()).slice(0, 1) as token}
            {#each token[1].positions.slice(0, 1) as position}
                <PmPosition
                    {market}
                    {updateMarket}
                    {position}
                    token={tokens[token[0]]}
                />
            {/each}
        {/each} -->
