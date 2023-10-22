<script lang="ts">
	import type { TPageData } from "./+page";
	import ColumnLayout from "$lib/components/column_layout.svelte";
	import AccountSummary from "$lib/components/account_summary.svelte";
	import { web3Store } from "$lib/web3Store";
	import MainHeader from "$lib/components/header.svelte";
	import SearchButton from "$lib/elements/search_button.svelte";
	import NoMarkets from "$lib/components/no_markets.svelte";
	import { superjson } from "$lib/superjson";
	import OpMarketCard from "$lib/components/op_market_card.svelte";
	import PmMarketCard from "$lib/components/pm_market_card.svelte";
	import type { marketFulldata } from "@am/backend/types/market";
	import { api } from "$lib/api";
	import { onMount, tick } from "svelte";
	import type { pmMarketFulldata } from "@am/backend/types/market";
	import MobileMenuButton from "$lib/elements/mobile_menu_button.svelte";
    import { PublicKey } from "@solana/web3.js";
    import type { MarketSearchResult } from "@am/backend/server/routers/_app";

	export let data;
	$: pageData = superjson.deserialize<TPageData>(data)
	$: markets = pageData.searchResults?.data ?? []

	function updateMarket(
		id: string,
		market: pmMarketFulldata | marketFulldata | undefined
	) {
		// markets[i] = m;
		// markets = markets;
	}

	type TSnapshot = {
		data: TPageData,
		scrollPosition: number,
	}
	export const snapshot = {
		capture: () => {
			const _snapshot: TSnapshot = {
				data: pageData,
				scrollPosition: window.document.body.scrollTop,
			}
			return superjson.stringify(_snapshot);
		},
		restore: async (value) => {
			return;
			if(!value) return;
			const parsedData = superjson.deserialize<TSnapshot>(value);
			// if (parsedData.data && parsedData.scrollPosition) {
			// 	const existingIds = (parsedData.data as TPageData).map(
			// 		(m) => m.opMarket ? new PublicKey(m.opMarket.data.data.AmmAddress).toBase58() : m.pmMarket ? m.pmMarket.data.condition_id : null
			// 	).filter(m => m !== null);
			// 	markets = [
			// 		...value.marketsInView,
			// 		...(markets ?? []).filter((m) => !existingIds.includes(m.opMarket ? new PublicKey(m.opMarket.data.data.AmmAddress).toBase58() : m.pmMarket ? m.pmMarket.data.condition_id : null)),
			// 	];
			// 	await tick();
			// 	window.document.body.scrollTo({ top: value.scrollPosition });
			// }
		},
	};

	onMount(() => {
		const topIndicator = window.document.getElementById("top_indicator");
		const bottomIndicator =
			window.document.getElementById("bottom_indicator");
		if (topIndicator && bottomIndicator) {
			const topObserver = new IntersectionObserver((entries) => {
				if (entries[entries.length - 1].isIntersecting) {
					console.log("Implement top refresh");
				}
			});
			const bottomObserver = new IntersectionObserver(async (entries) => {
				if (entries[entries.length - 1].isIntersecting) {
					console.log("Implement infinite scroll")
					// const relatedMarkets = await api.getRelatedMarkets
					// markets = [...(markets ?? []), ...relatedMarkets];
				}
			});
			topObserver.observe(topIndicator);
			bottomObserver.observe(bottomIndicator);
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Prediction market" />
</svelte:head>

<ColumnLayout>
	<MainHeader slot="main-header">
		<SearchButton slot="center" />
		<div slot="right" class="md:hidden">
			<MobileMenuButton />
		</div>
	</MainHeader>
	<div
		slot="main"
		class="divide-y w-full max-w-full divide-gray-200 dark:divide-neutral-900"
	>
		<!-- <IntroCard /> -->
		{#if markets && markets.length > 0}
			<div id="top_indicator" class="opacity-0 border-0 ring-0" />
			{#each markets as {opMarket, pmMarket}}
				{#if opMarket}
					<OpMarketCard
						market={opMarket}
						updateMarket={(m) => updateMarket(new PublicKey(opMarket?.data.data.AmmAddress ?? "").toBase58(), m)}
					/>
				{/if}
				{#if pmMarket}
					<PmMarketCard
						market={pmMarket}
						updateMarket={(m) => updateMarket(pmMarket?.data.condition_id ?? "", m)}
					/>
				{/if}
			{/each}
			<div id="bottom_indicator" class="opacity-0" />
		{:else}
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
