import { PUBLIC_PM_CLOB_URL, PUBLIC_POLYGON_TESTNET } from "$env/static/public";
import { ctfAbi } from "$lib/abi/ctfAbi";
import { proxyWalletFactoryAbi } from "$lib/abi/pwfAbi";
import { usdcAbi } from "$lib/abi/usdcAbi";
import { Chain, ClobClient } from "$lib/clob";
import type { AppRouterOutputs } from "@am/backend/server/routers/_app";
import type { pmTokenData, pmMarketFulldata, pmTokenOrderdata, pmTokenOrderBook } from "@am/backend/types/market";
import { getContracts } from "@polymarket/order-utils";
import { erc1155ApprovalTransaction, erc20ApprovalTransaction } from "@polymarket/sdk/lib/utils";
import { BrowserProvider, JsonRpcSigner, MaxUint256, ethers } from "ethers6";

type TAllowances = {
    usdcAllowanceCtf: bigint;
    usdcAllowanceExchange: bigint;
    conditionalAll: boolean;
};

export function getUsdcContract(wallet: ethers.JsonRpcSigner): ethers.Contract {
    const contracts = getContracts(Number(PUBLIC_POLYGON_TESTNET) === 1 ? 80001 : 137);
    return new ethers.Contract(contracts.Collateral, usdcAbi, wallet);
}

export function getCtfContract(wallet: ethers.JsonRpcSigner): ethers.Contract {
    const contracts = getContracts(Number(PUBLIC_POLYGON_TESTNET) === 1 ? 80001 : 137);
    return new ethers.Contract(contracts.Conditional, ctfAbi, wallet);
}

export type TOrderbookSummary = {
    sell: number;
    buy: number;
    mid: number;
} | null

export type TLimitOrderFormatted = {
    price: number;
    shares: number;
    total: number;
}

export const reduceLimitOrders = (limitOrders: [number, number][]) => limitOrders.reduce((acc: TLimitOrderFormatted[], val) => {
    if (limitOrders.length === 0) return [];
    return [
        ...acc,
        {
            price: val[0],
            shares: val[1],
            total:
                acc.length > 0
                    ? acc[acc.length - 1].total + val[0] * val[1]
                    : val[0] * val[1],
        },
    ];
}, [])

export async function getOrderbookSummary(token_id: string, market: pmMarketFulldata): Promise<TOrderbookSummary | null> {

    let orderdata = market.orderdata.get(token_id);
    if (!orderdata) return null;

    if (
        orderdata.book.asks.length === 0 ||
        orderdata.book.bids.length === 0
    ) {
        console.log("Requesting orderbook from clob directly...")
        const clob = new ClobClient(PUBLIC_PM_CLOB_URL, Chain.POLYGON);
        const book = await clob.getOrderBook(token_id);
        if (book.bids) orderdata.book.bids = book.bids.map(e => [Number(e.price), Number(e.size)])
        if (book.asks) orderdata.book.asks = book.asks.map(e => [Number(e.price), Number(e.size)])
    }

    let bestBid = 0.5;
    let bestAsk = 0.5;

    if (orderdata.book.bids.length > 0) {
        if (orderdata.book.bids.length > 1) orderdata.book.bids.sort((a, b) => b[0] - a[0]);
        bestBid = orderdata.book.bids[0][0]
    }
    if (orderdata.book.asks.length > 0) {
        if (orderdata.book.asks.length > 1) orderdata.book.asks.sort((a, b) => a[0] - b[0]);
        bestBid = orderdata.book.asks[0][0]
    }
    return {
        sell: bestAsk,
        buy: bestBid,
        mid: Number(((bestAsk + bestBid) / 2).toFixed(2))
    };
}

export const getSpread = (orderbook: pmTokenOrderBook) => {
    if (orderbook.asks.length === 0 || orderbook.bids.length === 0) return 0;
    return Math.abs(
        50 -
        orderbook.bids.sort(
            (a, b) => b[0] - a[0]
        )[0][0] -
        (50 -
            orderbook.asks.sort(
                (a, b) => a[0] - b[0]
            )[0][0])
    )
}

