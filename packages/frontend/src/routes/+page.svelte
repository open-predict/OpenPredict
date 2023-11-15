<script lang="ts">
	import type { TPageData } from "./+page";
	import ColumnLayout from "$lib/components/column_layout.svelte";
	import MainHeader from "$lib/components/header.svelte";
	import SearchButton from "$lib/elements/search_button.svelte";
	import NoMarkets from "$lib/components/no_markets.svelte";
	import { superjson } from "$lib/superjson";
	import OpMarketCard from "$lib/components/op_market_card.svelte";
	import PmMarketCard from "$lib/components/pm_market_card.svelte";
	import { onMount, tick } from "svelte";
	import MobileMenuButton from "$lib/elements/mobile_menu_button.svelte";
	import { PublicKey } from "@solana/web3.js";
	import type { AppRouterOutputs } from "@am/backend/server/routers/_app";
	import type { TMarket } from "$lib/types";
    import { browser } from "$app/environment";
	export let data;

	$: pageData = superjson.deserialize<TPageData>(data);
	$: pmUsers =
		pageData.searchResults?.meta.pmUsers ??
		(new Map() as AppRouterOutputs["searchMarkets"]["meta"]["pmUsers"]);
	$: opUsers =
		pageData.searchResults?.meta.opUsers ??
		(new Map() as AppRouterOutputs["searchMarkets"]["meta"]["opUsers"]);

	const getMarkets = (pd: TPageData): TMarket[] => {
		let _markets: TMarket[] = [];
		if (pd.error) {
			if(browser) alert("Error requesting markets. Please check the console.");
			console.error(pageData.error);
		}
		if (pd.searchResults?.data) {
			pd.searchResults.data.forEach(({ opMarket, pmMarket }) => {
				if (opMarket) {
					const id = new PublicKey(
						opMarket.data.data.AmmAddress
					).toBase58();
					_markets.push({
						opMarket: {
							...opMarket,
							likeNo: pd.searchResults?.meta.likeNo[id] ?? 0,
							commentNo: pd.searchResults?.meta.likeNo[id] ?? 0,
						},
						pmMarket: undefined,
					});
				}
				if (pmMarket) {
					_markets.push({
						pmMarket: {
							...pmMarket,
							likeNo:
								pd.searchResults?.meta.likeNo[
									pmMarket.data.condition_id
								] ?? 0,
							commentNo:
								pd.searchResults?.meta.likeNo[
									pmMarket.data.condition_id
								] ?? 0,
						},
						opMarket: undefined,
					});
				}
			});
		}
		return _markets;
	};

	let markets: TMarket[] = [];
	$: pageData, (markets = getMarkets(pageData));

	function updateMarket(id: string, market: TMarket) {
		let index: number = -1;
		if (market.opMarket) {
			index = markets.findIndex(
				(m) =>
					m.opMarket &&
					new PublicKey(m.opMarket.data.data.AmmAddress).toBase58()
			);
		}
		if (index > -1) {
			markets[index] = market;
			markets = markets;
		}
	}

	type TSnapshot = {
		data: TPageData;
		scrollPosition: number;
	};
	export const snapshot = {
		capture: () => {
			const _snapshot: TSnapshot = {
				data: pageData,
				scrollPosition: window.document.body.scrollTop,
			};
			return superjson.stringify(_snapshot);
		},
		restore: async (value) => {
			if (!value) return;
			const parsedData = superjson.parse<TSnapshot>(value);
			if (
				parsedData &&
				parsedData.data &&
				parsedData.scrollPosition &&
				parsedData.data.searchResults
			) {
				const ids = parsedData.data.searchResults.data.map((m) =>
					m.opMarket
						? new PublicKey(
								m.opMarket.data.data.AmmAddress
						  ).toBase58()
						: m.pmMarket.data.condition_id
				);
				const filtered = markets.filter(
					(m) =>
						!ids.includes(
							m.opMarket
								? new PublicKey(
										m.opMarket.data.data.AmmAddress
								  ).toBase58()
								: m.pmMarket?.data.condition_id ?? ""
						)
				);
				markets = [...getMarkets(parsedData.data), ...filtered];
				await tick();
				window.document.body.scrollTo({ top: value.scrollPosition, behavior: "instant" });
			}
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
					console.log("Implement infinite scroll");
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
		class="divide-y w-full max-w-full divide-neutral-200 dark:divide-neutral-900"
	>
		{#if markets && markets.length > 0}
			<!-- <div id="top_indicator">
				<IntroCard />
			</div> -->
			{#each markets as { opMarket, pmMarket }}
				{#if opMarket}
					<OpMarketCard
						users={pageData.searchResults?.meta.opUsers}
						market={opMarket}
						updateMarket={(m) => {
							if (m) {
								updateMarket(
									new PublicKey(
										opMarket?.data.data.AmmAddress ?? ""
									).toBase58(),
									m
								);
							}
						}}
					/>
				{/if}
				{#if pmMarket}
					<PmMarketCard
						{pmUsers}
						market={pmMarket}
						users={pageData.searchResults?.meta.opUsers}
						updateMarket={(m) => {
							if (m)
								updateMarket(
									pmMarket?.data.condition_id ?? "",
									m
								);
						}}
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
		<!-- {#if $web3Store?.polygonAddress}
			<div class="bg-white dark:bg-neutral-950 rounded-2xl">
				<AccountSummary />
			</div>
		{/if} -->
	</div>
</ColumnLayout>
