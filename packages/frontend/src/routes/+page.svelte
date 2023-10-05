<script lang="ts">
	import type { TPageData } from "./+page";
	import ColumnLayout from "$lib/components/column_layout.svelte";
	import MarketCardMedium from "$lib/components/op_market_card.svelte";
	import AccountSummary from "$lib/components/account_summary.svelte";
	import { web3Store } from "$lib/web3Store";
	import MainHeader from "$lib/components/header.svelte";
	import SearchButton from "$lib/elements/search_button.svelte";
	import PolymarketCard from "$lib/components/pm_market_card.svelte";
	import NoMarkets from "$lib/components/no_markets.svelte";
	import { superjson } from "$lib/superjson";
	import OpMarketCard from "$lib/components/op_market_card.svelte";
	import PmMarketCard from "$lib/components/pm_market_card.svelte";
	import type { TPmMarket } from "$lib/types";
	import type { marketFulldata } from "@am/backend/types/market";

	export let data;
	const markets = superjson.deserialize<TPageData>(data);
	markets.sort((a, b) => Number(a.volume - b.volume));

	function updateMarket(
		id: string,
		market: TPmMarket | marketFulldata | undefined
	) {
		// markets[i] = m;
		// markets = markets;
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
		{#each markets as market}
			{#if market.opMarket}
				<OpMarketCard
					market={market.opMarket}
					updateMarket={(m) => updateMarket(market.id, m)}
				/>
			{:else if market.pmMarket}
				<PmMarketCard
					market={market.pmMarket}
					updateMarket={(m) => updateMarket(market.id, m)}
				/>
			{/if}
		{/each}
		{#if markets.length === 0}
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
