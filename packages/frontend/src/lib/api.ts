import type { marketFulldata, marketPricePoint, marketTradeChaindata, marketUserChaindata, pmTokenData } from '@am/backend/types/market';
import type { TComments, TUsers, pmFilledOrders, pmMarketFulldata, pmTokenOrderdata } from '$lib/types';
import { faker } from '@faker-js/faker';
import { PublicKey } from '@solana/web3.js';
import { USDC_PER_DOLLAR } from '$lib/web3_utils';
import type { TUser } from '@am/backend/types/user';

function randomizeString(input: string): string {
    const characters = input.split('');
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    return characters.join('');
}

const solanaAddress = "D2BB5wDLzzRxP5RbiiXhip6Bg8tNf5P6bcVi7G1NxGKT";

export const users: TUsers = Array.from(Array(8)).map(() => ({
    username: faker.internet.userName(),
    metadata: {
        version: 0,
        name: faker.name.fullName(),
        image: faker.image.avatar(),
        description: faker.lorem.sentence(1),
        links: []
    }
})).reduce((acc, value) => {
    acc.set(randomizeString(solanaAddress), value)
    return acc;
}, new Map())

const UserAccounts: Map<string, marketUserChaindata> = Array.from(users.keys()).reduce((acc, value) => {
    acc.set(value, { Version: 1, Shares: faker.datatype.bigInt() })
    return acc;
}, new Map())

let lastPriceHistoryDate = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000));

const PriceHistory: marketPricePoint[] = Array.from(Array(faker.datatype.number({ min: 0, max: 20 }))).map(() => {
    const limit = new Date(lastPriceHistoryDate.getTime() + (1 * 24 * 60 * 60 * 1000))
    const point = {
        "At": faker.date.between(lastPriceHistoryDate, limit),
        "No": faker.datatype.bigInt(),
        "Yes": faker.datatype.bigInt(),
        "Subsidy": 100n
    }
    lastPriceHistoryDate = limit;
    return point;
})

let lastSlot = 1;
let lastTradeDate = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000));

const Trades: marketTradeChaindata[] = Array.from(Array(faker.datatype.number({ min: 0, max: 20 }))).map(() => {
    const limit = new Date(lastTradeDate.getTime() + (1 * 24 * 60 * 60 * 1000))
    const date = faker.date.between(lastTradeDate, limit)
    const trade: marketTradeChaindata = {
        "slot": faker.datatype.number({ min: lastSlot, max: lastSlot + 5 }),
        "blockTime": date.getTime(),
        "direction": faker.datatype.boolean(),
        "drift": faker.datatype.bigInt({ min: -10n, max: 10n }),
        "expectedShares": faker.datatype.bigInt({ min: 0n, max: 10000000 }),
        "microUSDC": faker.datatype.bigInt({ min: 0n })
    }
    lastSlot = trade.slot;
    lastTradeDate = date;
    return trade;
})

const opMarkets: marketFulldata[] = Array.from(Array(5)).map(() => ({
    data: {
        CommentCount: faker.datatype.number({ min: 0, max: 100 }),
        Likes: new Set(users.keys()),
        UserAccounts,
        PriceHistory,
        Trades,
        data: {
            "AmmAddress": new PublicKey(solanaAddress).toBuffer(),
            "IPFS_Cid": new PublicKey(solanaAddress).toBuffer(),
            "Version": 1,
            "Yes": faker.datatype.bigInt(),
            "No": faker.datatype.bigInt(),
            "Subsidy": faker.datatype.bigInt({ min: 0n, max: BigInt(USDC_PER_DOLLAR * 100) }),
            "Resolved": faker.datatype.number({ min: 0, max: 2 }) === 0 ? null : faker.datatype.boolean(),
            "OperatorKey": new PublicKey(solanaAddress),
        }
    },
    metadata: {
        "version": 0,
        "title": faker.lorem.sentences(1),
        "description": faker.lorem.paragraph(2)
    }
}));

const comments = Array.from(Array(faker.datatype.number({ min: 0, max: 20 }))).map(() => {
    return ({
        "content": faker.lorem.sentences(faker.datatype.number({ min: 1, max: 5 })),
        "createdAt": faker.date.past(),
        "userKey": Array.from(users.keys())[faker.datatype.number({ min: 0, max: users.size - 1 })]
    })
})

const book = () => {
    const spread = faker.datatype.number({ min: 0, max: 15, precision: 2 });
    const midpoint = faker.datatype.number({ min: 0, max: 100, precision: 2 });
    const bids: [number, number][] = Array.from(Array(faker.datatype.number({ min: 2, max: 50 }))).map(() => {
        const price = faker.datatype.number({ min: 0, max: Math.max(midpoint - (0.5 * spread), 49.95), precision: 2 })
        return [price, faker.datatype.number({ min: 1, max: 100000 })]
    })
    const asks: [number, number][] = Array.from(Array(faker.datatype.number({ min: 2, max: 50 }))).map(() => {
        const price = faker.datatype.number({ min: Math.min(midpoint + (0.5 * spread), 99.50), max: 100, precision: 2 })
        return [price, faker.datatype.number({ min: 1, max: 100000 })]
    })
    return { bids, asks }
}

