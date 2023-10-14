import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { MeshHTTPHandler } from '@graphql-mesh/http';
import { ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import type { PolymarketTypes } from './sources/polymarket/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigDecimal: any;
    BigInt: any;
    Bytes: any;
    Int8: any;
};
export type Account = {
    /** User address */
    id: Scalars['ID'];
    /** Timestamp at which account first interacted with Polymarket */
    creationTimestamp: Scalars['BigInt'];
    /** Timestamp at which account most recently interacted with Polymarket */
    lastSeenTimestamp: Scalars['BigInt'];
    /** Total volume of this user's trades in USDC base units */
    collateralVolume: Scalars['BigInt'];
    /** Total number of trades performed by this user */
    numTrades: Scalars['BigInt'];
    /** Total volume of this user's trades in USDC scaled by 10^6 */
    scaledCollateralVolume: Scalars['BigDecimal'];
    /** Timestamp of last Buy or Sell transaction */
    lastTradedTimestamp: Scalars['BigInt'];
    /** Markets in which user has provided liquidity */
    fpmmPoolMemberships?: Maybe<Array<FpmmPoolMembership>>;
    /** Markets in which the user has taken a position on the outcome */
    marketPositions?: Maybe<Array<MarketPosition>>;
    /** Purchases and sales of shares by the user */
    transactions?: Maybe<Array<Transaction>>;
    /** Split of collateral / outcome tokens into multiple positions */
    splits?: Maybe<Array<Split>>;
    /** Merge of more specific outcome tokens into collateral / more general outcome tokens */
    merges?: Maybe<Array<Merge>>;
    /** Redemption of underlying collateral after a market has resolved */
    redemptions?: Maybe<Array<Redemption>>;
};
export type AccountfpmmPoolMembershipsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmPoolMembership_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmPoolMembership_filter>;
};
export type AccountmarketPositionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<MarketPosition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MarketPosition_filter>;
};
export type AccounttransactionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Transaction_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Transaction_filter>;
};
export type AccountsplitsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Split_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Split_filter>;
};
export type AccountmergesArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Merge_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Merge_filter>;
};
export type AccountredemptionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Redemption_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Redemption_filter>;
};
export type Account_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    creationTimestamp?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_not?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    creationTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    lastSeenTimestamp?: InputMaybe<Scalars['BigInt']>;
    lastSeenTimestamp_not?: InputMaybe<Scalars['BigInt']>;
    lastSeenTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
    lastSeenTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
    lastSeenTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
    lastSeenTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
    lastSeenTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    lastSeenTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    numTrades?: InputMaybe<Scalars['BigInt']>;
    numTrades_not?: InputMaybe<Scalars['BigInt']>;
    numTrades_gt?: InputMaybe<Scalars['BigInt']>;
    numTrades_lt?: InputMaybe<Scalars['BigInt']>;
    numTrades_gte?: InputMaybe<Scalars['BigInt']>;
    numTrades_lte?: InputMaybe<Scalars['BigInt']>;
    numTrades_in?: InputMaybe<Array<Scalars['BigInt']>>;
    numTrades_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    lastTradedTimestamp?: InputMaybe<Scalars['BigInt']>;
    lastTradedTimestamp_not?: InputMaybe<Scalars['BigInt']>;
    lastTradedTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
    lastTradedTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
    lastTradedTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
    lastTradedTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
    lastTradedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    lastTradedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fpmmPoolMemberships_?: InputMaybe<FpmmPoolMembership_filter>;
    marketPositions_?: InputMaybe<MarketPosition_filter>;
    transactions_?: InputMaybe<Transaction_filter>;
    splits_?: InputMaybe<Split_filter>;
    merges_?: InputMaybe<Merge_filter>;
    redemptions_?: InputMaybe<Redemption_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Account_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Account_filter>>>;
};
export type Account_orderBy = 'id' | 'creationTimestamp' | 'lastSeenTimestamp' | 'collateralVolume' | 'numTrades' | 'scaledCollateralVolume' | 'lastTradedTimestamp' | 'fpmmPoolMemberships' | 'marketPositions' | 'transactions' | 'splits' | 'merges' | 'redemptions';
export type BlockChangedFilter = {
    number_gte: Scalars['Int'];
};
export type Block_height = {
    hash?: InputMaybe<Scalars['Bytes']>;
    number?: InputMaybe<Scalars['Int']>;
    number_gte?: InputMaybe<Scalars['Int']>;
};
export type Collateral = {
    /** Token address */
    id: Scalars['ID'];
    name: Scalars['String'];
    symbol: Scalars['String'];
    decimals: Scalars['Int'];
};
export type Collateral_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    name?: InputMaybe<Scalars['String']>;
    name_not?: InputMaybe<Scalars['String']>;
    name_gt?: InputMaybe<Scalars['String']>;
    name_lt?: InputMaybe<Scalars['String']>;
    name_gte?: InputMaybe<Scalars['String']>;
    name_lte?: InputMaybe<Scalars['String']>;
    name_in?: InputMaybe<Array<Scalars['String']>>;
    name_not_in?: InputMaybe<Array<Scalars['String']>>;
    name_contains?: InputMaybe<Scalars['String']>;
    name_contains_nocase?: InputMaybe<Scalars['String']>;
    name_not_contains?: InputMaybe<Scalars['String']>;
    name_not_contains_nocase?: InputMaybe<Scalars['String']>;
    name_starts_with?: InputMaybe<Scalars['String']>;
    name_starts_with_nocase?: InputMaybe<Scalars['String']>;
    name_not_starts_with?: InputMaybe<Scalars['String']>;
    name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    name_ends_with?: InputMaybe<Scalars['String']>;
    name_ends_with_nocase?: InputMaybe<Scalars['String']>;
    name_not_ends_with?: InputMaybe<Scalars['String']>;
    name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    symbol?: InputMaybe<Scalars['String']>;
    symbol_not?: InputMaybe<Scalars['String']>;
    symbol_gt?: InputMaybe<Scalars['String']>;
    symbol_lt?: InputMaybe<Scalars['String']>;
    symbol_gte?: InputMaybe<Scalars['String']>;
    symbol_lte?: InputMaybe<Scalars['String']>;
    symbol_in?: InputMaybe<Array<Scalars['String']>>;
    symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
    symbol_contains?: InputMaybe<Scalars['String']>;
    symbol_contains_nocase?: InputMaybe<Scalars['String']>;
    symbol_not_contains?: InputMaybe<Scalars['String']>;
    symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
    symbol_starts_with?: InputMaybe<Scalars['String']>;
    symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
    symbol_not_starts_with?: InputMaybe<Scalars['String']>;
    symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    symbol_ends_with?: InputMaybe<Scalars['String']>;
    symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
    symbol_not_ends_with?: InputMaybe<Scalars['String']>;
    symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    decimals?: InputMaybe<Scalars['Int']>;
    decimals_not?: InputMaybe<Scalars['Int']>;
    decimals_gt?: InputMaybe<Scalars['Int']>;
    decimals_lt?: InputMaybe<Scalars['Int']>;
    decimals_gte?: InputMaybe<Scalars['Int']>;
    decimals_lte?: InputMaybe<Scalars['Int']>;
    decimals_in?: InputMaybe<Array<Scalars['Int']>>;
    decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Collateral_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Collateral_filter>>>;
};
export type Collateral_orderBy = 'id' | 'name' | 'symbol' | 'decimals';
export type Condition = {
    id: Scalars['ID'];
    /** Address which can resolve this condition */
    oracle: Scalars['Bytes'];
    /** Question ID which corresponds to this condition */
    questionId: Scalars['Bytes'];
    /** Number of possible outcomes for this condition */
    outcomeSlotCount: Scalars['Int'];
    /** Timestamp at which this condition was resolved */
    resolutionTimestamp?: Maybe<Scalars['BigInt']>;
    /** Fraction of collateral assigned to each outcome */
    payouts?: Maybe<Array<Scalars['BigDecimal']>>;
    payoutNumerators?: Maybe<Array<Scalars['BigInt']>>;
    payoutDenominator?: Maybe<Scalars['BigInt']>;
    /** Market makers which are trading on this condition */
    fixedProductMarketMakers: Array<FixedProductMarketMaker>;
    /** Hash of the resolution transaction */
    resolutionHash?: Maybe<Scalars['Bytes']>;
};
export type ConditionfixedProductMarketMakersArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FixedProductMarketMaker_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FixedProductMarketMaker_filter>;
};
export type Condition_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    oracle?: InputMaybe<Scalars['Bytes']>;
    oracle_not?: InputMaybe<Scalars['Bytes']>;
    oracle_gt?: InputMaybe<Scalars['Bytes']>;
    oracle_lt?: InputMaybe<Scalars['Bytes']>;
    oracle_gte?: InputMaybe<Scalars['Bytes']>;
    oracle_lte?: InputMaybe<Scalars['Bytes']>;
    oracle_in?: InputMaybe<Array<Scalars['Bytes']>>;
    oracle_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    oracle_contains?: InputMaybe<Scalars['Bytes']>;
    oracle_not_contains?: InputMaybe<Scalars['Bytes']>;
    questionId?: InputMaybe<Scalars['Bytes']>;
    questionId_not?: InputMaybe<Scalars['Bytes']>;
    questionId_gt?: InputMaybe<Scalars['Bytes']>;
    questionId_lt?: InputMaybe<Scalars['Bytes']>;
    questionId_gte?: InputMaybe<Scalars['Bytes']>;
    questionId_lte?: InputMaybe<Scalars['Bytes']>;
    questionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
    questionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    questionId_contains?: InputMaybe<Scalars['Bytes']>;
    questionId_not_contains?: InputMaybe<Scalars['Bytes']>;
    outcomeSlotCount?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_not?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_gt?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_lt?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_gte?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_lte?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_in?: InputMaybe<Array<Scalars['Int']>>;
    outcomeSlotCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
    resolutionTimestamp?: InputMaybe<Scalars['BigInt']>;
    resolutionTimestamp_not?: InputMaybe<Scalars['BigInt']>;
    resolutionTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
    resolutionTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
    resolutionTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
    resolutionTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
    resolutionTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    resolutionTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    payouts?: InputMaybe<Array<Scalars['BigDecimal']>>;
    payouts_not?: InputMaybe<Array<Scalars['BigDecimal']>>;
    payouts_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    payouts_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    payouts_not_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    payouts_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    payoutNumerators?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutNumerators_not?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutNumerators_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutNumerators_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutNumerators_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutNumerators_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutDenominator?: InputMaybe<Scalars['BigInt']>;
    payoutDenominator_not?: InputMaybe<Scalars['BigInt']>;
    payoutDenominator_gt?: InputMaybe<Scalars['BigInt']>;
    payoutDenominator_lt?: InputMaybe<Scalars['BigInt']>;
    payoutDenominator_gte?: InputMaybe<Scalars['BigInt']>;
    payoutDenominator_lte?: InputMaybe<Scalars['BigInt']>;
    payoutDenominator_in?: InputMaybe<Array<Scalars['BigInt']>>;
    payoutDenominator_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fixedProductMarketMakers?: InputMaybe<Array<Scalars['String']>>;
    fixedProductMarketMakers_not?: InputMaybe<Array<Scalars['String']>>;
    fixedProductMarketMakers_contains?: InputMaybe<Array<Scalars['String']>>;
    fixedProductMarketMakers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
    fixedProductMarketMakers_not_contains?: InputMaybe<Array<Scalars['String']>>;
    fixedProductMarketMakers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
    fixedProductMarketMakers_?: InputMaybe<FixedProductMarketMaker_filter>;
    resolutionHash?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_not?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_gt?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_lt?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_gte?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_lte?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
    resolutionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    resolutionHash_contains?: InputMaybe<Scalars['Bytes']>;
    resolutionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Condition_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Condition_filter>>>;
};
export type Condition_orderBy = 'id' | 'oracle' | 'questionId' | 'outcomeSlotCount' | 'resolutionTimestamp' | 'payouts' | 'payoutNumerators' | 'payoutDenominator' | 'fixedProductMarketMakers' | 'resolutionHash';
export type FilledOrder = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which transaction occurred */
    timestamp: Scalars['BigInt'];
    /** Addresses of the maker and the taker */
    maker: Account;
    taker: Account;
    /** Order bytes */
    orderHash: Scalars['Bytes'];
    /** Market which transaction is interacting with */
    market: FilledOrderBook;
    /** Buy or Sell transaction */
    side: TradeType;
    /** Amount of collateral in trade */
    size: Scalars['BigInt'];
    /** Price of the conditional token */
    price: Scalars['BigDecimal'];
};
export type FilledOrderBook = {
    /** Token Id */
    id: Scalars['ID'];
    /** Buy orders */
    buys: Array<FilledOrder>;
    /** Sell orders */
    sells: Array<FilledOrder>;
    /** Number of trades of any kind against this order book */
    tradesQuantity: Scalars['BigInt'];
    /** Number of purchases of shares from this order book */
    buysQuantity: Scalars['BigInt'];
    /** Number of sales of shares to this order book */
    sellsQuantity: Scalars['BigInt'];
    /** Market volume in terms of the underlying collateral value */
    collateralVolume: Scalars['BigInt'];
    /** Volume scaled by the number of decimals of collateralToken */
    scaledCollateralVolume: Scalars['BigDecimal'];
    /** Global volume of share purchases in USDC base units */
    collateralBuyVolume: Scalars['BigInt'];
    /** Global volume of share purchases in USDC scaled by 10^6 */
    scaledCollateralBuyVolume: Scalars['BigDecimal'];
    /** Global volume of share sales in USDC base units */
    collateralSellVolume: Scalars['BigInt'];
    /** Global volume of share sales in USDC scaled by 10^6 */
    scaledCollateralSellVolume: Scalars['BigDecimal'];
    /** Timestamp of last day during which someone made a trade */
    lastActiveDay: Scalars['BigInt'];
};
export type FilledOrderBookbuysArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrder_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrder_filter>;
};
export type FilledOrderBooksellsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrder_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrder_filter>;
};
export type FilledOrderBook_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    buys?: InputMaybe<Array<Scalars['String']>>;
    buys_not?: InputMaybe<Array<Scalars['String']>>;
    buys_contains?: InputMaybe<Array<Scalars['String']>>;
    buys_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
    buys_not_contains?: InputMaybe<Array<Scalars['String']>>;
    buys_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
    buys_?: InputMaybe<FilledOrder_filter>;
    sells?: InputMaybe<Array<Scalars['String']>>;
    sells_not?: InputMaybe<Array<Scalars['String']>>;
    sells_contains?: InputMaybe<Array<Scalars['String']>>;
    sells_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
    sells_not_contains?: InputMaybe<Array<Scalars['String']>>;
    sells_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
    sells_?: InputMaybe<FilledOrder_filter>;
    tradesQuantity?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_not?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradesQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_not?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_not?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralBuyVolume?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralBuyVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralSellVolume?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralSellVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    lastActiveDay?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_not?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_gt?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_lt?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_gte?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_lte?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_in?: InputMaybe<Array<Scalars['BigInt']>>;
    lastActiveDay_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FilledOrderBook_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FilledOrderBook_filter>>>;
};
export type FilledOrderBook_orderBy = 'id' | 'buys' | 'sells' | 'tradesQuantity' | 'buysQuantity' | 'sellsQuantity' | 'collateralVolume' | 'scaledCollateralVolume' | 'collateralBuyVolume' | 'scaledCollateralBuyVolume' | 'collateralSellVolume' | 'scaledCollateralSellVolume' | 'lastActiveDay';
export type FilledOrderGlobal = {
    /** ID is empty string, this is a singleton */
    id: Scalars['ID'];
    /** Number of trades of any kind for all order books */
    tradesQuantity: Scalars['BigInt'];
    /** Number of purchases of shares from any order book */
    buysQuantity: Scalars['BigInt'];
    /** Number of sales of shares to any order book */
    sellsQuantity: Scalars['BigInt'];
    /** Global volume in USDC base units */
    collateralVolume: Scalars['BigDecimal'];
    /** Global volume in USDC scaled by 10^6 */
    scaledCollateralVolume: Scalars['BigDecimal'];
    /** Global volume of share purchases in USDC base units */
    collateralBuyVolume: Scalars['BigDecimal'];
    /** Global volume of share purchases in USDC scaled by 10^6 */
    scaledCollateralBuyVolume: Scalars['BigDecimal'];
    /** Global volume of share sales in USDC base units */
    collateralSellVolume: Scalars['BigDecimal'];
    /** Global volume of share sales in USDC scaled by 10^6 */
    scaledCollateralSellVolume: Scalars['BigDecimal'];
};
export type FilledOrderGlobal_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    tradesQuantity?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_not?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradesQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_not?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_not?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume?: InputMaybe<Scalars['BigDecimal']>;
    collateralVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    collateralVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    collateralVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    collateralVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    collateralVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    collateralVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralBuyVolume?: InputMaybe<Scalars['BigDecimal']>;
    collateralBuyVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    collateralBuyVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    collateralBuyVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    collateralBuyVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    collateralBuyVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    collateralBuyVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralBuyVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralSellVolume?: InputMaybe<Scalars['BigDecimal']>;
    collateralSellVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    collateralSellVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    collateralSellVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    collateralSellVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    collateralSellVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    collateralSellVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralSellVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FilledOrderGlobal_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FilledOrderGlobal_filter>>>;
};
export type FilledOrderGlobal_orderBy = 'id' | 'tradesQuantity' | 'buysQuantity' | 'sellsQuantity' | 'collateralVolume' | 'scaledCollateralVolume' | 'collateralBuyVolume' | 'scaledCollateralBuyVolume' | 'collateralSellVolume' | 'scaledCollateralSellVolume';
export type FilledOrder_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    maker?: InputMaybe<Scalars['String']>;
    maker_not?: InputMaybe<Scalars['String']>;
    maker_gt?: InputMaybe<Scalars['String']>;
    maker_lt?: InputMaybe<Scalars['String']>;
    maker_gte?: InputMaybe<Scalars['String']>;
    maker_lte?: InputMaybe<Scalars['String']>;
    maker_in?: InputMaybe<Array<Scalars['String']>>;
    maker_not_in?: InputMaybe<Array<Scalars['String']>>;
    maker_contains?: InputMaybe<Scalars['String']>;
    maker_contains_nocase?: InputMaybe<Scalars['String']>;
    maker_not_contains?: InputMaybe<Scalars['String']>;
    maker_not_contains_nocase?: InputMaybe<Scalars['String']>;
    maker_starts_with?: InputMaybe<Scalars['String']>;
    maker_starts_with_nocase?: InputMaybe<Scalars['String']>;
    maker_not_starts_with?: InputMaybe<Scalars['String']>;
    maker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    maker_ends_with?: InputMaybe<Scalars['String']>;
    maker_ends_with_nocase?: InputMaybe<Scalars['String']>;
    maker_not_ends_with?: InputMaybe<Scalars['String']>;
    maker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    maker_?: InputMaybe<Account_filter>;
    taker?: InputMaybe<Scalars['String']>;
    taker_not?: InputMaybe<Scalars['String']>;
    taker_gt?: InputMaybe<Scalars['String']>;
    taker_lt?: InputMaybe<Scalars['String']>;
    taker_gte?: InputMaybe<Scalars['String']>;
    taker_lte?: InputMaybe<Scalars['String']>;
    taker_in?: InputMaybe<Array<Scalars['String']>>;
    taker_not_in?: InputMaybe<Array<Scalars['String']>>;
    taker_contains?: InputMaybe<Scalars['String']>;
    taker_contains_nocase?: InputMaybe<Scalars['String']>;
    taker_not_contains?: InputMaybe<Scalars['String']>;
    taker_not_contains_nocase?: InputMaybe<Scalars['String']>;
    taker_starts_with?: InputMaybe<Scalars['String']>;
    taker_starts_with_nocase?: InputMaybe<Scalars['String']>;
    taker_not_starts_with?: InputMaybe<Scalars['String']>;
    taker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    taker_ends_with?: InputMaybe<Scalars['String']>;
    taker_ends_with_nocase?: InputMaybe<Scalars['String']>;
    taker_not_ends_with?: InputMaybe<Scalars['String']>;
    taker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    taker_?: InputMaybe<Account_filter>;
    orderHash?: InputMaybe<Scalars['Bytes']>;
    orderHash_not?: InputMaybe<Scalars['Bytes']>;
    orderHash_gt?: InputMaybe<Scalars['Bytes']>;
    orderHash_lt?: InputMaybe<Scalars['Bytes']>;
    orderHash_gte?: InputMaybe<Scalars['Bytes']>;
    orderHash_lte?: InputMaybe<Scalars['Bytes']>;
    orderHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
    orderHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    orderHash_contains?: InputMaybe<Scalars['Bytes']>;
    orderHash_not_contains?: InputMaybe<Scalars['Bytes']>;
    market?: InputMaybe<Scalars['String']>;
    market_not?: InputMaybe<Scalars['String']>;
    market_gt?: InputMaybe<Scalars['String']>;
    market_lt?: InputMaybe<Scalars['String']>;
    market_gte?: InputMaybe<Scalars['String']>;
    market_lte?: InputMaybe<Scalars['String']>;
    market_in?: InputMaybe<Array<Scalars['String']>>;
    market_not_in?: InputMaybe<Array<Scalars['String']>>;
    market_contains?: InputMaybe<Scalars['String']>;
    market_contains_nocase?: InputMaybe<Scalars['String']>;
    market_not_contains?: InputMaybe<Scalars['String']>;
    market_not_contains_nocase?: InputMaybe<Scalars['String']>;
    market_starts_with?: InputMaybe<Scalars['String']>;
    market_starts_with_nocase?: InputMaybe<Scalars['String']>;
    market_not_starts_with?: InputMaybe<Scalars['String']>;
    market_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    market_ends_with?: InputMaybe<Scalars['String']>;
    market_ends_with_nocase?: InputMaybe<Scalars['String']>;
    market_not_ends_with?: InputMaybe<Scalars['String']>;
    market_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    market_?: InputMaybe<FilledOrderBook_filter>;
    side?: InputMaybe<TradeType>;
    side_not?: InputMaybe<TradeType>;
    side_in?: InputMaybe<Array<TradeType>>;
    side_not_in?: InputMaybe<Array<TradeType>>;
    size?: InputMaybe<Scalars['BigInt']>;
    size_not?: InputMaybe<Scalars['BigInt']>;
    size_gt?: InputMaybe<Scalars['BigInt']>;
    size_lt?: InputMaybe<Scalars['BigInt']>;
    size_gte?: InputMaybe<Scalars['BigInt']>;
    size_lte?: InputMaybe<Scalars['BigInt']>;
    size_in?: InputMaybe<Array<Scalars['BigInt']>>;
    size_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    price?: InputMaybe<Scalars['BigDecimal']>;
    price_not?: InputMaybe<Scalars['BigDecimal']>;
    price_gt?: InputMaybe<Scalars['BigDecimal']>;
    price_lt?: InputMaybe<Scalars['BigDecimal']>;
    price_gte?: InputMaybe<Scalars['BigDecimal']>;
    price_lte?: InputMaybe<Scalars['BigDecimal']>;
    price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FilledOrder_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FilledOrder_filter>>>;
};
export type FilledOrder_orderBy = 'id' | 'timestamp' | 'maker' | 'maker__id' | 'maker__creationTimestamp' | 'maker__lastSeenTimestamp' | 'maker__collateralVolume' | 'maker__numTrades' | 'maker__scaledCollateralVolume' | 'maker__lastTradedTimestamp' | 'taker' | 'taker__id' | 'taker__creationTimestamp' | 'taker__lastSeenTimestamp' | 'taker__collateralVolume' | 'taker__numTrades' | 'taker__scaledCollateralVolume' | 'taker__lastTradedTimestamp' | 'orderHash' | 'market' | 'market__id' | 'market__tradesQuantity' | 'market__buysQuantity' | 'market__sellsQuantity' | 'market__collateralVolume' | 'market__scaledCollateralVolume' | 'market__collateralBuyVolume' | 'market__scaledCollateralBuyVolume' | 'market__collateralSellVolume' | 'market__scaledCollateralSellVolume' | 'market__lastActiveDay' | 'side' | 'size' | 'price';
export type FilledOrdersEvent = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which filled occurred */
    timestamp: Scalars['BigInt'];
    /** Address of the person that placed the market order */
    taker: Account;
    /** Address of the asset that the taker is giving away(for buy, it's the collateral, for sell it's the conditional) */
    makerAsset: Scalars['Bytes'];
    takerAsset: Scalars['Bytes'];
    /** Maker assetId */
    makerAssetID: Scalars['BigInt'];
    /** Taker assetId */
    takerAssetID: Scalars['BigInt'];
    /** Maker amount filled */
    makerAmountFilled: Scalars['BigInt'];
    /** Taker amount filled */
    takerAmountFilled: Scalars['BigInt'];
    /** Fee paid */
    fee: Scalars['BigInt'];
};
export type FilledOrdersEvent_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    taker?: InputMaybe<Scalars['String']>;
    taker_not?: InputMaybe<Scalars['String']>;
    taker_gt?: InputMaybe<Scalars['String']>;
    taker_lt?: InputMaybe<Scalars['String']>;
    taker_gte?: InputMaybe<Scalars['String']>;
    taker_lte?: InputMaybe<Scalars['String']>;
    taker_in?: InputMaybe<Array<Scalars['String']>>;
    taker_not_in?: InputMaybe<Array<Scalars['String']>>;
    taker_contains?: InputMaybe<Scalars['String']>;
    taker_contains_nocase?: InputMaybe<Scalars['String']>;
    taker_not_contains?: InputMaybe<Scalars['String']>;
    taker_not_contains_nocase?: InputMaybe<Scalars['String']>;
    taker_starts_with?: InputMaybe<Scalars['String']>;
    taker_starts_with_nocase?: InputMaybe<Scalars['String']>;
    taker_not_starts_with?: InputMaybe<Scalars['String']>;
    taker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    taker_ends_with?: InputMaybe<Scalars['String']>;
    taker_ends_with_nocase?: InputMaybe<Scalars['String']>;
    taker_not_ends_with?: InputMaybe<Scalars['String']>;
    taker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    taker_?: InputMaybe<Account_filter>;
    makerAsset?: InputMaybe<Scalars['Bytes']>;
    makerAsset_not?: InputMaybe<Scalars['Bytes']>;
    makerAsset_gt?: InputMaybe<Scalars['Bytes']>;
    makerAsset_lt?: InputMaybe<Scalars['Bytes']>;
    makerAsset_gte?: InputMaybe<Scalars['Bytes']>;
    makerAsset_lte?: InputMaybe<Scalars['Bytes']>;
    makerAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    makerAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    makerAsset_contains?: InputMaybe<Scalars['Bytes']>;
    makerAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    takerAsset?: InputMaybe<Scalars['Bytes']>;
    takerAsset_not?: InputMaybe<Scalars['Bytes']>;
    takerAsset_gt?: InputMaybe<Scalars['Bytes']>;
    takerAsset_lt?: InputMaybe<Scalars['Bytes']>;
    takerAsset_gte?: InputMaybe<Scalars['Bytes']>;
    takerAsset_lte?: InputMaybe<Scalars['Bytes']>;
    takerAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    takerAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    takerAsset_contains?: InputMaybe<Scalars['Bytes']>;
    takerAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    makerAssetID?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_not?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_gt?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_lt?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_gte?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_lte?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_in?: InputMaybe<Array<Scalars['BigInt']>>;
    makerAssetID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAssetID?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_not?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_gt?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_lt?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_gte?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_lte?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAssetID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    makerAmountFilled?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_not?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_gt?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_lt?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_gte?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_lte?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']>>;
    makerAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAmountFilled?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_not?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_gt?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_lt?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_gte?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_lte?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fee?: InputMaybe<Scalars['BigInt']>;
    fee_not?: InputMaybe<Scalars['BigInt']>;
    fee_gt?: InputMaybe<Scalars['BigInt']>;
    fee_lt?: InputMaybe<Scalars['BigInt']>;
    fee_gte?: InputMaybe<Scalars['BigInt']>;
    fee_lte?: InputMaybe<Scalars['BigInt']>;
    fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FilledOrdersEvent_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FilledOrdersEvent_filter>>>;
};
export type FilledOrdersEvent_orderBy = 'id' | 'timestamp' | 'taker' | 'taker__id' | 'taker__creationTimestamp' | 'taker__lastSeenTimestamp' | 'taker__collateralVolume' | 'taker__numTrades' | 'taker__scaledCollateralVolume' | 'taker__lastTradedTimestamp' | 'makerAsset' | 'takerAsset' | 'makerAssetID' | 'takerAssetID' | 'makerAmountFilled' | 'takerAmountFilled' | 'fee';
export type FixedProductMarketMaker = {
    /** Market maker address */
    id: Scalars['ID'];
    /** Address which deployed this market */
    creator: Scalars['Bytes'];
    /** Time at which this market was deployed */
    creationTimestamp: Scalars['BigInt'];
    /** Hash of deployment transactions */
    creationTransactionHash: Scalars['Bytes'];
    /** Token which is colleralising this market */
    collateralToken: Collateral;
    /** Conditions which this market is trading against */
    conditions?: Maybe<Array<Condition>>;
    /** Percentage fee of trades taken by market maker. A 2% fee is represented as 2*10^16 */
    fee: Scalars['BigInt'];
    /** Number of trades of any kind against this market maker */
    tradesQuantity: Scalars['BigInt'];
    /** Number of purchases of shares from this market maker */
    buysQuantity: Scalars['BigInt'];
    /** Number of sales of shares to this market maker */
    sellsQuantity: Scalars['BigInt'];
    /** Number of times liquidity has been added to this market maker */
    liquidityAddQuantity: Scalars['BigInt'];
    /** Number of times liquidity has been removed from this market maker */
    liquidityRemoveQuantity: Scalars['BigInt'];
    /** Market volume in terms of the underlying collateral value */
    collateralVolume: Scalars['BigInt'];
    /** Volume scaled by the number of decimals of collateralToken */
    scaledCollateralVolume: Scalars['BigDecimal'];
    /** Global volume of share purchases in USDC base units */
    collateralBuyVolume: Scalars['BigInt'];
    /** Global volume of share purchases in USDC scaled by 10^6 */
    scaledCollateralBuyVolume: Scalars['BigDecimal'];
    /** Global volume of share sales in USDC base units */
    collateralSellVolume: Scalars['BigInt'];
    /** Global volume of share sales in USDC scaled by 10^6 */
    scaledCollateralSellVolume: Scalars['BigDecimal'];
    /** Fees collected in terms of the underlying collateral value */
    feeVolume: Scalars['BigInt'];
    /** Fees scaled by the number of decimals of collateralToken */
    scaledFeeVolume: Scalars['BigDecimal'];
    /** Constant product parameter k */
    liquidityParameter: Scalars['BigInt'];
    scaledLiquidityParameter: Scalars['BigDecimal'];
    /** Balances of each outcome token held by the market maker */
    outcomeTokenAmounts: Array<Scalars['BigInt']>;
    /** Prices at which market maker values each outcome token */
    outcomeTokenPrices: Array<Scalars['BigDecimal']>;
    /** Number of outcomes which this market maker is trading */
    outcomeSlotCount?: Maybe<Scalars['Int']>;
    /** Timestamp of last day during which someone made a trade */
    lastActiveDay: Scalars['BigInt'];
    /** Number of shares for tokens in the market maker's reserves */
    totalSupply: Scalars['BigInt'];
    /** Addresses which are supplying liquidity to the market maker */
    poolMembers?: Maybe<Array<FpmmPoolMembership>>;
};
export type FixedProductMarketMakerconditionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Condition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Condition_filter>;
};
export type FixedProductMarketMakerpoolMembersArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmPoolMembership_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmPoolMembership_filter>;
};
export type FixedProductMarketMaker_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    creator?: InputMaybe<Scalars['Bytes']>;
    creator_not?: InputMaybe<Scalars['Bytes']>;
    creator_gt?: InputMaybe<Scalars['Bytes']>;
    creator_lt?: InputMaybe<Scalars['Bytes']>;
    creator_gte?: InputMaybe<Scalars['Bytes']>;
    creator_lte?: InputMaybe<Scalars['Bytes']>;
    creator_in?: InputMaybe<Array<Scalars['Bytes']>>;
    creator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    creator_contains?: InputMaybe<Scalars['Bytes']>;
    creator_not_contains?: InputMaybe<Scalars['Bytes']>;
    creationTimestamp?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_not?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
    creationTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    creationTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    creationTransactionHash?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_not?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_gt?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_lt?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_gte?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_lte?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
    creationTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    creationTransactionHash_contains?: InputMaybe<Scalars['Bytes']>;
    creationTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
    collateralToken?: InputMaybe<Scalars['String']>;
    collateralToken_not?: InputMaybe<Scalars['String']>;
    collateralToken_gt?: InputMaybe<Scalars['String']>;
    collateralToken_lt?: InputMaybe<Scalars['String']>;
    collateralToken_gte?: InputMaybe<Scalars['String']>;
    collateralToken_lte?: InputMaybe<Scalars['String']>;
    collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_contains?: InputMaybe<Scalars['String']>;
    collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_?: InputMaybe<Collateral_filter>;
    conditions_?: InputMaybe<Condition_filter>;
    fee?: InputMaybe<Scalars['BigInt']>;
    fee_not?: InputMaybe<Scalars['BigInt']>;
    fee_gt?: InputMaybe<Scalars['BigInt']>;
    fee_lt?: InputMaybe<Scalars['BigInt']>;
    fee_gte?: InputMaybe<Scalars['BigInt']>;
    fee_lte?: InputMaybe<Scalars['BigInt']>;
    fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradesQuantity?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_not?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradesQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_not?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_not?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    liquidityAddQuantity?: InputMaybe<Scalars['BigInt']>;
    liquidityAddQuantity_not?: InputMaybe<Scalars['BigInt']>;
    liquidityAddQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    liquidityAddQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    liquidityAddQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    liquidityAddQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    liquidityAddQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    liquidityAddQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    liquidityRemoveQuantity?: InputMaybe<Scalars['BigInt']>;
    liquidityRemoveQuantity_not?: InputMaybe<Scalars['BigInt']>;
    liquidityRemoveQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    liquidityRemoveQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    liquidityRemoveQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    liquidityRemoveQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    liquidityRemoveQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    liquidityRemoveQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralBuyVolume?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralBuyVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralSellVolume?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralSellVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    feeVolume?: InputMaybe<Scalars['BigInt']>;
    feeVolume_not?: InputMaybe<Scalars['BigInt']>;
    feeVolume_gt?: InputMaybe<Scalars['BigInt']>;
    feeVolume_lt?: InputMaybe<Scalars['BigInt']>;
    feeVolume_gte?: InputMaybe<Scalars['BigInt']>;
    feeVolume_lte?: InputMaybe<Scalars['BigInt']>;
    feeVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    feeVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledFeeVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledFeeVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledFeeVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledFeeVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledFeeVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledFeeVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledFeeVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledFeeVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    liquidityParameter?: InputMaybe<Scalars['BigInt']>;
    liquidityParameter_not?: InputMaybe<Scalars['BigInt']>;
    liquidityParameter_gt?: InputMaybe<Scalars['BigInt']>;
    liquidityParameter_lt?: InputMaybe<Scalars['BigInt']>;
    liquidityParameter_gte?: InputMaybe<Scalars['BigInt']>;
    liquidityParameter_lte?: InputMaybe<Scalars['BigInt']>;
    liquidityParameter_in?: InputMaybe<Array<Scalars['BigInt']>>;
    liquidityParameter_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledLiquidityParameter?: InputMaybe<Scalars['BigDecimal']>;
    scaledLiquidityParameter_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledLiquidityParameter_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledLiquidityParameter_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledLiquidityParameter_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledLiquidityParameter_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledLiquidityParameter_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledLiquidityParameter_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeTokenAmounts?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokenPrices?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeTokenPrices_not?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeTokenPrices_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeTokenPrices_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeTokenPrices_not_contains?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeTokenPrices_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']>>;
    outcomeSlotCount?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_not?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_gt?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_lt?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_gte?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_lte?: InputMaybe<Scalars['Int']>;
    outcomeSlotCount_in?: InputMaybe<Array<Scalars['Int']>>;
    outcomeSlotCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
    lastActiveDay?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_not?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_gt?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_lt?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_gte?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_lte?: InputMaybe<Scalars['BigInt']>;
    lastActiveDay_in?: InputMaybe<Array<Scalars['BigInt']>>;
    lastActiveDay_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    totalSupply?: InputMaybe<Scalars['BigInt']>;
    totalSupply_not?: InputMaybe<Scalars['BigInt']>;
    totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
    totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
    totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
    totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
    totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
    totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    poolMembers_?: InputMaybe<FpmmPoolMembership_filter>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FixedProductMarketMaker_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FixedProductMarketMaker_filter>>>;
};
export type FixedProductMarketMaker_orderBy = 'id' | 'creator' | 'creationTimestamp' | 'creationTransactionHash' | 'collateralToken' | 'collateralToken__id' | 'collateralToken__name' | 'collateralToken__symbol' | 'collateralToken__decimals' | 'conditions' | 'fee' | 'tradesQuantity' | 'buysQuantity' | 'sellsQuantity' | 'liquidityAddQuantity' | 'liquidityRemoveQuantity' | 'collateralVolume' | 'scaledCollateralVolume' | 'collateralBuyVolume' | 'scaledCollateralBuyVolume' | 'collateralSellVolume' | 'scaledCollateralSellVolume' | 'feeVolume' | 'scaledFeeVolume' | 'liquidityParameter' | 'scaledLiquidityParameter' | 'outcomeTokenAmounts' | 'outcomeTokenPrices' | 'outcomeSlotCount' | 'lastActiveDay' | 'totalSupply' | 'poolMembers';
export type FpmmFundingAddition = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which funding addition occurred */
    timestamp: Scalars['BigInt'];
    /** FPMM to which funding is being added */
    fpmm: FixedProductMarketMaker;
    /** Account adding funding */
    funder: Account;
    /** Outcome tokens amounts added to FPMM */
    amountsAdded: Array<Scalars['BigInt']>;
    /** Outcome tokens amounts refunded to funder */
    amountsRefunded: Array<Scalars['BigInt']>;
    /** Liquidity shares minted to funder */
    sharesMinted: Scalars['BigInt'];
};
export type FpmmFundingAddition_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fpmm?: InputMaybe<Scalars['String']>;
    fpmm_not?: InputMaybe<Scalars['String']>;
    fpmm_gt?: InputMaybe<Scalars['String']>;
    fpmm_lt?: InputMaybe<Scalars['String']>;
    fpmm_gte?: InputMaybe<Scalars['String']>;
    fpmm_lte?: InputMaybe<Scalars['String']>;
    fpmm_in?: InputMaybe<Array<Scalars['String']>>;
    fpmm_not_in?: InputMaybe<Array<Scalars['String']>>;
    fpmm_contains?: InputMaybe<Scalars['String']>;
    fpmm_contains_nocase?: InputMaybe<Scalars['String']>;
    fpmm_not_contains?: InputMaybe<Scalars['String']>;
    fpmm_not_contains_nocase?: InputMaybe<Scalars['String']>;
    fpmm_starts_with?: InputMaybe<Scalars['String']>;
    fpmm_starts_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_not_starts_with?: InputMaybe<Scalars['String']>;
    fpmm_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_ends_with?: InputMaybe<Scalars['String']>;
    fpmm_ends_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_not_ends_with?: InputMaybe<Scalars['String']>;
    fpmm_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_?: InputMaybe<FixedProductMarketMaker_filter>;
    funder?: InputMaybe<Scalars['String']>;
    funder_not?: InputMaybe<Scalars['String']>;
    funder_gt?: InputMaybe<Scalars['String']>;
    funder_lt?: InputMaybe<Scalars['String']>;
    funder_gte?: InputMaybe<Scalars['String']>;
    funder_lte?: InputMaybe<Scalars['String']>;
    funder_in?: InputMaybe<Array<Scalars['String']>>;
    funder_not_in?: InputMaybe<Array<Scalars['String']>>;
    funder_contains?: InputMaybe<Scalars['String']>;
    funder_contains_nocase?: InputMaybe<Scalars['String']>;
    funder_not_contains?: InputMaybe<Scalars['String']>;
    funder_not_contains_nocase?: InputMaybe<Scalars['String']>;
    funder_starts_with?: InputMaybe<Scalars['String']>;
    funder_starts_with_nocase?: InputMaybe<Scalars['String']>;
    funder_not_starts_with?: InputMaybe<Scalars['String']>;
    funder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    funder_ends_with?: InputMaybe<Scalars['String']>;
    funder_ends_with_nocase?: InputMaybe<Scalars['String']>;
    funder_not_ends_with?: InputMaybe<Scalars['String']>;
    funder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    funder_?: InputMaybe<Account_filter>;
    amountsAdded?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsAdded_not?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsAdded_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsAdded_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsAdded_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsAdded_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRefunded?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRefunded_not?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRefunded_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRefunded_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRefunded_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRefunded_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    sharesMinted?: InputMaybe<Scalars['BigInt']>;
    sharesMinted_not?: InputMaybe<Scalars['BigInt']>;
    sharesMinted_gt?: InputMaybe<Scalars['BigInt']>;
    sharesMinted_lt?: InputMaybe<Scalars['BigInt']>;
    sharesMinted_gte?: InputMaybe<Scalars['BigInt']>;
    sharesMinted_lte?: InputMaybe<Scalars['BigInt']>;
    sharesMinted_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sharesMinted_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FpmmFundingAddition_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FpmmFundingAddition_filter>>>;
};
export type FpmmFundingAddition_orderBy = 'id' | 'timestamp' | 'fpmm' | 'fpmm__id' | 'fpmm__creator' | 'fpmm__creationTimestamp' | 'fpmm__creationTransactionHash' | 'fpmm__fee' | 'fpmm__tradesQuantity' | 'fpmm__buysQuantity' | 'fpmm__sellsQuantity' | 'fpmm__liquidityAddQuantity' | 'fpmm__liquidityRemoveQuantity' | 'fpmm__collateralVolume' | 'fpmm__scaledCollateralVolume' | 'fpmm__collateralBuyVolume' | 'fpmm__scaledCollateralBuyVolume' | 'fpmm__collateralSellVolume' | 'fpmm__scaledCollateralSellVolume' | 'fpmm__feeVolume' | 'fpmm__scaledFeeVolume' | 'fpmm__liquidityParameter' | 'fpmm__scaledLiquidityParameter' | 'fpmm__outcomeSlotCount' | 'fpmm__lastActiveDay' | 'fpmm__totalSupply' | 'funder' | 'funder__id' | 'funder__creationTimestamp' | 'funder__lastSeenTimestamp' | 'funder__collateralVolume' | 'funder__numTrades' | 'funder__scaledCollateralVolume' | 'funder__lastTradedTimestamp' | 'amountsAdded' | 'amountsRefunded' | 'sharesMinted';
export type FpmmFundingRemoval = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which funding removal occurred */
    timestamp: Scalars['BigInt'];
    /** FPMM to which funding is being removed */
    fpmm: FixedProductMarketMaker;
    /** Account removing funding */
    funder: Account;
    /** Outcome tokens amounts removed from FPMM */
    amountsRemoved: Array<Scalars['BigInt']>;
    collateralRemoved: Scalars['BigInt'];
    /** Liquidity shares burned by funder */
    sharesBurnt: Scalars['BigInt'];
};
export type FpmmFundingRemoval_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    fpmm?: InputMaybe<Scalars['String']>;
    fpmm_not?: InputMaybe<Scalars['String']>;
    fpmm_gt?: InputMaybe<Scalars['String']>;
    fpmm_lt?: InputMaybe<Scalars['String']>;
    fpmm_gte?: InputMaybe<Scalars['String']>;
    fpmm_lte?: InputMaybe<Scalars['String']>;
    fpmm_in?: InputMaybe<Array<Scalars['String']>>;
    fpmm_not_in?: InputMaybe<Array<Scalars['String']>>;
    fpmm_contains?: InputMaybe<Scalars['String']>;
    fpmm_contains_nocase?: InputMaybe<Scalars['String']>;
    fpmm_not_contains?: InputMaybe<Scalars['String']>;
    fpmm_not_contains_nocase?: InputMaybe<Scalars['String']>;
    fpmm_starts_with?: InputMaybe<Scalars['String']>;
    fpmm_starts_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_not_starts_with?: InputMaybe<Scalars['String']>;
    fpmm_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_ends_with?: InputMaybe<Scalars['String']>;
    fpmm_ends_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_not_ends_with?: InputMaybe<Scalars['String']>;
    fpmm_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    fpmm_?: InputMaybe<FixedProductMarketMaker_filter>;
    funder?: InputMaybe<Scalars['String']>;
    funder_not?: InputMaybe<Scalars['String']>;
    funder_gt?: InputMaybe<Scalars['String']>;
    funder_lt?: InputMaybe<Scalars['String']>;
    funder_gte?: InputMaybe<Scalars['String']>;
    funder_lte?: InputMaybe<Scalars['String']>;
    funder_in?: InputMaybe<Array<Scalars['String']>>;
    funder_not_in?: InputMaybe<Array<Scalars['String']>>;
    funder_contains?: InputMaybe<Scalars['String']>;
    funder_contains_nocase?: InputMaybe<Scalars['String']>;
    funder_not_contains?: InputMaybe<Scalars['String']>;
    funder_not_contains_nocase?: InputMaybe<Scalars['String']>;
    funder_starts_with?: InputMaybe<Scalars['String']>;
    funder_starts_with_nocase?: InputMaybe<Scalars['String']>;
    funder_not_starts_with?: InputMaybe<Scalars['String']>;
    funder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    funder_ends_with?: InputMaybe<Scalars['String']>;
    funder_ends_with_nocase?: InputMaybe<Scalars['String']>;
    funder_not_ends_with?: InputMaybe<Scalars['String']>;
    funder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    funder_?: InputMaybe<Account_filter>;
    amountsRemoved?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRemoved_not?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRemoved_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRemoved_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRemoved_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    amountsRemoved_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralRemoved?: InputMaybe<Scalars['BigInt']>;
    collateralRemoved_not?: InputMaybe<Scalars['BigInt']>;
    collateralRemoved_gt?: InputMaybe<Scalars['BigInt']>;
    collateralRemoved_lt?: InputMaybe<Scalars['BigInt']>;
    collateralRemoved_gte?: InputMaybe<Scalars['BigInt']>;
    collateralRemoved_lte?: InputMaybe<Scalars['BigInt']>;
    collateralRemoved_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralRemoved_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sharesBurnt?: InputMaybe<Scalars['BigInt']>;
    sharesBurnt_not?: InputMaybe<Scalars['BigInt']>;
    sharesBurnt_gt?: InputMaybe<Scalars['BigInt']>;
    sharesBurnt_lt?: InputMaybe<Scalars['BigInt']>;
    sharesBurnt_gte?: InputMaybe<Scalars['BigInt']>;
    sharesBurnt_lte?: InputMaybe<Scalars['BigInt']>;
    sharesBurnt_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sharesBurnt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FpmmFundingRemoval_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FpmmFundingRemoval_filter>>>;
};
export type FpmmFundingRemoval_orderBy = 'id' | 'timestamp' | 'fpmm' | 'fpmm__id' | 'fpmm__creator' | 'fpmm__creationTimestamp' | 'fpmm__creationTransactionHash' | 'fpmm__fee' | 'fpmm__tradesQuantity' | 'fpmm__buysQuantity' | 'fpmm__sellsQuantity' | 'fpmm__liquidityAddQuantity' | 'fpmm__liquidityRemoveQuantity' | 'fpmm__collateralVolume' | 'fpmm__scaledCollateralVolume' | 'fpmm__collateralBuyVolume' | 'fpmm__scaledCollateralBuyVolume' | 'fpmm__collateralSellVolume' | 'fpmm__scaledCollateralSellVolume' | 'fpmm__feeVolume' | 'fpmm__scaledFeeVolume' | 'fpmm__liquidityParameter' | 'fpmm__scaledLiquidityParameter' | 'fpmm__outcomeSlotCount' | 'fpmm__lastActiveDay' | 'fpmm__totalSupply' | 'funder' | 'funder__id' | 'funder__creationTimestamp' | 'funder__lastSeenTimestamp' | 'funder__collateralVolume' | 'funder__numTrades' | 'funder__scaledCollateralVolume' | 'funder__lastTradedTimestamp' | 'amountsRemoved' | 'collateralRemoved' | 'sharesBurnt';
export type FpmmPoolMembership = {
    /** funder address + pool address */
    id: Scalars['ID'];
    /** Market to which funder is providing funding */
    pool: FixedProductMarketMaker;
    /** Account which is providing funding */
    funder: Account;
    /** Amount of liquidity tokens owned by funder */
    amount: Scalars['BigInt'];
};
export type FpmmPoolMembership_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    pool?: InputMaybe<Scalars['String']>;
    pool_not?: InputMaybe<Scalars['String']>;
    pool_gt?: InputMaybe<Scalars['String']>;
    pool_lt?: InputMaybe<Scalars['String']>;
    pool_gte?: InputMaybe<Scalars['String']>;
    pool_lte?: InputMaybe<Scalars['String']>;
    pool_in?: InputMaybe<Array<Scalars['String']>>;
    pool_not_in?: InputMaybe<Array<Scalars['String']>>;
    pool_contains?: InputMaybe<Scalars['String']>;
    pool_contains_nocase?: InputMaybe<Scalars['String']>;
    pool_not_contains?: InputMaybe<Scalars['String']>;
    pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
    pool_starts_with?: InputMaybe<Scalars['String']>;
    pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
    pool_not_starts_with?: InputMaybe<Scalars['String']>;
    pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    pool_ends_with?: InputMaybe<Scalars['String']>;
    pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
    pool_not_ends_with?: InputMaybe<Scalars['String']>;
    pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    pool_?: InputMaybe<FixedProductMarketMaker_filter>;
    funder?: InputMaybe<Scalars['String']>;
    funder_not?: InputMaybe<Scalars['String']>;
    funder_gt?: InputMaybe<Scalars['String']>;
    funder_lt?: InputMaybe<Scalars['String']>;
    funder_gte?: InputMaybe<Scalars['String']>;
    funder_lte?: InputMaybe<Scalars['String']>;
    funder_in?: InputMaybe<Array<Scalars['String']>>;
    funder_not_in?: InputMaybe<Array<Scalars['String']>>;
    funder_contains?: InputMaybe<Scalars['String']>;
    funder_contains_nocase?: InputMaybe<Scalars['String']>;
    funder_not_contains?: InputMaybe<Scalars['String']>;
    funder_not_contains_nocase?: InputMaybe<Scalars['String']>;
    funder_starts_with?: InputMaybe<Scalars['String']>;
    funder_starts_with_nocase?: InputMaybe<Scalars['String']>;
    funder_not_starts_with?: InputMaybe<Scalars['String']>;
    funder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    funder_ends_with?: InputMaybe<Scalars['String']>;
    funder_ends_with_nocase?: InputMaybe<Scalars['String']>;
    funder_not_ends_with?: InputMaybe<Scalars['String']>;
    funder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    funder_?: InputMaybe<Account_filter>;
    amount?: InputMaybe<Scalars['BigInt']>;
    amount_not?: InputMaybe<Scalars['BigInt']>;
    amount_gt?: InputMaybe<Scalars['BigInt']>;
    amount_lt?: InputMaybe<Scalars['BigInt']>;
    amount_gte?: InputMaybe<Scalars['BigInt']>;
    amount_lte?: InputMaybe<Scalars['BigInt']>;
    amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<FpmmPoolMembership_filter>>>;
    or?: InputMaybe<Array<InputMaybe<FpmmPoolMembership_filter>>>;
};
export type FpmmPoolMembership_orderBy = 'id' | 'pool' | 'pool__id' | 'pool__creator' | 'pool__creationTimestamp' | 'pool__creationTransactionHash' | 'pool__fee' | 'pool__tradesQuantity' | 'pool__buysQuantity' | 'pool__sellsQuantity' | 'pool__liquidityAddQuantity' | 'pool__liquidityRemoveQuantity' | 'pool__collateralVolume' | 'pool__scaledCollateralVolume' | 'pool__collateralBuyVolume' | 'pool__scaledCollateralBuyVolume' | 'pool__collateralSellVolume' | 'pool__scaledCollateralSellVolume' | 'pool__feeVolume' | 'pool__scaledFeeVolume' | 'pool__liquidityParameter' | 'pool__scaledLiquidityParameter' | 'pool__outcomeSlotCount' | 'pool__lastActiveDay' | 'pool__totalSupply' | 'funder' | 'funder__id' | 'funder__creationTimestamp' | 'funder__lastSeenTimestamp' | 'funder__collateralVolume' | 'funder__numTrades' | 'funder__scaledCollateralVolume' | 'funder__lastTradedTimestamp' | 'amount';
export type Global = {
    /** ID is empty string, this is a singleton */
    id: Scalars['ID'];
    numConditions: Scalars['Int'];
    numOpenConditions: Scalars['Int'];
    numClosedConditions: Scalars['Int'];
    /** Number of unique traders interacting with Polymarket */
    numTraders: Scalars['BigInt'];
    /** Number of trades of any kind for all market makers */
    tradesQuantity: Scalars['BigInt'];
    /** Number of purchases of shares from any market maker */
    buysQuantity: Scalars['BigInt'];
    /** Number of sales of shares to any market maker */
    sellsQuantity: Scalars['BigInt'];
    /** Global volume in USDC base units */
    collateralVolume: Scalars['BigInt'];
    /** Global volume in USDC scaled by 10^6 */
    scaledCollateralVolume: Scalars['BigDecimal'];
    /** Global fees in USDC base units */
    collateralFees: Scalars['BigInt'];
    /** Global fees in USDC scaled by 10^6 */
    scaledCollateralFees: Scalars['BigDecimal'];
    /** Global volume of share purchases in USDC base units */
    collateralBuyVolume: Scalars['BigInt'];
    /** Global volume of share purchases in USDC scaled by 10^6 */
    scaledCollateralBuyVolume: Scalars['BigDecimal'];
    /** Global volume of share sales in USDC base units */
    collateralSellVolume: Scalars['BigInt'];
    /** Global volume of share sales in USDC scaled by 10^6 */
    scaledCollateralSellVolume: Scalars['BigDecimal'];
};
export type Global_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    numConditions?: InputMaybe<Scalars['Int']>;
    numConditions_not?: InputMaybe<Scalars['Int']>;
    numConditions_gt?: InputMaybe<Scalars['Int']>;
    numConditions_lt?: InputMaybe<Scalars['Int']>;
    numConditions_gte?: InputMaybe<Scalars['Int']>;
    numConditions_lte?: InputMaybe<Scalars['Int']>;
    numConditions_in?: InputMaybe<Array<Scalars['Int']>>;
    numConditions_not_in?: InputMaybe<Array<Scalars['Int']>>;
    numOpenConditions?: InputMaybe<Scalars['Int']>;
    numOpenConditions_not?: InputMaybe<Scalars['Int']>;
    numOpenConditions_gt?: InputMaybe<Scalars['Int']>;
    numOpenConditions_lt?: InputMaybe<Scalars['Int']>;
    numOpenConditions_gte?: InputMaybe<Scalars['Int']>;
    numOpenConditions_lte?: InputMaybe<Scalars['Int']>;
    numOpenConditions_in?: InputMaybe<Array<Scalars['Int']>>;
    numOpenConditions_not_in?: InputMaybe<Array<Scalars['Int']>>;
    numClosedConditions?: InputMaybe<Scalars['Int']>;
    numClosedConditions_not?: InputMaybe<Scalars['Int']>;
    numClosedConditions_gt?: InputMaybe<Scalars['Int']>;
    numClosedConditions_lt?: InputMaybe<Scalars['Int']>;
    numClosedConditions_gte?: InputMaybe<Scalars['Int']>;
    numClosedConditions_lte?: InputMaybe<Scalars['Int']>;
    numClosedConditions_in?: InputMaybe<Array<Scalars['Int']>>;
    numClosedConditions_not_in?: InputMaybe<Array<Scalars['Int']>>;
    numTraders?: InputMaybe<Scalars['BigInt']>;
    numTraders_not?: InputMaybe<Scalars['BigInt']>;
    numTraders_gt?: InputMaybe<Scalars['BigInt']>;
    numTraders_lt?: InputMaybe<Scalars['BigInt']>;
    numTraders_gte?: InputMaybe<Scalars['BigInt']>;
    numTraders_lte?: InputMaybe<Scalars['BigInt']>;
    numTraders_in?: InputMaybe<Array<Scalars['BigInt']>>;
    numTraders_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradesQuantity?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_not?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    tradesQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradesQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_not?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    buysQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    buysQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_not?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    sellsQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    sellsQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralFees?: InputMaybe<Scalars['BigInt']>;
    collateralFees_not?: InputMaybe<Scalars['BigInt']>;
    collateralFees_gt?: InputMaybe<Scalars['BigInt']>;
    collateralFees_lt?: InputMaybe<Scalars['BigInt']>;
    collateralFees_gte?: InputMaybe<Scalars['BigInt']>;
    collateralFees_lte?: InputMaybe<Scalars['BigInt']>;
    collateralFees_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralFees_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralFees?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralFees_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralFees_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralFees_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralFees_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralFees_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralFees_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralFees_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralBuyVolume?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralBuyVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralBuyVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralBuyVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralBuyVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    collateralSellVolume?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_not?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_gt?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_lt?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_gte?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_lte?: InputMaybe<Scalars['BigInt']>;
    collateralSellVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
    collateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    scaledCollateralSellVolume?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_not?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
    scaledCollateralSellVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    scaledCollateralSellVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Global_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Global_filter>>>;
};
export type Global_orderBy = 'id' | 'numConditions' | 'numOpenConditions' | 'numClosedConditions' | 'numTraders' | 'tradesQuantity' | 'buysQuantity' | 'sellsQuantity' | 'collateralVolume' | 'scaledCollateralVolume' | 'collateralFees' | 'scaledCollateralFees' | 'collateralBuyVolume' | 'scaledCollateralBuyVolume' | 'collateralSellVolume' | 'scaledCollateralSellVolume';
export type MarketPosition = {
    id: Scalars['ID'];
    /** Market on which this position is on */
    market: FixedProductMarketMaker;
    /** Address which holds this position */
    user: Account;
    /** The outcome which this position is supporting */
    outcomeIndex: Scalars['BigInt'];
    /** Number of outcome shares that the user has ever bought */
    quantityBought: Scalars['BigInt'];
    /** Number of outcome shares that the user has ever sold */
    quantitySold: Scalars['BigInt'];
    /** Number of outcome shares that the user current has */
    netQuantity: Scalars['BigInt'];
    /** Total value of outcome shares that the user has bought */
    valueBought: Scalars['BigInt'];
    /** Total value of outcome shares that the user has sold */
    valueSold: Scalars['BigInt'];
    /** Total value paid by the user to enter this position */
    netValue: Scalars['BigInt'];
    /** Total amount of fees paid by user in relation to this position */
    feesPaid: Scalars['BigInt'];
};
export type MarketPosition_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    market?: InputMaybe<Scalars['String']>;
    market_not?: InputMaybe<Scalars['String']>;
    market_gt?: InputMaybe<Scalars['String']>;
    market_lt?: InputMaybe<Scalars['String']>;
    market_gte?: InputMaybe<Scalars['String']>;
    market_lte?: InputMaybe<Scalars['String']>;
    market_in?: InputMaybe<Array<Scalars['String']>>;
    market_not_in?: InputMaybe<Array<Scalars['String']>>;
    market_contains?: InputMaybe<Scalars['String']>;
    market_contains_nocase?: InputMaybe<Scalars['String']>;
    market_not_contains?: InputMaybe<Scalars['String']>;
    market_not_contains_nocase?: InputMaybe<Scalars['String']>;
    market_starts_with?: InputMaybe<Scalars['String']>;
    market_starts_with_nocase?: InputMaybe<Scalars['String']>;
    market_not_starts_with?: InputMaybe<Scalars['String']>;
    market_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    market_ends_with?: InputMaybe<Scalars['String']>;
    market_ends_with_nocase?: InputMaybe<Scalars['String']>;
    market_not_ends_with?: InputMaybe<Scalars['String']>;
    market_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    market_?: InputMaybe<FixedProductMarketMaker_filter>;
    user?: InputMaybe<Scalars['String']>;
    user_not?: InputMaybe<Scalars['String']>;
    user_gt?: InputMaybe<Scalars['String']>;
    user_lt?: InputMaybe<Scalars['String']>;
    user_gte?: InputMaybe<Scalars['String']>;
    user_lte?: InputMaybe<Scalars['String']>;
    user_in?: InputMaybe<Array<Scalars['String']>>;
    user_not_in?: InputMaybe<Array<Scalars['String']>>;
    user_contains?: InputMaybe<Scalars['String']>;
    user_contains_nocase?: InputMaybe<Scalars['String']>;
    user_not_contains?: InputMaybe<Scalars['String']>;
    user_not_contains_nocase?: InputMaybe<Scalars['String']>;
    user_starts_with?: InputMaybe<Scalars['String']>;
    user_starts_with_nocase?: InputMaybe<Scalars['String']>;
    user_not_starts_with?: InputMaybe<Scalars['String']>;
    user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    user_ends_with?: InputMaybe<Scalars['String']>;
    user_ends_with_nocase?: InputMaybe<Scalars['String']>;
    user_not_ends_with?: InputMaybe<Scalars['String']>;
    user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    user_?: InputMaybe<Account_filter>;
    outcomeIndex?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_not?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_gt?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_lt?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_gte?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_lte?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    quantityBought?: InputMaybe<Scalars['BigInt']>;
    quantityBought_not?: InputMaybe<Scalars['BigInt']>;
    quantityBought_gt?: InputMaybe<Scalars['BigInt']>;
    quantityBought_lt?: InputMaybe<Scalars['BigInt']>;
    quantityBought_gte?: InputMaybe<Scalars['BigInt']>;
    quantityBought_lte?: InputMaybe<Scalars['BigInt']>;
    quantityBought_in?: InputMaybe<Array<Scalars['BigInt']>>;
    quantityBought_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    quantitySold?: InputMaybe<Scalars['BigInt']>;
    quantitySold_not?: InputMaybe<Scalars['BigInt']>;
    quantitySold_gt?: InputMaybe<Scalars['BigInt']>;
    quantitySold_lt?: InputMaybe<Scalars['BigInt']>;
    quantitySold_gte?: InputMaybe<Scalars['BigInt']>;
    quantitySold_lte?: InputMaybe<Scalars['BigInt']>;
    quantitySold_in?: InputMaybe<Array<Scalars['BigInt']>>;
    quantitySold_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    netQuantity?: InputMaybe<Scalars['BigInt']>;
    netQuantity_not?: InputMaybe<Scalars['BigInt']>;
    netQuantity_gt?: InputMaybe<Scalars['BigInt']>;
    netQuantity_lt?: InputMaybe<Scalars['BigInt']>;
    netQuantity_gte?: InputMaybe<Scalars['BigInt']>;
    netQuantity_lte?: InputMaybe<Scalars['BigInt']>;
    netQuantity_in?: InputMaybe<Array<Scalars['BigInt']>>;
    netQuantity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    valueBought?: InputMaybe<Scalars['BigInt']>;
    valueBought_not?: InputMaybe<Scalars['BigInt']>;
    valueBought_gt?: InputMaybe<Scalars['BigInt']>;
    valueBought_lt?: InputMaybe<Scalars['BigInt']>;
    valueBought_gte?: InputMaybe<Scalars['BigInt']>;
    valueBought_lte?: InputMaybe<Scalars['BigInt']>;
    valueBought_in?: InputMaybe<Array<Scalars['BigInt']>>;
    valueBought_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    valueSold?: InputMaybe<Scalars['BigInt']>;
    valueSold_not?: InputMaybe<Scalars['BigInt']>;
    valueSold_gt?: InputMaybe<Scalars['BigInt']>;
    valueSold_lt?: InputMaybe<Scalars['BigInt']>;
    valueSold_gte?: InputMaybe<Scalars['BigInt']>;
    valueSold_lte?: InputMaybe<Scalars['BigInt']>;
    valueSold_in?: InputMaybe<Array<Scalars['BigInt']>>;
    valueSold_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    netValue?: InputMaybe<Scalars['BigInt']>;
    netValue_not?: InputMaybe<Scalars['BigInt']>;
    netValue_gt?: InputMaybe<Scalars['BigInt']>;
    netValue_lt?: InputMaybe<Scalars['BigInt']>;
    netValue_gte?: InputMaybe<Scalars['BigInt']>;
    netValue_lte?: InputMaybe<Scalars['BigInt']>;
    netValue_in?: InputMaybe<Array<Scalars['BigInt']>>;
    netValue_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    feesPaid?: InputMaybe<Scalars['BigInt']>;
    feesPaid_not?: InputMaybe<Scalars['BigInt']>;
    feesPaid_gt?: InputMaybe<Scalars['BigInt']>;
    feesPaid_lt?: InputMaybe<Scalars['BigInt']>;
    feesPaid_gte?: InputMaybe<Scalars['BigInt']>;
    feesPaid_lte?: InputMaybe<Scalars['BigInt']>;
    feesPaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
    feesPaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<MarketPosition_filter>>>;
    or?: InputMaybe<Array<InputMaybe<MarketPosition_filter>>>;
};
export type MarketPosition_orderBy = 'id' | 'market' | 'market__id' | 'market__creator' | 'market__creationTimestamp' | 'market__creationTransactionHash' | 'market__fee' | 'market__tradesQuantity' | 'market__buysQuantity' | 'market__sellsQuantity' | 'market__liquidityAddQuantity' | 'market__liquidityRemoveQuantity' | 'market__collateralVolume' | 'market__scaledCollateralVolume' | 'market__collateralBuyVolume' | 'market__scaledCollateralBuyVolume' | 'market__collateralSellVolume' | 'market__scaledCollateralSellVolume' | 'market__feeVolume' | 'market__scaledFeeVolume' | 'market__liquidityParameter' | 'market__scaledLiquidityParameter' | 'market__outcomeSlotCount' | 'market__lastActiveDay' | 'market__totalSupply' | 'user' | 'user__id' | 'user__creationTimestamp' | 'user__lastSeenTimestamp' | 'user__collateralVolume' | 'user__numTrades' | 'user__scaledCollateralVolume' | 'user__lastTradedTimestamp' | 'outcomeIndex' | 'quantityBought' | 'quantitySold' | 'netQuantity' | 'valueBought' | 'valueSold' | 'netValue' | 'feesPaid';
export type Merge = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which merge occurred */
    timestamp: Scalars['BigInt'];
    /** Address which is performing this merge */
    stakeholder: Account;
    /** Token which is collateralising positions being merged */
    collateralToken: Collateral;
    parentCollectionId: Scalars['Bytes'];
    /** Condition on which merge is occuring */
    condition: Condition;
    partition: Array<Scalars['BigInt']>;
    /** The amount of outcome tokens being merged */
    amount: Scalars['BigInt'];
};
export type Merge_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    stakeholder?: InputMaybe<Scalars['String']>;
    stakeholder_not?: InputMaybe<Scalars['String']>;
    stakeholder_gt?: InputMaybe<Scalars['String']>;
    stakeholder_lt?: InputMaybe<Scalars['String']>;
    stakeholder_gte?: InputMaybe<Scalars['String']>;
    stakeholder_lte?: InputMaybe<Scalars['String']>;
    stakeholder_in?: InputMaybe<Array<Scalars['String']>>;
    stakeholder_not_in?: InputMaybe<Array<Scalars['String']>>;
    stakeholder_contains?: InputMaybe<Scalars['String']>;
    stakeholder_contains_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_not_contains?: InputMaybe<Scalars['String']>;
    stakeholder_not_contains_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_starts_with?: InputMaybe<Scalars['String']>;
    stakeholder_starts_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_not_starts_with?: InputMaybe<Scalars['String']>;
    stakeholder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_ends_with?: InputMaybe<Scalars['String']>;
    stakeholder_ends_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_not_ends_with?: InputMaybe<Scalars['String']>;
    stakeholder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_?: InputMaybe<Account_filter>;
    collateralToken?: InputMaybe<Scalars['String']>;
    collateralToken_not?: InputMaybe<Scalars['String']>;
    collateralToken_gt?: InputMaybe<Scalars['String']>;
    collateralToken_lt?: InputMaybe<Scalars['String']>;
    collateralToken_gte?: InputMaybe<Scalars['String']>;
    collateralToken_lte?: InputMaybe<Scalars['String']>;
    collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_contains?: InputMaybe<Scalars['String']>;
    collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_?: InputMaybe<Collateral_filter>;
    parentCollectionId?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_not?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_gt?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_lt?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_gte?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_lte?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
    parentCollectionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    parentCollectionId_contains?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_not_contains?: InputMaybe<Scalars['Bytes']>;
    condition?: InputMaybe<Scalars['String']>;
    condition_not?: InputMaybe<Scalars['String']>;
    condition_gt?: InputMaybe<Scalars['String']>;
    condition_lt?: InputMaybe<Scalars['String']>;
    condition_gte?: InputMaybe<Scalars['String']>;
    condition_lte?: InputMaybe<Scalars['String']>;
    condition_in?: InputMaybe<Array<Scalars['String']>>;
    condition_not_in?: InputMaybe<Array<Scalars['String']>>;
    condition_contains?: InputMaybe<Scalars['String']>;
    condition_contains_nocase?: InputMaybe<Scalars['String']>;
    condition_not_contains?: InputMaybe<Scalars['String']>;
    condition_not_contains_nocase?: InputMaybe<Scalars['String']>;
    condition_starts_with?: InputMaybe<Scalars['String']>;
    condition_starts_with_nocase?: InputMaybe<Scalars['String']>;
    condition_not_starts_with?: InputMaybe<Scalars['String']>;
    condition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    condition_ends_with?: InputMaybe<Scalars['String']>;
    condition_ends_with_nocase?: InputMaybe<Scalars['String']>;
    condition_not_ends_with?: InputMaybe<Scalars['String']>;
    condition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    condition_?: InputMaybe<Condition_filter>;
    partition?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_not?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    amount?: InputMaybe<Scalars['BigInt']>;
    amount_not?: InputMaybe<Scalars['BigInt']>;
    amount_gt?: InputMaybe<Scalars['BigInt']>;
    amount_lt?: InputMaybe<Scalars['BigInt']>;
    amount_gte?: InputMaybe<Scalars['BigInt']>;
    amount_lte?: InputMaybe<Scalars['BigInt']>;
    amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Merge_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Merge_filter>>>;
};
export type Merge_orderBy = 'id' | 'timestamp' | 'stakeholder' | 'stakeholder__id' | 'stakeholder__creationTimestamp' | 'stakeholder__lastSeenTimestamp' | 'stakeholder__collateralVolume' | 'stakeholder__numTrades' | 'stakeholder__scaledCollateralVolume' | 'stakeholder__lastTradedTimestamp' | 'collateralToken' | 'collateralToken__id' | 'collateralToken__name' | 'collateralToken__symbol' | 'collateralToken__decimals' | 'parentCollectionId' | 'condition' | 'condition__id' | 'condition__oracle' | 'condition__questionId' | 'condition__outcomeSlotCount' | 'condition__resolutionTimestamp' | 'condition__payoutDenominator' | 'condition__resolutionHash' | 'partition' | 'amount';
/** Defines the order direction, either ascending or descending */
export type OrderDirection = 'asc' | 'desc';
export type OrderFilledEvent = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which filled occurred */
    timestamp: Scalars['BigInt'];
    orderHash: Scalars['Bytes'];
    /** Addresses of the maker and the taker */
    maker: Account;
    taker: Account;
    /** Address of the asset that the taker is giving away(for buy, it's the collateral, for sell it's the conditional) */
    makerAsset: Scalars['Bytes'];
    takerAsset: Scalars['Bytes'];
    /** Maker assetId */
    makerAssetID: Scalars['BigInt'];
    /** Taker assetId */
    takerAssetID: Scalars['BigInt'];
    /** Maker amount filled */
    makerAmountFilled: Scalars['BigInt'];
    /** Taker amount filled */
    takerAmountFilled: Scalars['BigInt'];
    remainingAmount: Scalars['BigInt'];
};
export type OrderFilledEvent_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    orderHash?: InputMaybe<Scalars['Bytes']>;
    orderHash_not?: InputMaybe<Scalars['Bytes']>;
    orderHash_gt?: InputMaybe<Scalars['Bytes']>;
    orderHash_lt?: InputMaybe<Scalars['Bytes']>;
    orderHash_gte?: InputMaybe<Scalars['Bytes']>;
    orderHash_lte?: InputMaybe<Scalars['Bytes']>;
    orderHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
    orderHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    orderHash_contains?: InputMaybe<Scalars['Bytes']>;
    orderHash_not_contains?: InputMaybe<Scalars['Bytes']>;
    maker?: InputMaybe<Scalars['String']>;
    maker_not?: InputMaybe<Scalars['String']>;
    maker_gt?: InputMaybe<Scalars['String']>;
    maker_lt?: InputMaybe<Scalars['String']>;
    maker_gte?: InputMaybe<Scalars['String']>;
    maker_lte?: InputMaybe<Scalars['String']>;
    maker_in?: InputMaybe<Array<Scalars['String']>>;
    maker_not_in?: InputMaybe<Array<Scalars['String']>>;
    maker_contains?: InputMaybe<Scalars['String']>;
    maker_contains_nocase?: InputMaybe<Scalars['String']>;
    maker_not_contains?: InputMaybe<Scalars['String']>;
    maker_not_contains_nocase?: InputMaybe<Scalars['String']>;
    maker_starts_with?: InputMaybe<Scalars['String']>;
    maker_starts_with_nocase?: InputMaybe<Scalars['String']>;
    maker_not_starts_with?: InputMaybe<Scalars['String']>;
    maker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    maker_ends_with?: InputMaybe<Scalars['String']>;
    maker_ends_with_nocase?: InputMaybe<Scalars['String']>;
    maker_not_ends_with?: InputMaybe<Scalars['String']>;
    maker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    maker_?: InputMaybe<Account_filter>;
    taker?: InputMaybe<Scalars['String']>;
    taker_not?: InputMaybe<Scalars['String']>;
    taker_gt?: InputMaybe<Scalars['String']>;
    taker_lt?: InputMaybe<Scalars['String']>;
    taker_gte?: InputMaybe<Scalars['String']>;
    taker_lte?: InputMaybe<Scalars['String']>;
    taker_in?: InputMaybe<Array<Scalars['String']>>;
    taker_not_in?: InputMaybe<Array<Scalars['String']>>;
    taker_contains?: InputMaybe<Scalars['String']>;
    taker_contains_nocase?: InputMaybe<Scalars['String']>;
    taker_not_contains?: InputMaybe<Scalars['String']>;
    taker_not_contains_nocase?: InputMaybe<Scalars['String']>;
    taker_starts_with?: InputMaybe<Scalars['String']>;
    taker_starts_with_nocase?: InputMaybe<Scalars['String']>;
    taker_not_starts_with?: InputMaybe<Scalars['String']>;
    taker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    taker_ends_with?: InputMaybe<Scalars['String']>;
    taker_ends_with_nocase?: InputMaybe<Scalars['String']>;
    taker_not_ends_with?: InputMaybe<Scalars['String']>;
    taker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    taker_?: InputMaybe<Account_filter>;
    makerAsset?: InputMaybe<Scalars['Bytes']>;
    makerAsset_not?: InputMaybe<Scalars['Bytes']>;
    makerAsset_gt?: InputMaybe<Scalars['Bytes']>;
    makerAsset_lt?: InputMaybe<Scalars['Bytes']>;
    makerAsset_gte?: InputMaybe<Scalars['Bytes']>;
    makerAsset_lte?: InputMaybe<Scalars['Bytes']>;
    makerAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    makerAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    makerAsset_contains?: InputMaybe<Scalars['Bytes']>;
    makerAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    takerAsset?: InputMaybe<Scalars['Bytes']>;
    takerAsset_not?: InputMaybe<Scalars['Bytes']>;
    takerAsset_gt?: InputMaybe<Scalars['Bytes']>;
    takerAsset_lt?: InputMaybe<Scalars['Bytes']>;
    takerAsset_gte?: InputMaybe<Scalars['Bytes']>;
    takerAsset_lte?: InputMaybe<Scalars['Bytes']>;
    takerAsset_in?: InputMaybe<Array<Scalars['Bytes']>>;
    takerAsset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    takerAsset_contains?: InputMaybe<Scalars['Bytes']>;
    takerAsset_not_contains?: InputMaybe<Scalars['Bytes']>;
    makerAssetID?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_not?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_gt?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_lt?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_gte?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_lte?: InputMaybe<Scalars['BigInt']>;
    makerAssetID_in?: InputMaybe<Array<Scalars['BigInt']>>;
    makerAssetID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAssetID?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_not?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_gt?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_lt?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_gte?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_lte?: InputMaybe<Scalars['BigInt']>;
    takerAssetID_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAssetID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    makerAmountFilled?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_not?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_gt?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_lt?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_gte?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_lte?: InputMaybe<Scalars['BigInt']>;
    makerAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']>>;
    makerAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAmountFilled?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_not?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_gt?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_lt?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_gte?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_lte?: InputMaybe<Scalars['BigInt']>;
    takerAmountFilled_in?: InputMaybe<Array<Scalars['BigInt']>>;
    takerAmountFilled_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    remainingAmount?: InputMaybe<Scalars['BigInt']>;
    remainingAmount_not?: InputMaybe<Scalars['BigInt']>;
    remainingAmount_gt?: InputMaybe<Scalars['BigInt']>;
    remainingAmount_lt?: InputMaybe<Scalars['BigInt']>;
    remainingAmount_gte?: InputMaybe<Scalars['BigInt']>;
    remainingAmount_lte?: InputMaybe<Scalars['BigInt']>;
    remainingAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    remainingAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<OrderFilledEvent_filter>>>;
    or?: InputMaybe<Array<InputMaybe<OrderFilledEvent_filter>>>;
};
export type OrderFilledEvent_orderBy = 'id' | 'timestamp' | 'orderHash' | 'maker' | 'maker__id' | 'maker__creationTimestamp' | 'maker__lastSeenTimestamp' | 'maker__collateralVolume' | 'maker__numTrades' | 'maker__scaledCollateralVolume' | 'maker__lastTradedTimestamp' | 'taker' | 'taker__id' | 'taker__creationTimestamp' | 'taker__lastSeenTimestamp' | 'taker__collateralVolume' | 'taker__numTrades' | 'taker__scaledCollateralVolume' | 'taker__lastTradedTimestamp' | 'makerAsset' | 'takerAsset' | 'makerAssetID' | 'takerAssetID' | 'makerAmountFilled' | 'takerAmountFilled' | 'remainingAmount';
export type Query = {
    global?: Maybe<Global>;
    globals: Array<Global>;
    account?: Maybe<Account>;
    accounts: Array<Account>;
    collateral?: Maybe<Collateral>;
    collaterals: Array<Collateral>;
    condition?: Maybe<Condition>;
    conditions: Array<Condition>;
    split?: Maybe<Split>;
    splits: Array<Split>;
    merge?: Maybe<Merge>;
    merges: Array<Merge>;
    redemption?: Maybe<Redemption>;
    redemptions: Array<Redemption>;
    fixedProductMarketMaker?: Maybe<FixedProductMarketMaker>;
    fixedProductMarketMakers: Array<FixedProductMarketMaker>;
    marketPosition?: Maybe<MarketPosition>;
    marketPositions: Array<MarketPosition>;
    fpmmFundingAddition?: Maybe<FpmmFundingAddition>;
    fpmmFundingAdditions: Array<FpmmFundingAddition>;
    fpmmFundingRemoval?: Maybe<FpmmFundingRemoval>;
    fpmmFundingRemovals: Array<FpmmFundingRemoval>;
    transaction?: Maybe<Transaction>;
    transactions: Array<Transaction>;
    fpmmPoolMembership?: Maybe<FpmmPoolMembership>;
    fpmmPoolMemberships: Array<FpmmPoolMembership>;
    filledOrderGlobal?: Maybe<FilledOrderGlobal>;
    filledOrderGlobals: Array<FilledOrderGlobal>;
    filledOrdersEvent?: Maybe<FilledOrdersEvent>;
    filledOrdersEvents: Array<FilledOrdersEvent>;
    orderFilledEvent?: Maybe<OrderFilledEvent>;
    orderFilledEvents: Array<OrderFilledEvent>;
    filledOrder?: Maybe<FilledOrder>;
    filledOrders: Array<FilledOrder>;
    filledOrderBook?: Maybe<FilledOrderBook>;
    filledOrderBooks: Array<FilledOrderBook>;
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>;
};
export type QueryglobalArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryglobalsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Global_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Global_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryaccountArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryaccountsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Account_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Account_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerycollateralArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerycollateralsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Collateral_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Collateral_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryconditionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryconditionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Condition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Condition_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerysplitArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerysplitsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Split_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Split_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerymergeArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerymergesArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Merge_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Merge_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryredemptionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryredemptionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Redemption_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Redemption_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfixedProductMarketMakerArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfixedProductMarketMakersArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FixedProductMarketMaker_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FixedProductMarketMaker_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerymarketPositionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerymarketPositionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<MarketPosition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MarketPosition_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfpmmFundingAdditionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfpmmFundingAdditionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmFundingAddition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmFundingAddition_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfpmmFundingRemovalArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfpmmFundingRemovalsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmFundingRemoval_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmFundingRemoval_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerytransactionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QuerytransactionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Transaction_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Transaction_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfpmmPoolMembershipArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfpmmPoolMembershipsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmPoolMembership_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmPoolMembership_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrderGlobalArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrderGlobalsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrderGlobal_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrderGlobal_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrdersEventArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrdersEventsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrdersEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrdersEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryorderFilledEventArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryorderFilledEventsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<OrderFilledEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<OrderFilledEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrderArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrdersArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrder_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrder_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrderBookArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type QueryfilledOrderBooksArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrderBook_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrderBook_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type Query_metaArgs = {
    block?: InputMaybe<Block_height>;
};
export type Redemption = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which redemption occurred */
    timestamp: Scalars['BigInt'];
    /** Address which is redeeming these outcomes */
    redeemer: Account;
    /** Token which is being claimed in return for outcome tokens */
    collateralToken: Collateral;
    parentCollectionId: Scalars['Bytes'];
    /** Condition on which redemption is occuring */
    condition: Condition;
    /** Outcomes which are being redeemed */
    indexSets: Array<Scalars['BigInt']>;
    /** The amount of collateral being claimed */
    payout: Scalars['BigInt'];
};
export type Redemption_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    redeemer?: InputMaybe<Scalars['String']>;
    redeemer_not?: InputMaybe<Scalars['String']>;
    redeemer_gt?: InputMaybe<Scalars['String']>;
    redeemer_lt?: InputMaybe<Scalars['String']>;
    redeemer_gte?: InputMaybe<Scalars['String']>;
    redeemer_lte?: InputMaybe<Scalars['String']>;
    redeemer_in?: InputMaybe<Array<Scalars['String']>>;
    redeemer_not_in?: InputMaybe<Array<Scalars['String']>>;
    redeemer_contains?: InputMaybe<Scalars['String']>;
    redeemer_contains_nocase?: InputMaybe<Scalars['String']>;
    redeemer_not_contains?: InputMaybe<Scalars['String']>;
    redeemer_not_contains_nocase?: InputMaybe<Scalars['String']>;
    redeemer_starts_with?: InputMaybe<Scalars['String']>;
    redeemer_starts_with_nocase?: InputMaybe<Scalars['String']>;
    redeemer_not_starts_with?: InputMaybe<Scalars['String']>;
    redeemer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    redeemer_ends_with?: InputMaybe<Scalars['String']>;
    redeemer_ends_with_nocase?: InputMaybe<Scalars['String']>;
    redeemer_not_ends_with?: InputMaybe<Scalars['String']>;
    redeemer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    redeemer_?: InputMaybe<Account_filter>;
    collateralToken?: InputMaybe<Scalars['String']>;
    collateralToken_not?: InputMaybe<Scalars['String']>;
    collateralToken_gt?: InputMaybe<Scalars['String']>;
    collateralToken_lt?: InputMaybe<Scalars['String']>;
    collateralToken_gte?: InputMaybe<Scalars['String']>;
    collateralToken_lte?: InputMaybe<Scalars['String']>;
    collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_contains?: InputMaybe<Scalars['String']>;
    collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_?: InputMaybe<Collateral_filter>;
    parentCollectionId?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_not?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_gt?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_lt?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_gte?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_lte?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
    parentCollectionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    parentCollectionId_contains?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_not_contains?: InputMaybe<Scalars['Bytes']>;
    condition?: InputMaybe<Scalars['String']>;
    condition_not?: InputMaybe<Scalars['String']>;
    condition_gt?: InputMaybe<Scalars['String']>;
    condition_lt?: InputMaybe<Scalars['String']>;
    condition_gte?: InputMaybe<Scalars['String']>;
    condition_lte?: InputMaybe<Scalars['String']>;
    condition_in?: InputMaybe<Array<Scalars['String']>>;
    condition_not_in?: InputMaybe<Array<Scalars['String']>>;
    condition_contains?: InputMaybe<Scalars['String']>;
    condition_contains_nocase?: InputMaybe<Scalars['String']>;
    condition_not_contains?: InputMaybe<Scalars['String']>;
    condition_not_contains_nocase?: InputMaybe<Scalars['String']>;
    condition_starts_with?: InputMaybe<Scalars['String']>;
    condition_starts_with_nocase?: InputMaybe<Scalars['String']>;
    condition_not_starts_with?: InputMaybe<Scalars['String']>;
    condition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    condition_ends_with?: InputMaybe<Scalars['String']>;
    condition_ends_with_nocase?: InputMaybe<Scalars['String']>;
    condition_not_ends_with?: InputMaybe<Scalars['String']>;
    condition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    condition_?: InputMaybe<Condition_filter>;
    indexSets?: InputMaybe<Array<Scalars['BigInt']>>;
    indexSets_not?: InputMaybe<Array<Scalars['BigInt']>>;
    indexSets_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    indexSets_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    indexSets_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    indexSets_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    payout?: InputMaybe<Scalars['BigInt']>;
    payout_not?: InputMaybe<Scalars['BigInt']>;
    payout_gt?: InputMaybe<Scalars['BigInt']>;
    payout_lt?: InputMaybe<Scalars['BigInt']>;
    payout_gte?: InputMaybe<Scalars['BigInt']>;
    payout_lte?: InputMaybe<Scalars['BigInt']>;
    payout_in?: InputMaybe<Array<Scalars['BigInt']>>;
    payout_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Redemption_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Redemption_filter>>>;
};
export type Redemption_orderBy = 'id' | 'timestamp' | 'redeemer' | 'redeemer__id' | 'redeemer__creationTimestamp' | 'redeemer__lastSeenTimestamp' | 'redeemer__collateralVolume' | 'redeemer__numTrades' | 'redeemer__scaledCollateralVolume' | 'redeemer__lastTradedTimestamp' | 'collateralToken' | 'collateralToken__id' | 'collateralToken__name' | 'collateralToken__symbol' | 'collateralToken__decimals' | 'parentCollectionId' | 'condition' | 'condition__id' | 'condition__oracle' | 'condition__questionId' | 'condition__outcomeSlotCount' | 'condition__resolutionTimestamp' | 'condition__payoutDenominator' | 'condition__resolutionHash' | 'indexSets' | 'payout';
export type Split = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Timestamp at which split occurred */
    timestamp: Scalars['BigInt'];
    /** Address which is performing this split */
    stakeholder: Account;
    /** Token which is collateralising positions being split */
    collateralToken: Collateral;
    parentCollectionId: Scalars['Bytes'];
    /** Condition on which split is occuring */
    condition: Condition;
    partition: Array<Scalars['BigInt']>;
    /** The amount of collateral/outcome tokens being split */
    amount: Scalars['BigInt'];
};
export type Split_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    stakeholder?: InputMaybe<Scalars['String']>;
    stakeholder_not?: InputMaybe<Scalars['String']>;
    stakeholder_gt?: InputMaybe<Scalars['String']>;
    stakeholder_lt?: InputMaybe<Scalars['String']>;
    stakeholder_gte?: InputMaybe<Scalars['String']>;
    stakeholder_lte?: InputMaybe<Scalars['String']>;
    stakeholder_in?: InputMaybe<Array<Scalars['String']>>;
    stakeholder_not_in?: InputMaybe<Array<Scalars['String']>>;
    stakeholder_contains?: InputMaybe<Scalars['String']>;
    stakeholder_contains_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_not_contains?: InputMaybe<Scalars['String']>;
    stakeholder_not_contains_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_starts_with?: InputMaybe<Scalars['String']>;
    stakeholder_starts_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_not_starts_with?: InputMaybe<Scalars['String']>;
    stakeholder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_ends_with?: InputMaybe<Scalars['String']>;
    stakeholder_ends_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_not_ends_with?: InputMaybe<Scalars['String']>;
    stakeholder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    stakeholder_?: InputMaybe<Account_filter>;
    collateralToken?: InputMaybe<Scalars['String']>;
    collateralToken_not?: InputMaybe<Scalars['String']>;
    collateralToken_gt?: InputMaybe<Scalars['String']>;
    collateralToken_lt?: InputMaybe<Scalars['String']>;
    collateralToken_gte?: InputMaybe<Scalars['String']>;
    collateralToken_lte?: InputMaybe<Scalars['String']>;
    collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
    collateralToken_contains?: InputMaybe<Scalars['String']>;
    collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains?: InputMaybe<Scalars['String']>;
    collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
    collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    collateralToken_?: InputMaybe<Collateral_filter>;
    parentCollectionId?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_not?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_gt?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_lt?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_gte?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_lte?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
    parentCollectionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
    parentCollectionId_contains?: InputMaybe<Scalars['Bytes']>;
    parentCollectionId_not_contains?: InputMaybe<Scalars['Bytes']>;
    condition?: InputMaybe<Scalars['String']>;
    condition_not?: InputMaybe<Scalars['String']>;
    condition_gt?: InputMaybe<Scalars['String']>;
    condition_lt?: InputMaybe<Scalars['String']>;
    condition_gte?: InputMaybe<Scalars['String']>;
    condition_lte?: InputMaybe<Scalars['String']>;
    condition_in?: InputMaybe<Array<Scalars['String']>>;
    condition_not_in?: InputMaybe<Array<Scalars['String']>>;
    condition_contains?: InputMaybe<Scalars['String']>;
    condition_contains_nocase?: InputMaybe<Scalars['String']>;
    condition_not_contains?: InputMaybe<Scalars['String']>;
    condition_not_contains_nocase?: InputMaybe<Scalars['String']>;
    condition_starts_with?: InputMaybe<Scalars['String']>;
    condition_starts_with_nocase?: InputMaybe<Scalars['String']>;
    condition_not_starts_with?: InputMaybe<Scalars['String']>;
    condition_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    condition_ends_with?: InputMaybe<Scalars['String']>;
    condition_ends_with_nocase?: InputMaybe<Scalars['String']>;
    condition_not_ends_with?: InputMaybe<Scalars['String']>;
    condition_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    condition_?: InputMaybe<Condition_filter>;
    partition?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_not?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
    partition_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
    amount?: InputMaybe<Scalars['BigInt']>;
    amount_not?: InputMaybe<Scalars['BigInt']>;
    amount_gt?: InputMaybe<Scalars['BigInt']>;
    amount_lt?: InputMaybe<Scalars['BigInt']>;
    amount_gte?: InputMaybe<Scalars['BigInt']>;
    amount_lte?: InputMaybe<Scalars['BigInt']>;
    amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Split_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Split_filter>>>;
};
export type Split_orderBy = 'id' | 'timestamp' | 'stakeholder' | 'stakeholder__id' | 'stakeholder__creationTimestamp' | 'stakeholder__lastSeenTimestamp' | 'stakeholder__collateralVolume' | 'stakeholder__numTrades' | 'stakeholder__scaledCollateralVolume' | 'stakeholder__lastTradedTimestamp' | 'collateralToken' | 'collateralToken__id' | 'collateralToken__name' | 'collateralToken__symbol' | 'collateralToken__decimals' | 'parentCollectionId' | 'condition' | 'condition__id' | 'condition__oracle' | 'condition__questionId' | 'condition__outcomeSlotCount' | 'condition__resolutionTimestamp' | 'condition__payoutDenominator' | 'condition__resolutionHash' | 'partition' | 'amount';
export type Subscription = {
    global?: Maybe<Global>;
    globals: Array<Global>;
    account?: Maybe<Account>;
    accounts: Array<Account>;
    collateral?: Maybe<Collateral>;
    collaterals: Array<Collateral>;
    condition?: Maybe<Condition>;
    conditions: Array<Condition>;
    split?: Maybe<Split>;
    splits: Array<Split>;
    merge?: Maybe<Merge>;
    merges: Array<Merge>;
    redemption?: Maybe<Redemption>;
    redemptions: Array<Redemption>;
    fixedProductMarketMaker?: Maybe<FixedProductMarketMaker>;
    fixedProductMarketMakers: Array<FixedProductMarketMaker>;
    marketPosition?: Maybe<MarketPosition>;
    marketPositions: Array<MarketPosition>;
    fpmmFundingAddition?: Maybe<FpmmFundingAddition>;
    fpmmFundingAdditions: Array<FpmmFundingAddition>;
    fpmmFundingRemoval?: Maybe<FpmmFundingRemoval>;
    fpmmFundingRemovals: Array<FpmmFundingRemoval>;
    transaction?: Maybe<Transaction>;
    transactions: Array<Transaction>;
    fpmmPoolMembership?: Maybe<FpmmPoolMembership>;
    fpmmPoolMemberships: Array<FpmmPoolMembership>;
    filledOrderGlobal?: Maybe<FilledOrderGlobal>;
    filledOrderGlobals: Array<FilledOrderGlobal>;
    filledOrdersEvent?: Maybe<FilledOrdersEvent>;
    filledOrdersEvents: Array<FilledOrdersEvent>;
    orderFilledEvent?: Maybe<OrderFilledEvent>;
    orderFilledEvents: Array<OrderFilledEvent>;
    filledOrder?: Maybe<FilledOrder>;
    filledOrders: Array<FilledOrder>;
    filledOrderBook?: Maybe<FilledOrderBook>;
    filledOrderBooks: Array<FilledOrderBook>;
    /** Access to subgraph metadata */
    _meta?: Maybe<_Meta_>;
};
export type SubscriptionglobalArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionglobalsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Global_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Global_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionaccountArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionaccountsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Account_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Account_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptioncollateralArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptioncollateralsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Collateral_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Collateral_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionconditionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionconditionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Condition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Condition_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionsplitArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionsplitsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Split_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Split_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionmergeArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionmergesArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Merge_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Merge_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionredemptionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionredemptionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Redemption_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Redemption_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfixedProductMarketMakerArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfixedProductMarketMakersArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FixedProductMarketMaker_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FixedProductMarketMaker_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionmarketPositionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionmarketPositionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<MarketPosition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<MarketPosition_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfpmmFundingAdditionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfpmmFundingAdditionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmFundingAddition_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmFundingAddition_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfpmmFundingRemovalArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfpmmFundingRemovalsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmFundingRemoval_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmFundingRemoval_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptiontransactionArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptiontransactionsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Transaction_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<Transaction_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfpmmPoolMembershipArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfpmmPoolMembershipsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FpmmPoolMembership_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FpmmPoolMembership_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrderGlobalArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrderGlobalsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrderGlobal_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrderGlobal_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrdersEventArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrdersEventsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrdersEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrdersEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionorderFilledEventArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionorderFilledEventsArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<OrderFilledEvent_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<OrderFilledEvent_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrderArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrdersArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrder_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrder_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrderBookArgs = {
    id: Scalars['ID'];
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type SubscriptionfilledOrderBooksArgs = {
    skip?: InputMaybe<Scalars['Int']>;
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<FilledOrderBook_orderBy>;
    orderDirection?: InputMaybe<OrderDirection>;
    where?: InputMaybe<FilledOrderBook_filter>;
    block?: InputMaybe<Block_height>;
    subgraphError?: _SubgraphErrorPolicy_;
};
export type Subscription_metaArgs = {
    block?: InputMaybe<Block_height>;
};
export type TradeType = 'Buy' | 'Sell' | 'Limit_Buy' | 'Limit_Sell';
export type Transaction = {
    /** Transaction Hash */
    id: Scalars['ID'];
    /** Buy or Sell transaction */
    type: TradeType;
    /** Timestamp at which transaction occurred */
    timestamp: Scalars['BigInt'];
    /** Market which transaction is interacting with */
    market: FixedProductMarketMaker;
    /** Account performing transaction */
    user: Account;
    /** Amount of collateral in trade */
    tradeAmount: Scalars['BigInt'];
    /** Amount of collateral paid in fees */
    feeAmount: Scalars['BigInt'];
    /** Index of outcome token being bought or sold */
    outcomeIndex: Scalars['BigInt'];
    /** Amount of outcome tokens being bought or sold */
    outcomeTokensAmount: Scalars['BigInt'];
};
export type Transaction_filter = {
    id?: InputMaybe<Scalars['ID']>;
    id_not?: InputMaybe<Scalars['ID']>;
    id_gt?: InputMaybe<Scalars['ID']>;
    id_lt?: InputMaybe<Scalars['ID']>;
    id_gte?: InputMaybe<Scalars['ID']>;
    id_lte?: InputMaybe<Scalars['ID']>;
    id_in?: InputMaybe<Array<Scalars['ID']>>;
    id_not_in?: InputMaybe<Array<Scalars['ID']>>;
    type?: InputMaybe<TradeType>;
    type_not?: InputMaybe<TradeType>;
    type_in?: InputMaybe<Array<TradeType>>;
    type_not_in?: InputMaybe<Array<TradeType>>;
    timestamp?: InputMaybe<Scalars['BigInt']>;
    timestamp_not?: InputMaybe<Scalars['BigInt']>;
    timestamp_gt?: InputMaybe<Scalars['BigInt']>;
    timestamp_lt?: InputMaybe<Scalars['BigInt']>;
    timestamp_gte?: InputMaybe<Scalars['BigInt']>;
    timestamp_lte?: InputMaybe<Scalars['BigInt']>;
    timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
    timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    market?: InputMaybe<Scalars['String']>;
    market_not?: InputMaybe<Scalars['String']>;
    market_gt?: InputMaybe<Scalars['String']>;
    market_lt?: InputMaybe<Scalars['String']>;
    market_gte?: InputMaybe<Scalars['String']>;
    market_lte?: InputMaybe<Scalars['String']>;
    market_in?: InputMaybe<Array<Scalars['String']>>;
    market_not_in?: InputMaybe<Array<Scalars['String']>>;
    market_contains?: InputMaybe<Scalars['String']>;
    market_contains_nocase?: InputMaybe<Scalars['String']>;
    market_not_contains?: InputMaybe<Scalars['String']>;
    market_not_contains_nocase?: InputMaybe<Scalars['String']>;
    market_starts_with?: InputMaybe<Scalars['String']>;
    market_starts_with_nocase?: InputMaybe<Scalars['String']>;
    market_not_starts_with?: InputMaybe<Scalars['String']>;
    market_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    market_ends_with?: InputMaybe<Scalars['String']>;
    market_ends_with_nocase?: InputMaybe<Scalars['String']>;
    market_not_ends_with?: InputMaybe<Scalars['String']>;
    market_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    market_?: InputMaybe<FixedProductMarketMaker_filter>;
    user?: InputMaybe<Scalars['String']>;
    user_not?: InputMaybe<Scalars['String']>;
    user_gt?: InputMaybe<Scalars['String']>;
    user_lt?: InputMaybe<Scalars['String']>;
    user_gte?: InputMaybe<Scalars['String']>;
    user_lte?: InputMaybe<Scalars['String']>;
    user_in?: InputMaybe<Array<Scalars['String']>>;
    user_not_in?: InputMaybe<Array<Scalars['String']>>;
    user_contains?: InputMaybe<Scalars['String']>;
    user_contains_nocase?: InputMaybe<Scalars['String']>;
    user_not_contains?: InputMaybe<Scalars['String']>;
    user_not_contains_nocase?: InputMaybe<Scalars['String']>;
    user_starts_with?: InputMaybe<Scalars['String']>;
    user_starts_with_nocase?: InputMaybe<Scalars['String']>;
    user_not_starts_with?: InputMaybe<Scalars['String']>;
    user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
    user_ends_with?: InputMaybe<Scalars['String']>;
    user_ends_with_nocase?: InputMaybe<Scalars['String']>;
    user_not_ends_with?: InputMaybe<Scalars['String']>;
    user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
    user_?: InputMaybe<Account_filter>;
    tradeAmount?: InputMaybe<Scalars['BigInt']>;
    tradeAmount_not?: InputMaybe<Scalars['BigInt']>;
    tradeAmount_gt?: InputMaybe<Scalars['BigInt']>;
    tradeAmount_lt?: InputMaybe<Scalars['BigInt']>;
    tradeAmount_gte?: InputMaybe<Scalars['BigInt']>;
    tradeAmount_lte?: InputMaybe<Scalars['BigInt']>;
    tradeAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    tradeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    feeAmount?: InputMaybe<Scalars['BigInt']>;
    feeAmount_not?: InputMaybe<Scalars['BigInt']>;
    feeAmount_gt?: InputMaybe<Scalars['BigInt']>;
    feeAmount_lt?: InputMaybe<Scalars['BigInt']>;
    feeAmount_gte?: InputMaybe<Scalars['BigInt']>;
    feeAmount_lte?: InputMaybe<Scalars['BigInt']>;
    feeAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    feeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeIndex?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_not?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_gt?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_lt?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_gte?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_lte?: InputMaybe<Scalars['BigInt']>;
    outcomeIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokensAmount?: InputMaybe<Scalars['BigInt']>;
    outcomeTokensAmount_not?: InputMaybe<Scalars['BigInt']>;
    outcomeTokensAmount_gt?: InputMaybe<Scalars['BigInt']>;
    outcomeTokensAmount_lt?: InputMaybe<Scalars['BigInt']>;
    outcomeTokensAmount_gte?: InputMaybe<Scalars['BigInt']>;
    outcomeTokensAmount_lte?: InputMaybe<Scalars['BigInt']>;
    outcomeTokensAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
    outcomeTokensAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
    /** Filter for the block changed event. */
    _change_block?: InputMaybe<BlockChangedFilter>;
    and?: InputMaybe<Array<InputMaybe<Transaction_filter>>>;
    or?: InputMaybe<Array<InputMaybe<Transaction_filter>>>;
};
export type Transaction_orderBy = 'id' | 'type' | 'timestamp' | 'market' | 'market__id' | 'market__creator' | 'market__creationTimestamp' | 'market__creationTransactionHash' | 'market__fee' | 'market__tradesQuantity' | 'market__buysQuantity' | 'market__sellsQuantity' | 'market__liquidityAddQuantity' | 'market__liquidityRemoveQuantity' | 'market__collateralVolume' | 'market__scaledCollateralVolume' | 'market__collateralBuyVolume' | 'market__scaledCollateralBuyVolume' | 'market__collateralSellVolume' | 'market__scaledCollateralSellVolume' | 'market__feeVolume' | 'market__scaledFeeVolume' | 'market__liquidityParameter' | 'market__scaledLiquidityParameter' | 'market__outcomeSlotCount' | 'market__lastActiveDay' | 'market__totalSupply' | 'user' | 'user__id' | 'user__creationTimestamp' | 'user__lastSeenTimestamp' | 'user__collateralVolume' | 'user__numTrades' | 'user__scaledCollateralVolume' | 'user__lastTradedTimestamp' | 'tradeAmount' | 'feeAmount' | 'outcomeIndex' | 'outcomeTokensAmount';
export type _Block_ = {
    /** The hash of the block */
    hash?: Maybe<Scalars['Bytes']>;
    /** The block number */
    number: Scalars['Int'];
    /** Integer representation of the timestamp stored in blocks for the chain */
    timestamp?: Maybe<Scalars['Int']>;
};
/** The type for the top-level _meta field */
export type _Meta_ = {
    /**
     * Information about a specific subgraph block. The hash of the block
     * will be null if the _meta field has a block constraint that asks for
     * a block number. It will be filled if the _meta field has no block constraint
     * and therefore asks for the latest  block
     *
     */
    block: _Block_;
    /** The deployment ID */
    deployment: Scalars['String'];
    /** If `true`, the subgraph encountered indexing errors at some past block */
    hasIndexingErrors: Scalars['Boolean'];
};
export type _SubgraphErrorPolicy_ = 
/** Data will be returned even if the subgraph has indexing errors */
'allow'
/** If the subgraph has indexing errors, data will be omitted. The default. */
 | 'deny';
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;
export type ResolverTypeWrapper<T> = Promise<T> | T;
export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
    selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs> | StitchingResolver<TResult, TParent, TContext, TArgs>;
export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;
export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export type NextResolverFn<T> = () => Promise<T>;
export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
    Account: ResolverTypeWrapper<Account>;
    Account_filter: Account_filter;
    Account_orderBy: Account_orderBy;
    BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
    BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
    BlockChangedFilter: BlockChangedFilter;
    Block_height: Block_height;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
    Collateral: ResolverTypeWrapper<Collateral>;
    Collateral_filter: Collateral_filter;
    Collateral_orderBy: Collateral_orderBy;
    Condition: ResolverTypeWrapper<Condition>;
    Condition_filter: Condition_filter;
    Condition_orderBy: Condition_orderBy;
    FilledOrder: ResolverTypeWrapper<FilledOrder>;
    FilledOrderBook: ResolverTypeWrapper<FilledOrderBook>;
    FilledOrderBook_filter: FilledOrderBook_filter;
    FilledOrderBook_orderBy: FilledOrderBook_orderBy;
    FilledOrderGlobal: ResolverTypeWrapper<FilledOrderGlobal>;
    FilledOrderGlobal_filter: FilledOrderGlobal_filter;
    FilledOrderGlobal_orderBy: FilledOrderGlobal_orderBy;
    FilledOrder_filter: FilledOrder_filter;
    FilledOrder_orderBy: FilledOrder_orderBy;
    FilledOrdersEvent: ResolverTypeWrapper<FilledOrdersEvent>;
    FilledOrdersEvent_filter: FilledOrdersEvent_filter;
    FilledOrdersEvent_orderBy: FilledOrdersEvent_orderBy;
    FixedProductMarketMaker: ResolverTypeWrapper<FixedProductMarketMaker>;
    FixedProductMarketMaker_filter: FixedProductMarketMaker_filter;
    FixedProductMarketMaker_orderBy: FixedProductMarketMaker_orderBy;
    Float: ResolverTypeWrapper<Scalars['Float']>;
    FpmmFundingAddition: ResolverTypeWrapper<FpmmFundingAddition>;
    FpmmFundingAddition_filter: FpmmFundingAddition_filter;
    FpmmFundingAddition_orderBy: FpmmFundingAddition_orderBy;
    FpmmFundingRemoval: ResolverTypeWrapper<FpmmFundingRemoval>;
    FpmmFundingRemoval_filter: FpmmFundingRemoval_filter;
    FpmmFundingRemoval_orderBy: FpmmFundingRemoval_orderBy;
    FpmmPoolMembership: ResolverTypeWrapper<FpmmPoolMembership>;
    FpmmPoolMembership_filter: FpmmPoolMembership_filter;
    FpmmPoolMembership_orderBy: FpmmPoolMembership_orderBy;
    Global: ResolverTypeWrapper<Global>;
    Global_filter: Global_filter;
    Global_orderBy: Global_orderBy;
    ID: ResolverTypeWrapper<Scalars['ID']>;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    Int8: ResolverTypeWrapper<Scalars['Int8']>;
    MarketPosition: ResolverTypeWrapper<MarketPosition>;
    MarketPosition_filter: MarketPosition_filter;
    MarketPosition_orderBy: MarketPosition_orderBy;
    Merge: ResolverTypeWrapper<Merge>;
    Merge_filter: Merge_filter;
    Merge_orderBy: Merge_orderBy;
    OrderDirection: OrderDirection;
    OrderFilledEvent: ResolverTypeWrapper<OrderFilledEvent>;
    OrderFilledEvent_filter: OrderFilledEvent_filter;
    OrderFilledEvent_orderBy: OrderFilledEvent_orderBy;
    Query: ResolverTypeWrapper<{}>;
    Redemption: ResolverTypeWrapper<Redemption>;
    Redemption_filter: Redemption_filter;
    Redemption_orderBy: Redemption_orderBy;
    Split: ResolverTypeWrapper<Split>;
    Split_filter: Split_filter;
    Split_orderBy: Split_orderBy;
    String: ResolverTypeWrapper<Scalars['String']>;
    Subscription: ResolverTypeWrapper<{}>;
    TradeType: TradeType;
    Transaction: ResolverTypeWrapper<Transaction>;
    Transaction_filter: Transaction_filter;
    Transaction_orderBy: Transaction_orderBy;
    _Block_: ResolverTypeWrapper<_Block_>;
    _Meta_: ResolverTypeWrapper<_Meta_>;
    _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;
/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
    Account: Account;
    Account_filter: Account_filter;
    BigDecimal: Scalars['BigDecimal'];
    BigInt: Scalars['BigInt'];
    BlockChangedFilter: BlockChangedFilter;
    Block_height: Block_height;
    Boolean: Scalars['Boolean'];
    Bytes: Scalars['Bytes'];
    Collateral: Collateral;
    Collateral_filter: Collateral_filter;
    Condition: Condition;
    Condition_filter: Condition_filter;
    FilledOrder: FilledOrder;
    FilledOrderBook: FilledOrderBook;
    FilledOrderBook_filter: FilledOrderBook_filter;
    FilledOrderGlobal: FilledOrderGlobal;
    FilledOrderGlobal_filter: FilledOrderGlobal_filter;
    FilledOrder_filter: FilledOrder_filter;
    FilledOrdersEvent: FilledOrdersEvent;
    FilledOrdersEvent_filter: FilledOrdersEvent_filter;
    FixedProductMarketMaker: FixedProductMarketMaker;
    FixedProductMarketMaker_filter: FixedProductMarketMaker_filter;
    Float: Scalars['Float'];
    FpmmFundingAddition: FpmmFundingAddition;
    FpmmFundingAddition_filter: FpmmFundingAddition_filter;
    FpmmFundingRemoval: FpmmFundingRemoval;
    FpmmFundingRemoval_filter: FpmmFundingRemoval_filter;
    FpmmPoolMembership: FpmmPoolMembership;
    FpmmPoolMembership_filter: FpmmPoolMembership_filter;
    Global: Global;
    Global_filter: Global_filter;
    ID: Scalars['ID'];
    Int: Scalars['Int'];
    Int8: Scalars['Int8'];
    MarketPosition: MarketPosition;
    MarketPosition_filter: MarketPosition_filter;
    Merge: Merge;
    Merge_filter: Merge_filter;
    OrderFilledEvent: OrderFilledEvent;
    OrderFilledEvent_filter: OrderFilledEvent_filter;
    Query: {};
    Redemption: Redemption;
    Redemption_filter: Redemption_filter;
    Split: Split;
    Split_filter: Split_filter;
    String: Scalars['String'];
    Subscription: {};
    Transaction: Transaction;
    Transaction_filter: Transaction_filter;
    _Block_: _Block_;
    _Meta_: _Meta_;
}>;
export type entityDirectiveArgs = {};
export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;
export type subgraphIdDirectiveArgs = {
    id: Scalars['String'];
};
export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;
export type derivedFromDirectiveArgs = {
    field: Scalars['String'];
};
export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;
export type AccountResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    creationTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    lastSeenTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    collateralVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    numTrades?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    lastTradedTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    fpmmPoolMemberships?: Resolver<Maybe<Array<ResolversTypes['FpmmPoolMembership']>>, ParentType, ContextType, RequireFields<AccountfpmmPoolMembershipsArgs, 'skip' | 'first'>>;
    marketPositions?: Resolver<Maybe<Array<ResolversTypes['MarketPosition']>>, ParentType, ContextType, RequireFields<AccountmarketPositionsArgs, 'skip' | 'first'>>;
    transactions?: Resolver<Maybe<Array<ResolversTypes['Transaction']>>, ParentType, ContextType, RequireFields<AccounttransactionsArgs, 'skip' | 'first'>>;
    splits?: Resolver<Maybe<Array<ResolversTypes['Split']>>, ParentType, ContextType, RequireFields<AccountsplitsArgs, 'skip' | 'first'>>;
    merges?: Resolver<Maybe<Array<ResolversTypes['Merge']>>, ParentType, ContextType, RequireFields<AccountmergesArgs, 'skip' | 'first'>>;
    redemptions?: Resolver<Maybe<Array<ResolversTypes['Redemption']>>, ParentType, ContextType, RequireFields<AccountredemptionsArgs, 'skip' | 'first'>>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
    name: 'BigDecimal';
}
export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
    name: 'BigInt';
}
export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
    name: 'Bytes';
}
export type CollateralResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Collateral'] = ResolversParentTypes['Collateral']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    decimals?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type ConditionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Condition'] = ResolversParentTypes['Condition']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    oracle?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    questionId?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    outcomeSlotCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    resolutionTimestamp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
    payouts?: Resolver<Maybe<Array<ResolversTypes['BigDecimal']>>, ParentType, ContextType>;
    payoutNumerators?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
    payoutDenominator?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
    fixedProductMarketMakers?: Resolver<Array<ResolversTypes['FixedProductMarketMaker']>, ParentType, ContextType, RequireFields<ConditionfixedProductMarketMakersArgs, 'skip' | 'first'>>;
    resolutionHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FilledOrderResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FilledOrder'] = ResolversParentTypes['FilledOrder']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    maker?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    taker?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    orderHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    market?: Resolver<ResolversTypes['FilledOrderBook'], ParentType, ContextType>;
    side?: Resolver<ResolversTypes['TradeType'], ParentType, ContextType>;
    size?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    price?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FilledOrderBookResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FilledOrderBook'] = ResolversParentTypes['FilledOrderBook']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    buys?: Resolver<Array<ResolversTypes['FilledOrder']>, ParentType, ContextType, RequireFields<FilledOrderBookbuysArgs, 'skip' | 'first'>>;
    sells?: Resolver<Array<ResolversTypes['FilledOrder']>, ParentType, ContextType, RequireFields<FilledOrderBooksellsArgs, 'skip' | 'first'>>;
    tradesQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    buysQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    sellsQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    collateralVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralBuyVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralBuyVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralSellVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralSellVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    lastActiveDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FilledOrderGlobalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FilledOrderGlobal'] = ResolversParentTypes['FilledOrderGlobal']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    tradesQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    buysQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    sellsQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    collateralVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    scaledCollateralVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralBuyVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    scaledCollateralBuyVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralSellVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    scaledCollateralSellVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FilledOrdersEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FilledOrdersEvent'] = ResolversParentTypes['FilledOrdersEvent']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    taker?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    makerAsset?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    takerAsset?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    makerAssetID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    takerAssetID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    makerAmountFilled?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    takerAmountFilled?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    fee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FixedProductMarketMakerResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FixedProductMarketMaker'] = ResolversParentTypes['FixedProductMarketMaker']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    creator?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    creationTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    creationTransactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    collateralToken?: Resolver<ResolversTypes['Collateral'], ParentType, ContextType>;
    conditions?: Resolver<Maybe<Array<ResolversTypes['Condition']>>, ParentType, ContextType, RequireFields<FixedProductMarketMakerconditionsArgs, 'skip' | 'first'>>;
    fee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    tradesQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    buysQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    sellsQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    liquidityAddQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    liquidityRemoveQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    collateralVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralBuyVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralBuyVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralSellVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralSellVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    feeVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledFeeVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    liquidityParameter?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledLiquidityParameter?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    outcomeTokenAmounts?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    outcomeTokenPrices?: Resolver<Array<ResolversTypes['BigDecimal']>, ParentType, ContextType>;
    outcomeSlotCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    lastActiveDay?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    totalSupply?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    poolMembers?: Resolver<Maybe<Array<ResolversTypes['FpmmPoolMembership']>>, ParentType, ContextType, RequireFields<FixedProductMarketMakerpoolMembersArgs, 'skip' | 'first'>>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FpmmFundingAdditionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FpmmFundingAddition'] = ResolversParentTypes['FpmmFundingAddition']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    fpmm?: Resolver<ResolversTypes['FixedProductMarketMaker'], ParentType, ContextType>;
    funder?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    amountsAdded?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    amountsRefunded?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    sharesMinted?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FpmmFundingRemovalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FpmmFundingRemoval'] = ResolversParentTypes['FpmmFundingRemoval']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    fpmm?: Resolver<ResolversTypes['FixedProductMarketMaker'], ParentType, ContextType>;
    funder?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    amountsRemoved?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    collateralRemoved?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    sharesBurnt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type FpmmPoolMembershipResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FpmmPoolMembership'] = ResolversParentTypes['FpmmPoolMembership']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    pool?: Resolver<ResolversTypes['FixedProductMarketMaker'], ParentType, ContextType>;
    funder?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GlobalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Global'] = ResolversParentTypes['Global']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    numConditions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    numOpenConditions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    numClosedConditions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    numTraders?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    tradesQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    buysQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    sellsQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    collateralVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralFees?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralFees?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralBuyVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralBuyVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    collateralSellVolume?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    scaledCollateralSellVolume?: Resolver<ResolversTypes['BigDecimal'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
    name: 'Int8';
}
export type MarketPositionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MarketPosition'] = ResolversParentTypes['MarketPosition']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    market?: Resolver<ResolversTypes['FixedProductMarketMaker'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    outcomeIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    quantityBought?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    quantitySold?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    netQuantity?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    valueBought?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    valueSold?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    netValue?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    feesPaid?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MergeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Merge'] = ResolversParentTypes['Merge']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    stakeholder?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    collateralToken?: Resolver<ResolversTypes['Collateral'], ParentType, ContextType>;
    parentCollectionId?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    condition?: Resolver<ResolversTypes['Condition'], ParentType, ContextType>;
    partition?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type OrderFilledEventResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['OrderFilledEvent'] = ResolversParentTypes['OrderFilledEvent']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    orderHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    maker?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    taker?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    makerAsset?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    takerAsset?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    makerAssetID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    takerAssetID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    makerAmountFilled?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    takerAmountFilled?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    remainingAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
    global?: Resolver<Maybe<ResolversTypes['Global']>, ParentType, ContextType, RequireFields<QueryglobalArgs, 'id' | 'subgraphError'>>;
    globals?: Resolver<Array<ResolversTypes['Global']>, ParentType, ContextType, RequireFields<QueryglobalsArgs, 'skip' | 'first' | 'subgraphError'>>;
    account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountArgs, 'id' | 'subgraphError'>>;
    accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryaccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
    collateral?: Resolver<Maybe<ResolversTypes['Collateral']>, ParentType, ContextType, RequireFields<QuerycollateralArgs, 'id' | 'subgraphError'>>;
    collaterals?: Resolver<Array<ResolversTypes['Collateral']>, ParentType, ContextType, RequireFields<QuerycollateralsArgs, 'skip' | 'first' | 'subgraphError'>>;
    condition?: Resolver<Maybe<ResolversTypes['Condition']>, ParentType, ContextType, RequireFields<QueryconditionArgs, 'id' | 'subgraphError'>>;
    conditions?: Resolver<Array<ResolversTypes['Condition']>, ParentType, ContextType, RequireFields<QueryconditionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    split?: Resolver<Maybe<ResolversTypes['Split']>, ParentType, ContextType, RequireFields<QuerysplitArgs, 'id' | 'subgraphError'>>;
    splits?: Resolver<Array<ResolversTypes['Split']>, ParentType, ContextType, RequireFields<QuerysplitsArgs, 'skip' | 'first' | 'subgraphError'>>;
    merge?: Resolver<Maybe<ResolversTypes['Merge']>, ParentType, ContextType, RequireFields<QuerymergeArgs, 'id' | 'subgraphError'>>;
    merges?: Resolver<Array<ResolversTypes['Merge']>, ParentType, ContextType, RequireFields<QuerymergesArgs, 'skip' | 'first' | 'subgraphError'>>;
    redemption?: Resolver<Maybe<ResolversTypes['Redemption']>, ParentType, ContextType, RequireFields<QueryredemptionArgs, 'id' | 'subgraphError'>>;
    redemptions?: Resolver<Array<ResolversTypes['Redemption']>, ParentType, ContextType, RequireFields<QueryredemptionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fixedProductMarketMaker?: Resolver<Maybe<ResolversTypes['FixedProductMarketMaker']>, ParentType, ContextType, RequireFields<QueryfixedProductMarketMakerArgs, 'id' | 'subgraphError'>>;
    fixedProductMarketMakers?: Resolver<Array<ResolversTypes['FixedProductMarketMaker']>, ParentType, ContextType, RequireFields<QueryfixedProductMarketMakersArgs, 'skip' | 'first' | 'subgraphError'>>;
    marketPosition?: Resolver<Maybe<ResolversTypes['MarketPosition']>, ParentType, ContextType, RequireFields<QuerymarketPositionArgs, 'id' | 'subgraphError'>>;
    marketPositions?: Resolver<Array<ResolversTypes['MarketPosition']>, ParentType, ContextType, RequireFields<QuerymarketPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fpmmFundingAddition?: Resolver<Maybe<ResolversTypes['FpmmFundingAddition']>, ParentType, ContextType, RequireFields<QueryfpmmFundingAdditionArgs, 'id' | 'subgraphError'>>;
    fpmmFundingAdditions?: Resolver<Array<ResolversTypes['FpmmFundingAddition']>, ParentType, ContextType, RequireFields<QueryfpmmFundingAdditionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fpmmFundingRemoval?: Resolver<Maybe<ResolversTypes['FpmmFundingRemoval']>, ParentType, ContextType, RequireFields<QueryfpmmFundingRemovalArgs, 'id' | 'subgraphError'>>;
    fpmmFundingRemovals?: Resolver<Array<ResolversTypes['FpmmFundingRemoval']>, ParentType, ContextType, RequireFields<QueryfpmmFundingRemovalsArgs, 'skip' | 'first' | 'subgraphError'>>;
    transaction?: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QuerytransactionArgs, 'id' | 'subgraphError'>>;
    transactions?: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QuerytransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fpmmPoolMembership?: Resolver<Maybe<ResolversTypes['FpmmPoolMembership']>, ParentType, ContextType, RequireFields<QueryfpmmPoolMembershipArgs, 'id' | 'subgraphError'>>;
    fpmmPoolMemberships?: Resolver<Array<ResolversTypes['FpmmPoolMembership']>, ParentType, ContextType, RequireFields<QueryfpmmPoolMembershipsArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrderGlobal?: Resolver<Maybe<ResolversTypes['FilledOrderGlobal']>, ParentType, ContextType, RequireFields<QueryfilledOrderGlobalArgs, 'id' | 'subgraphError'>>;
    filledOrderGlobals?: Resolver<Array<ResolversTypes['FilledOrderGlobal']>, ParentType, ContextType, RequireFields<QueryfilledOrderGlobalsArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrdersEvent?: Resolver<Maybe<ResolversTypes['FilledOrdersEvent']>, ParentType, ContextType, RequireFields<QueryfilledOrdersEventArgs, 'id' | 'subgraphError'>>;
    filledOrdersEvents?: Resolver<Array<ResolversTypes['FilledOrdersEvent']>, ParentType, ContextType, RequireFields<QueryfilledOrdersEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
    orderFilledEvent?: Resolver<Maybe<ResolversTypes['OrderFilledEvent']>, ParentType, ContextType, RequireFields<QueryorderFilledEventArgs, 'id' | 'subgraphError'>>;
    orderFilledEvents?: Resolver<Array<ResolversTypes['OrderFilledEvent']>, ParentType, ContextType, RequireFields<QueryorderFilledEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrder?: Resolver<Maybe<ResolversTypes['FilledOrder']>, ParentType, ContextType, RequireFields<QueryfilledOrderArgs, 'id' | 'subgraphError'>>;
    filledOrders?: Resolver<Array<ResolversTypes['FilledOrder']>, ParentType, ContextType, RequireFields<QueryfilledOrdersArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrderBook?: Resolver<Maybe<ResolversTypes['FilledOrderBook']>, ParentType, ContextType, RequireFields<QueryfilledOrderBookArgs, 'id' | 'subgraphError'>>;
    filledOrderBooks?: Resolver<Array<ResolversTypes['FilledOrderBook']>, ParentType, ContextType, RequireFields<QueryfilledOrderBooksArgs, 'skip' | 'first' | 'subgraphError'>>;
    _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;
