import SuperJSON from 'superjson';
import { trpcc } from '../../lib/trpc.js';
import type { marketFulldata } from '@am/backend/types/market.js';
import type { TUser } from '@am/backend/types/user.js';

export type TMarketIdPageData = {
	id: string,
	marketData?: {
		market: marketFulldata;
		users: Map<string, {
			username: string | null;
		}>;
	},
	users?: Map<string, TUser>,
	commentsRes: {
		comments: {
			createdAt: Date;
			userKey: string;
			content: string;
		}[];
		users: Map<string, TUser | null>;
	}
}

export async function load({ params }) {
	console.log(params, params.market_id.length)

	const marketRes = await trpcc.getMarket.query({
		id: params.market_id,
	})

	const commentsRes = await trpcc.listComments.query({
		ammAddress: params.market_id,
	})
	if (commentsRes.comments) commentsRes.comments.reverse()

	const users = marketRes.resp?.users ? await trpcc.getUser.query({
		userId: Array.from(marketRes.resp?.users.keys())
	}) : undefined;

	const data: TMarketIdPageData = {
		id: params.market_id,
		marketData: marketRes.resp ?? undefined,
		users: users,
		commentsRes: commentsRes
	}

	return SuperJSON.serialize(data);
}
