<script lang="ts">
	import IconSearch from "@tabler/icons-svelte/dist/svelte/icons/IconSearch.svelte";
	import IconUfo from "@tabler/icons-svelte/dist/svelte/icons/IconUfo.svelte";
	import { Modal, modalStore } from "$lib/modals/modalStore";
	import ColumnLayout from "$lib/components/column_layout.svelte";
	import MarketCardMedium from "$lib/components/market_card_medium.svelte";
	import { PublicKey } from "@solana/web3.js";
	import AccountSummary from "$lib/components/account_summary.svelte";
	import { web3Store } from "$lib/web3Store";
	import type { TPageData } from "./+page";
	import SuperJSON from "superjson";
	import type { marketFulldata } from "@am/backend/types/market";
	import MainHeader from "$lib/components/main_header.svelte";
	export let data;

	const { searchResponse } = SuperJSON.deserialize<TPageData>(data);
	let markets = searchResponse.opMarkets.markets;
	let users = searchResponse.opMarkets.users;
	let pmMarkets = searchResponse.pmMarkets.markets;

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
		<button
			on:click={() => modalStore.openModal(Modal.search_markets)}
			class="w-1/2 md:w-full h-full flex items-center justify-start gap-2 rounded-full ring-1 ring-gray-200 bg-gray-50 p-4 text-gray-500"
		>
			<IconSearch stroke={1.7} size={18} />
			<h2 class="text-stone-500 text-sm">Search...</h2>
		</button>
	</MainHeader>
	<div slot="main" class="divide-y divide-gray-200 w-full overflow-wrap">
		<div class="p-3">
			<div
				class="w-full h-full rounded-2xl bg-gradient-to-r bg-neutral-900 flex flex-col p-8 justify-start"
			>
				<div>
					<h1 class="text-2xl font-bold text-white">
						OpenPredict
						<span
							class="bg-gradient-to-bl from-zinc-200 to-gray-700 bg-clip-text text-transparent"
						>
							v0.2
						</span>
					</h1>
				</div>
				<p class="text-neutral-300 font-medium mt-2">
					Ask questions, place forcasts, and make money by being
					right.
				</p>
				<button
					class="btn_primary mt-8 w-40 text-white bg-gradient-to-tr from-white/20 to-white/30 shadow-xl hover:shadow-2xl hover:bg-white/20"
				>
					Create a market
				</button>
			</div>
		</div>
		{#each pmMarkets.slice(0, 20) as market, i}
			<div class="w-full bg-white p-3">
				<a href={`/${market.question_id}`}>
					<div class="p-8 flex flex-col gap-4">
						<h2 class="text-xl font-semibold">
							{market.question}
						</h2>
						<!-- <p class="whitespace-pre-wrap">
							{market.description}
						</p> -->
						<!-- <button on:click={async () => {}}> Trade? </button> -->
						<div />
					</div>
				</a>
			</div>
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
		{#if markets.length === 0}
			<div class="flex flex-col items-center justify-center h-80 gap-6">
				<IconUfo size={28} class="rotate-[-12deg]" />
				<h4 class="">No markets found</h4>
				<button class="btn_primary w-40"> Create a market </button>
			</div>
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
