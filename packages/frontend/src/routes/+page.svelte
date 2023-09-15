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
	let markets = searchResponse.markets;
	let users = searchResponse.users;

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
			class="w-full h-full flex items-center justify-start gap-2 rounded-full ring-1 ring-gray-200 bg-gray-50 p-4 text-gray-500"
		>
			<IconSearch stroke={1.7} size={18} />
			<h2 class="text-stone-500 text-sm">Search...</h2>
		</button>
	</MainHeader>
	<div slot="main" class="divide-y divide-gray-200">
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
		<!-- {#if markets.length === 0}
			<div class="flex flex-col items-center justify-center h-80 gap-6">
				<IconUfo size={28} class="rotate-[-12deg]" />
				<h4 class="">
					No markets found
				</h4>
				<button class="btn_primary w-40 m-4">
					Create a market
				</button>
			</div>
			<div />
		{/if} -->
	</div>
	<div slot="right">
		{#if $web3Store?.publicKey}
			<div class="bg-white ring-1 rounded-3xl ring-gray-200">
				<AccountSummary />
			</div>
		{/if}
	</div>
</ColumnLayout>