export const getMidpoint = (orderbook: pmTokenOrderBook) => {
    if (orderbook.asks.length === 0 || orderbook.bids.length === 0) return 0;
    const spread = getSpread(orderbook);
    return orderbook.asks.sort((a, b) => a[0] - b[0])[0][0] + spread / 2
}

export const getAllowances = async (
    rpc: ethers.BrowserProvider,
    address: string
): Promise<TAllowances | undefined> => {

    const contracts = getContracts(
        Number(PUBLIC_POLYGON_TESTNET) === 1 ? 80001 : 137
    );

    const usdc = new ethers.Contract(
        contracts.Collateral,
        usdcAbi,
        rpc
    );
    const ctf = new ethers.Contract(
        contracts.Conditional,
        ctfAbi,
        rpc
    );
    const ctfAddress = await ctf.getAddress();

    const usdcAllowanceCtf = await usdc.allowance(address, ctfAddress);

    const usdcAllowanceExchange = await usdc.allowance(
        address,
        contracts.Exchange
    );

    const conditionalAll = await ctf.isApprovedForAll(
        address,
        contracts.Exchange
    );

    return {
        usdcAllowanceCtf,
        usdcAllowanceExchange,
        conditionalAll,
    };
};

export const setAllowances = async (
    address: string,
    allowances: TAllowances,
    wallet: JsonRpcSigner,
    rpc: BrowserProvider
): Promise<TAllowances | undefined> => {

    const contracts = getContracts(
        Number(PUBLIC_POLYGON_TESTNET) === 1 ? 80001 : 137
    );

    const ctf = new ethers.Contract(contracts.Conditional, ctfAbi, wallet);
    const usdc = new ethers.Contract(contracts.Collateral, usdcAbi, wallet);
    const usdc_address = await usdc.getAddress();

    let txn;

    if (address !== wallet.address) {
        const proxyWalletFactory = new ethers.Contract(
            "0xaB45c5A4B0c941a2F231C04C3f49182e1A254052",
            proxyWalletFactoryAbi,
            wallet
        );
        if (!(allowances.usdcAllowanceCtf > 0n)) {
            txn = await proxyWalletFactory
                .proxy([
                    erc20ApprovalTransaction(
                        usdc_address,
                        contracts.Conditional,
                        MaxUint256
                    ),
                ])
                .catch((e) => {
                    console.error(e);
                    return e;
                });
            console.log(txn);
        }
        if (!(allowances.usdcAllowanceExchange > 0n)) {
            txn = await proxyWalletFactory
                .proxy([
                    erc20ApprovalTransaction(
                        usdc_address,
                        contracts.Exchange,
                        MaxUint256
                    ),
                ])
                .catch((e) => {
                    console.error(e);
                    return e;
                });
            console.log(txn);
        }
        if (!allowances.conditionalAll) {
            txn = await proxyWalletFactory
                .proxy([
                    erc1155ApprovalTransaction(
                        await ctf.getAddress(),
                        contracts.Exchange,
                        !allowances.conditionalAll
                    ),
                ])
                .catch((e) => {
                    console.error(e);
                    return e;
                });
            console.log(txn);
        }
    } else {
        if (!(allowances.usdcAllowanceCtf > 0n)) {
            txn = await usdc.approve(contracts.Conditional, MaxUint256);
            console.log(txn);
        }
        if (!(allowances.usdcAllowanceExchange > 0n)) {
            txn = await usdc.approve(contracts.Exchange, MaxUint256);
            console.log(txn);
        }
        if (!allowances.conditionalAll) {
            txn = await ctf.setApprovalForAll(
                contracts.Exchange,
                !allowances.conditionalAll
            );
            console.log(txn);
        }
    }

    return getAllowances(rpc, address);
};