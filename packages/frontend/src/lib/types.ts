import type { marketTradeChaindata, marketUserChaindata, pmMarketData } from '@am/backend/types/market';
import type { TUser } from '@am/backend/types/user.js';

export type TBook = {
    asks: [number, number][];
    bids: [number, number][];
}

export type TBooks = Map<string, TBook>;

export type TUsers = Map<string, TUser | null>;

export type TSubgraph = {
    volume: bigint,
    trades: marketTradeChaindata[], 
    positions: Map<string, marketUserChaindata>,
    comments: TComments, 
    likes: string[]
}

export type TPmMarket = {
    data: pmMarketData,
    book: TBooks, 
    subgraph: TSubgraph
}

export type TUsernames = Map<string, { username: string | null; }>

export type TComment = {
    createdAt: Date;
    userKey: string;
    content: string;
};

export type TComments = TComment[];

export type TLikes = string[];