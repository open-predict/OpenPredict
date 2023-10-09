import type { TUser } from '@am/backend/types/user.js';

export type TUsers = Map<string, TUser | null>;

export type TUsernames = Map<string, { username: string | null; }>

export type TComment = {
    createdAt: Date;
    userKey: string;
    content: string;
};

export type TComments = TComment[];

export type TLikes = string[];

export type pmMarketFulldata = {
    data: pmMarketData,
    tokenOrderdata: Map<string, pmTokenOrderdata>,
    meta: pmMarketSummarydata,
}

export type pmMarketSummarydata = {
    volume: BigInt,
}

export type pmFilledOrders = {
    id: string,
    ts: number,
    maker: string,
    taker: string,
    side: "buy" | "sell",
    size: BigInt,
    price: number,
};

export type pmPriceHistoryPoint = {
    t: number,
    price: number,    
}

export type pmTokenOrderdata = {
    book: {
        asks: [number, number][],
        bids: [number, number][],
    },

    priceHistory: pmPriceHistoryPoint[],

    filledOrders: pmFilledOrders[]

    positions: {
        user: string,
        position: BigInt,
    }[]
}

export type pmMarketData = {
    condition_id: string,
    question_id: string,
    tokens: pmTokenData[],

    active: boolean,
    closed: boolean,

    question: string,
    description: string,

    end_date_iso: string,

    categories: string[],
    parent_categories: string[],

    icon: string,
    image: string,

    fpmm: string,
    accepting_orders: boolean,

    // TODO: Add these
    comments: TComments,
    likes: string[]

}

export type pmTokenData = {
    token_id: string,
    outcome: string,
    winner: boolean | undefined,
}