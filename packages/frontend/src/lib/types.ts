import type { marketFulldata, pmMarketFulldata, pmUserMap } from "@am/backend/types/market"
import type { TUser } from "@am/backend/types/user"
import type { TOrderbookSummary } from "./utils/pm";
import type { AppRouter, AppRouterOutputs } from "@am/backend/server/routers/_app";

export type TUsers = Map<string, TUser | null>;
export type TUsernames = Map<string, { username: string | null; }>

export type TPmMarket = AppRouterOutputs['getPmMarket']['data'] & {
    likeNo: number,
    commentNo: number,
}

export type TOpMarket = AppRouterOutputs['getMarket']['market'] & {
    likeNo: number,
    commentNo: number,
}

export type TLikes = AppRouterOutputs['getMarket']['likes'];

export type TComment = {
    content: string;
    userKey: Buffer;
    createdAt: Date;
};

export type TUserMinimal = {
    image: string;
    id: string;
    name?: string;
};

export type TMarket = {
    pmMarket?: TPmMarket,
    opMarket?: TOpMarket
}

export type TTokenData = {
    outcome: string,
    color: string,
    data: {
        date: Date;
        price: number;
    }[];
}