import SuperJSON from 'superjson';
import { trpcc } from '../lib/trpc';
import type { marketFulldata } from '@am/backend/types/market';
import type { TUser } from '@am/backend/types/user';

export type TPageData = {
	searchResponse: {
        markets: marketFulldata[];
        users: Map<string, TUser | null>;
    }
}

export async function load({ params: any }) {

    const markets = await trpcc.searchMarkets.query({
        term: "",
        limit: 10,
    });

	const data: TPageData = {
        searchResponse: markets
    }

	return SuperJSON.serialize(data);
}