export type RedemptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Redemption'] = ResolversParentTypes['Redemption']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    redeemer?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    collateralToken?: Resolver<ResolversTypes['Collateral'], ParentType, ContextType>;
    parentCollectionId?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    condition?: Resolver<ResolversTypes['Condition'], ParentType, ContextType>;
    indexSets?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    payout?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type SplitResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Split'] = ResolversParentTypes['Split']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    stakeholder?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    collateralToken?: Resolver<ResolversTypes['Collateral'], ParentType, ContextType>;
    parentCollectionId?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
    condition?: Resolver<ResolversTypes['Condition'], ParentType, ContextType>;
    partition?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
    amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
    global?: SubscriptionResolver<Maybe<ResolversTypes['Global']>, "global", ParentType, ContextType, RequireFields<SubscriptionglobalArgs, 'id' | 'subgraphError'>>;
    globals?: SubscriptionResolver<Array<ResolversTypes['Global']>, "globals", ParentType, ContextType, RequireFields<SubscriptionglobalsArgs, 'skip' | 'first' | 'subgraphError'>>;
    account?: SubscriptionResolver<Maybe<ResolversTypes['Account']>, "account", ParentType, ContextType, RequireFields<SubscriptionaccountArgs, 'id' | 'subgraphError'>>;
    accounts?: SubscriptionResolver<Array<ResolversTypes['Account']>, "accounts", ParentType, ContextType, RequireFields<SubscriptionaccountsArgs, 'skip' | 'first' | 'subgraphError'>>;
    collateral?: SubscriptionResolver<Maybe<ResolversTypes['Collateral']>, "collateral", ParentType, ContextType, RequireFields<SubscriptioncollateralArgs, 'id' | 'subgraphError'>>;
    collaterals?: SubscriptionResolver<Array<ResolversTypes['Collateral']>, "collaterals", ParentType, ContextType, RequireFields<SubscriptioncollateralsArgs, 'skip' | 'first' | 'subgraphError'>>;
    condition?: SubscriptionResolver<Maybe<ResolversTypes['Condition']>, "condition", ParentType, ContextType, RequireFields<SubscriptionconditionArgs, 'id' | 'subgraphError'>>;
    conditions?: SubscriptionResolver<Array<ResolversTypes['Condition']>, "conditions", ParentType, ContextType, RequireFields<SubscriptionconditionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    split?: SubscriptionResolver<Maybe<ResolversTypes['Split']>, "split", ParentType, ContextType, RequireFields<SubscriptionsplitArgs, 'id' | 'subgraphError'>>;
    splits?: SubscriptionResolver<Array<ResolversTypes['Split']>, "splits", ParentType, ContextType, RequireFields<SubscriptionsplitsArgs, 'skip' | 'first' | 'subgraphError'>>;
    merge?: SubscriptionResolver<Maybe<ResolversTypes['Merge']>, "merge", ParentType, ContextType, RequireFields<SubscriptionmergeArgs, 'id' | 'subgraphError'>>;
    merges?: SubscriptionResolver<Array<ResolversTypes['Merge']>, "merges", ParentType, ContextType, RequireFields<SubscriptionmergesArgs, 'skip' | 'first' | 'subgraphError'>>;
    redemption?: SubscriptionResolver<Maybe<ResolversTypes['Redemption']>, "redemption", ParentType, ContextType, RequireFields<SubscriptionredemptionArgs, 'id' | 'subgraphError'>>;
    redemptions?: SubscriptionResolver<Array<ResolversTypes['Redemption']>, "redemptions", ParentType, ContextType, RequireFields<SubscriptionredemptionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fixedProductMarketMaker?: SubscriptionResolver<Maybe<ResolversTypes['FixedProductMarketMaker']>, "fixedProductMarketMaker", ParentType, ContextType, RequireFields<SubscriptionfixedProductMarketMakerArgs, 'id' | 'subgraphError'>>;
    fixedProductMarketMakers?: SubscriptionResolver<Array<ResolversTypes['FixedProductMarketMaker']>, "fixedProductMarketMakers", ParentType, ContextType, RequireFields<SubscriptionfixedProductMarketMakersArgs, 'skip' | 'first' | 'subgraphError'>>;
    marketPosition?: SubscriptionResolver<Maybe<ResolversTypes['MarketPosition']>, "marketPosition", ParentType, ContextType, RequireFields<SubscriptionmarketPositionArgs, 'id' | 'subgraphError'>>;
    marketPositions?: SubscriptionResolver<Array<ResolversTypes['MarketPosition']>, "marketPositions", ParentType, ContextType, RequireFields<SubscriptionmarketPositionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fpmmFundingAddition?: SubscriptionResolver<Maybe<ResolversTypes['FpmmFundingAddition']>, "fpmmFundingAddition", ParentType, ContextType, RequireFields<SubscriptionfpmmFundingAdditionArgs, 'id' | 'subgraphError'>>;
    fpmmFundingAdditions?: SubscriptionResolver<Array<ResolversTypes['FpmmFundingAddition']>, "fpmmFundingAdditions", ParentType, ContextType, RequireFields<SubscriptionfpmmFundingAdditionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fpmmFundingRemoval?: SubscriptionResolver<Maybe<ResolversTypes['FpmmFundingRemoval']>, "fpmmFundingRemoval", ParentType, ContextType, RequireFields<SubscriptionfpmmFundingRemovalArgs, 'id' | 'subgraphError'>>;
    fpmmFundingRemovals?: SubscriptionResolver<Array<ResolversTypes['FpmmFundingRemoval']>, "fpmmFundingRemovals", ParentType, ContextType, RequireFields<SubscriptionfpmmFundingRemovalsArgs, 'skip' | 'first' | 'subgraphError'>>;
    transaction?: SubscriptionResolver<Maybe<ResolversTypes['Transaction']>, "transaction", ParentType, ContextType, RequireFields<SubscriptiontransactionArgs, 'id' | 'subgraphError'>>;
    transactions?: SubscriptionResolver<Array<ResolversTypes['Transaction']>, "transactions", ParentType, ContextType, RequireFields<SubscriptiontransactionsArgs, 'skip' | 'first' | 'subgraphError'>>;
    fpmmPoolMembership?: SubscriptionResolver<Maybe<ResolversTypes['FpmmPoolMembership']>, "fpmmPoolMembership", ParentType, ContextType, RequireFields<SubscriptionfpmmPoolMembershipArgs, 'id' | 'subgraphError'>>;
    fpmmPoolMemberships?: SubscriptionResolver<Array<ResolversTypes['FpmmPoolMembership']>, "fpmmPoolMemberships", ParentType, ContextType, RequireFields<SubscriptionfpmmPoolMembershipsArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrderGlobal?: SubscriptionResolver<Maybe<ResolversTypes['FilledOrderGlobal']>, "filledOrderGlobal", ParentType, ContextType, RequireFields<SubscriptionfilledOrderGlobalArgs, 'id' | 'subgraphError'>>;
    filledOrderGlobals?: SubscriptionResolver<Array<ResolversTypes['FilledOrderGlobal']>, "filledOrderGlobals", ParentType, ContextType, RequireFields<SubscriptionfilledOrderGlobalsArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrdersEvent?: SubscriptionResolver<Maybe<ResolversTypes['FilledOrdersEvent']>, "filledOrdersEvent", ParentType, ContextType, RequireFields<SubscriptionfilledOrdersEventArgs, 'id' | 'subgraphError'>>;
    filledOrdersEvents?: SubscriptionResolver<Array<ResolversTypes['FilledOrdersEvent']>, "filledOrdersEvents", ParentType, ContextType, RequireFields<SubscriptionfilledOrdersEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
    orderFilledEvent?: SubscriptionResolver<Maybe<ResolversTypes['OrderFilledEvent']>, "orderFilledEvent", ParentType, ContextType, RequireFields<SubscriptionorderFilledEventArgs, 'id' | 'subgraphError'>>;
    orderFilledEvents?: SubscriptionResolver<Array<ResolversTypes['OrderFilledEvent']>, "orderFilledEvents", ParentType, ContextType, RequireFields<SubscriptionorderFilledEventsArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrder?: SubscriptionResolver<Maybe<ResolversTypes['FilledOrder']>, "filledOrder", ParentType, ContextType, RequireFields<SubscriptionfilledOrderArgs, 'id' | 'subgraphError'>>;
    filledOrders?: SubscriptionResolver<Array<ResolversTypes['FilledOrder']>, "filledOrders", ParentType, ContextType, RequireFields<SubscriptionfilledOrdersArgs, 'skip' | 'first' | 'subgraphError'>>;
    filledOrderBook?: SubscriptionResolver<Maybe<ResolversTypes['FilledOrderBook']>, "filledOrderBook", ParentType, ContextType, RequireFields<SubscriptionfilledOrderBookArgs, 'id' | 'subgraphError'>>;
    filledOrderBooks?: SubscriptionResolver<Array<ResolversTypes['FilledOrderBook']>, "filledOrderBooks", ParentType, ContextType, RequireFields<SubscriptionfilledOrderBooksArgs, 'skip' | 'first' | 'subgraphError'>>;
    _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;
