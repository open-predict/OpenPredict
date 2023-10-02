<script lang="ts">
	import ColumnLayout from "$lib/components/column_layout.svelte";
	import MarketCardMedium from "$lib/components/market_card_medium.svelte";
	import { PublicKey } from "@solana/web3.js";
	import AccountSummary from "$lib/components/account_summary.svelte";
	import { web3Store } from "$lib/web3Store";
	import type { TPageData } from "./+page";
	import type { marketFulldata } from "@am/backend/types/market";
	import SuperJSON from "superjson";
	import MainHeader from "$lib/components/header.svelte";
	import SearchButton from "$lib/elements/search_button.svelte";
	import PolymarketCard from "$lib/components/polymarket_card.svelte";
	import NoMarkets from "$lib/components/no_markets.svelte";
	export let data;

	const { searchResponse } = SuperJSON.deserialize<TPageData>(data);
	let markets = searchResponse.opMarkets.markets;
	let users = searchResponse.opMarkets.users;
	let pmMarkets = searchResponse.pmMarkets.markets;
	let pmBook = searchResponse.pmMarkets.books;

	function updateMarket(i: number, m: marketFulldata) {
		markets[i] = m;
		markets = markets;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Prediction market" />
</svelte:head>

<ColumnLayout>
	<MainHeader slot="main-header">
		<SearchButton />
	</MainHeader>
	<div
		slot="main"
		class="divide-y w-full max-w-full divide-gray-200 dark:divide-neutral-900"
	>
		<!-- <IntroCard /> -->
		{#each pmMarkets.reverse().slice(100, 110) as market, i}
			<PolymarketCard {market} />
		{/each}
		{#each markets as market, i}
			<div class="bg-white">
				<a
					href={`/${new PublicKey(
						market.data.data.AmmAddress
					).toBase58()}`}
				>
					<MarketCardMedium
						{market}
						creator={users.get(
							new PublicKey(
								market.data.data.OperatorKey
							).toBase58()
						) ?? undefined}
						updateMarket={(m) => updateMarket(i, m)}
					/>
				</a>
			</div>
		{/each}
		{#if markets.length === 0 && pmMarkets.length === 0}
			<NoMarkets />
			<div />
		{/if}
	</div>
	<div slot="right">
		{#if $web3Store?.polygonAddress}
			<div class="bg-white ring-1 rounded-3xl ring-gray-200">
				<AccountSummary />
			</div>
		{/if}
	</div>
</ColumnLayout>