const orders: pmFilledOrders[] = Array.from(Array(faker.datatype.number({ min: 0, max: 20 }))).map((_, i) => {
    const before = new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
    const order = {
        id: faker.finance.ethereumAddress(),
        maker: Array.from(users.keys())[0],
        price: faker.datatype.number({ min: 1, max: 99, precision: 2 }),
        side: faker.datatype.boolean() ? "buy" : "sell" as "buy" | "sell",
        size: faker.datatype.bigInt({ min: 10000n, max: 1000000n }),
        taker: Array.from(users.keys())[0],
        ts: faker.date.between(before, new Date()).getTime(),
    }
    return order;
})

const pmMarkets: pmMarketFulldata[] = Array.from(Array(5)).map(() => {
    const active = faker.datatype.boolean();
    const tokenData: pmTokenData[] = Array.from(Array(2)).map((_, i) => {
        return {
            token_id: faker.finance.ethereumAddress(),
            outcome: i === 0 ? "Yes" : i === 1 ? "No" : "Other",
            winner: active ? undefined : faker.datatype.boolean()
        }
    });
    const address = faker.finance.ethereumAddress();
    const image = faker.image.imageUrl();
    const m: pmMarketFulldata = {
        meta: {
            volume: faker.datatype.bigInt({ min: 0n, max: 10000000n }),
        },
        data: {
            "accepting_orders": active,
            "active": active,
            "categories": [faker.word.noun()],
            "closed": !active,
            "condition_id": address,
            "description": faker.lorem.paragraphs(2),
            "end_date_iso": lastTradeDate.toISOString(),
            "fpmm": address,
            "icon": faker.image.imageUrl(),
            "image": image,
            "parent_categories": [faker.word.noun()],
            "question": faker.lorem.lines(1),
            "question_id": address,
            "tokens": tokenData,
            comments: comments,
            likes: Array.from(UserAccounts.keys()),
        },
        tokenOrderdata: tokenData.map((t, i) => {
            const tokenPriceHistory = Array.from(PriceHistory.entries()).map(php => ({
                t: php[1].At.getTime(),
                price: faker.datatype.number({ min: 0.99, max: 49.99, precision: 2 })
            }))
            const td: pmTokenOrderdata = {
                book: book(),
                filledOrders: orders,
                positions: Array.from(UserAccounts.entries()).map(e => ({
                    user: e[0],
                    position: e[1].Shares,
                })),
                priceHistory: i ? Array.from(PriceHistory.entries()).map((php, i) => ({
                    t: php[1].At.getTime(),
                    price: 50 - tokenPriceHistory[i].price
                })) : tokenPriceHistory
            }
            return td;
        }).reduce((acc, value, i) => {
            acc.set(tokenData[i].token_id, value)
            return acc;
        }, new Map()),
    }
    return m;
})

export type TMarketWrapper = {
    id: string,
    volume: bigint,
    traders: string[],
    comments: number,
    likes: string[],
    opMarket?: marketFulldata,
    pmMarket?: pmMarketFulldata
}

export async function searchMarkets(): Promise<TMarketWrapper[]> {

    let markets: TMarketWrapper[] = [];

    opMarkets.forEach(market => {
        markets.push({
            id: new PublicKey(market.data.data.AmmAddress).toBase58(),
            volume: faker.datatype.bigInt({ min: 0n, max: 10000000n }),
            comments: market.data.CommentCount,
            traders: Array.from(market.data.UserAccounts.keys()),
            likes: Array.from(market.data.Likes),
            opMarket: market
        })
    })

    pmMarkets.forEach(market => {
        markets.push({
            id: market.data.condition_id,
            volume: BigInt(Number(market.meta.volume)),
            comments: market.data.comments.length,
            traders: Array.from(market.tokenOrderdata.values()).reduce((acc: string[], val) => { acc = [...acc, ...val.positions.map(p => p.user)]; return acc }, []),
            likes: market.data.likes,
            pmMarket: market
        })
    })

    return markets
}

export async function getComments(id: string): Promise<TComments> {
    return Array.from(Array(faker.datatype.number({ min: 0, max: 10 }))).map(() => {
        return ({
            "content": faker.lorem.sentences(faker.datatype.number({ min: 1, max: 5 })),
            "createdAt": faker.date.past(),
            "userKey": Array.from(users.keys())[faker.datatype.number({ min: 0, max: users.size - 1 })]
        })
    })
}

export async function getMarket(id: string): Promise<{ pmMarket?: pmMarketFulldata, opMarket?: marketFulldata }> {
    if (id.startsWith("0x")) {
        return {
            pmMarket: pmMarkets.find(m => m.data.condition_id === id) ?? pmMarkets[0]
        }
    } else if (id.length >= 32 && id.length <= 44) {
        return {
            opMarket: opMarkets.find(m => new PublicKey(m.data.data.AmmAddress).toBase58() === id) ?? opMarkets[0]
        }
    } else {
        return {};
    }
}

export async function getMarketAccounts(id: string): Promise<{
    opMarkets: marketFulldata[],
    pmMarkets: pmMarketFulldata[],
}> {
    return ({
        pmMarkets,
        opMarkets
    })
}

export async function getUser(id: string): Promise<TUser | null> {
    return Array.from(users.values())[faker.datatype.number({ min: 0, max: users.size - 1 })];
}

export async function recordShare(id: string): Promise<boolean> {
    return faker.datatype.boolean();
}

export async function recordLike(id: string): Promise<boolean> {
    return faker.datatype.boolean();
}

export const api = {
    getRelatedMarkets: searchMarkets,
    getMarketAccounts,
    searchMarkets,
    getUser,
    getComments,
    getMarket,
    recordShare,
    recordLike
}