export type TransactionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    type?: Resolver<ResolversTypes['TradeType'], ParentType, ContextType>;
    timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    market?: Resolver<ResolversTypes['FixedProductMarketMaker'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
    tradeAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    feeAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    outcomeIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    outcomeTokensAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
    hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
    number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
    block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
    deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type Resolvers<ContextType = MeshContext> = ResolversObject<{
    Account?: AccountResolvers<ContextType>;
    BigDecimal?: GraphQLScalarType;
    BigInt?: GraphQLScalarType;
    Bytes?: GraphQLScalarType;
    Collateral?: CollateralResolvers<ContextType>;
    Condition?: ConditionResolvers<ContextType>;
    FilledOrder?: FilledOrderResolvers<ContextType>;
    FilledOrderBook?: FilledOrderBookResolvers<ContextType>;
    FilledOrderGlobal?: FilledOrderGlobalResolvers<ContextType>;
    FilledOrdersEvent?: FilledOrdersEventResolvers<ContextType>;
    FixedProductMarketMaker?: FixedProductMarketMakerResolvers<ContextType>;
    FpmmFundingAddition?: FpmmFundingAdditionResolvers<ContextType>;
    FpmmFundingRemoval?: FpmmFundingRemovalResolvers<ContextType>;
    FpmmPoolMembership?: FpmmPoolMembershipResolvers<ContextType>;
    Global?: GlobalResolvers<ContextType>;
    Int8?: GraphQLScalarType;
    MarketPosition?: MarketPositionResolvers<ContextType>;
    Merge?: MergeResolvers<ContextType>;
    OrderFilledEvent?: OrderFilledEventResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    Redemption?: RedemptionResolvers<ContextType>;
    Split?: SplitResolvers<ContextType>;
    Subscription?: SubscriptionResolvers<ContextType>;
    Transaction?: TransactionResolvers<ContextType>;
    _Block_?: _Block_Resolvers<ContextType>;
    _Meta_?: _Meta_Resolvers<ContextType>;
}>;
export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
    entity?: entityDirectiveResolver<any, any, ContextType>;
    subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
    derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;
export type MeshContext = PolymarketTypes.Context & BaseMeshContext;
export declare const rawServeConfig: YamlConfig.Config['serve'];
export declare function getMeshOptions(): Promise<GetMeshOptions>;
export declare function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext>;
export declare function getBuiltGraphClient(): Promise<MeshInstance>;
export declare const execute: ExecuteMeshFn;
export declare const subscribe: SubscribeMeshFn;
export declare function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext): {
    AllFilledOrders(variables?: Exact<{
        market_ids?: string | string[];
    }>, options?: TOperationContext): Promise<AllFilledOrdersQuery>;
    TrackFilledOrders(variables?: Exact<{
        market_ids?: string | string[];
    }>, options?: TOperationContext): Promise<TrackFilledOrdersQuery>;
    AllMarketPositions(variables?: Exact<{
        market_ids?: string | string[];
    }>, options?: TOperationContext): Promise<AllMarketPositionsQuery>;
    TrackMarketPositions(variables?: Exact<{
        market_ids?: string | string[];
    }>, options?: TOperationContext): Promise<TrackMarketPositionsQuery>;
};
export type AllFilledOrdersQueryVariables = Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;
export type AllFilledOrdersQuery = {
    filledOrders: Array<(Pick<FilledOrder, 'timestamp' | 'price' | 'side' | 'size'> & {
        maker: Pick<Account, 'id'>;
        taker: Pick<Account, 'id'>;
        market: Pick<FilledOrderBook, 'id'>;
    })>;
};
export type TrackFilledOrdersQueryVariables = Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;
export type TrackFilledOrdersQuery = {
    filledOrders: Array<(Pick<FilledOrder, 'id' | 'timestamp' | 'price' | 'side' | 'size'> & {
        maker: Pick<Account, 'id'>;
        taker: Pick<Account, 'id'>;
        market: Pick<FilledOrderBook, 'id'>;
    })>;
};
export type AllMarketPositionsQueryVariables = Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;
export type AllMarketPositionsQuery = {
    marketPositions: Array<(Pick<MarketPosition, 'outcomeIndex' | 'netQuantity' | 'netValue'> & {
        market: Pick<FixedProductMarketMaker, 'id'>;
        user: Pick<Account, 'id'>;
    })>;
};
export type TrackMarketPositionsQueryVariables = Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;
export type TrackMarketPositionsQuery = {
    marketPositions: Array<(Pick<MarketPosition, 'outcomeIndex' | 'netQuantity' | 'netValue'> & {
        market: Pick<FixedProductMarketMaker, 'id'>;
        user: Pick<Account, 'id'>;
    })>;
};
export declare const AllFilledOrdersDocument: DocumentNode<AllFilledOrdersQuery, Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>>;
export declare const TrackFilledOrdersDocument: DocumentNode<TrackFilledOrdersQuery, Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>>;
export declare const AllMarketPositionsDocument: DocumentNode<AllMarketPositionsQuery, Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>>;
export declare const TrackMarketPositionsDocument: DocumentNode<TrackMarketPositionsQuery, Exact<{
    market_ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>>;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>;
export declare function getSdk<C, E>(requester: Requester<C, E>): {
    AllFilledOrders(variables?: AllFilledOrdersQueryVariables, options?: C): Promise<AllFilledOrdersQuery>;
    TrackFilledOrders(variables?: TrackFilledOrdersQueryVariables, options?: C): Promise<TrackFilledOrdersQuery>;
    AllMarketPositions(variables?: AllMarketPositionsQueryVariables, options?: C): Promise<AllMarketPositionsQuery>;
    TrackMarketPositions(variables?: TrackMarketPositionsQueryVariables, options?: C): Promise<TrackMarketPositionsQuery>;
};
export type Sdk = ReturnType<typeof getSdk>;
