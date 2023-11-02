import { PUBLIC_PM_CLOB_URL, PUBLIC_POLYGON_TESTNET } from "$env/static/public";
import { ctfAbi } from "$lib/abi/ctfAbi";
import { proxyWalletFactoryAbi } from "$lib/abi/pwfAbi";
import { usdcAbi } from "$lib/abi/usdcAbi";
import { Chain, ClobClient } from "$lib/clob";
import type { pmTokenData, pmMarketFulldata } from "@am/backend/types/market";
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

export async function getOrderbookSummary(id: string, market: pmMarketFulldata): Promise<{
    sell: number,
    buy: number,
    mid: number,
} | null> {
    let orderdata = market.orderdata.get(id);
    if (!orderdata) return null;

    if (
        orderdata.book.asks.length === 0 ||
        orderdata.book.bids.length === 0
    ) {
        console.log("Requesting orderbook from clob directly...")
        const clob = new ClobClient(PUBLIC_PM_CLOB_URL, Chain.POLYGON);
        const book = await clob.getOrderBook(id);
        if (book) {
            orderdata.book = {
                bids: book.bids.map(e => [Number(e.price), Number(e.size)]),
                asks: book.asks.map(e => [Number(e.price), Number(e.size)]),
            }
        }
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