import SuperJSON from 'superjson';
import { btrpcc } from '../../../lib/btrpc.js';
import type { extMarketChaindata, marketFulldata, marketUserChaindata } from '@am/backend/types/market.js';
import type { TUser } from '@am/backend/types/user.js';
import { web3StoreLsKey } from '$lib/web3Store.js';
import { PublicKey } from '@solana/web3.js';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

export type TProfilePageData = {
	id: string | null;
	profile?: TUser | null,
	positions?: Map<string, {
		market: marketFulldata;
		account: marketUserChaindata;
	}> | undefined,
	markets?: Map<string, marketFulldata> | undefined
}

export async function load({ params, cookies }) {

	try {

		let publicKey: string | undefined = params.profile_id;
		if (!params.profile_id) {
			let web3Store = cookies.get(web3StoreLsKey);
			if (web3Store) {
				try {
					const parsed = JSON.parse(web3Store);
					if (parsed['publicKey']) {
						publicKey = new PublicKey(parsed['publicKey']).toBase58()
					}
				} catch (e) {
					console.error(e)
				}
			}
		}

		if (publicKey && publicKey.length < 32) {
			redirect(300, "/profile")
		}

		const profileRes = !publicKey ? undefined : await btrpcc.getUser.query({
			userId: [publicKey],
		});

		const profile = (publicKey && profileRes !== undefined) ? profileRes.get(publicKey) : undefined;

		const positions = !!publicKey ? await btrpcc.getMarketAccounts.query({
			userId: publicKey,
		}) : undefined;

		const markets = !!publicKey ? await btrpcc.getUserMarkets.query({
			userId: publicKey,
		}) : undefined;

		const data: TProfilePageData = {
			id: publicKey ?? null,
			profile: profile,
			positions: positions,
			markets: markets
		};

		return SuperJSON.serialize(data);
	} catch (e) {
		console.error(e);
		return SuperJSON.serialize({ id: null })
	}
}