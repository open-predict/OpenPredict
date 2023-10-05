import SuperJSON from 'superjson';
import type { extMarketChaindata, marketFulldata, marketUserChaindata } from '@am/backend/types/market.js';
import type { TUser } from '@am/backend/types/user.js';
import { web3StoreLsKey } from '$lib/web3Store.js';
import { PublicKey } from '@solana/web3.js';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export type TProfilePageData = {
	id: string | null;
	profile?: TUser | null,
	positions?: Map<string, {
		market: marketFulldata;
		account: marketUserChaindata;
	}> | undefined,
	markets?: Map<string, marketFulldata> | undefined
}

export async function load({ data: server_data, params }) {

	// const trpc = browser
	// 	? (await import("$lib/trpc.js")).trpcc 
	// 	: (await import("$lib/btrpc.js")).btrpc;

	// try {

	// 	const{ publicKey } = server_data

	// 	if (publicKey && publicKey.length < 32) {
	// 		redirect(300, "/profile")
	// 	}

	// 	const profileRes = !publicKey ? undefined : await trpc.getUser.query({
	// 		userId: [publicKey],
	// 	});

	// 	const profile = (publicKey && profileRes !== undefined) ? profileRes.get(publicKey) : undefined;

	// 	const positions = !!publicKey ? await trpc.getMarketAccounts.query({
	// 		userId: publicKey,
	// 	}) : undefined;

	// 	const markets = !!publicKey ? await trpc.getUserMarkets.query({
	// 		userId: publicKey,
	// 	}) : undefined;

	// 	const data: TProfilePageData = {
	// 		id: publicKey ?? null,
	// 		profile: profile,
	// 		positions: positions,
	// 		markets: markets
	// 	};

	// 	return SuperJSON.serialize(data);
	// } catch (e) {
	// 	console.error(e);
	return SuperJSON.serialize({ id: null })
	// }
}