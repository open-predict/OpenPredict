<script lang="ts">
	import IconSearch from "@tabler/icons-svelte/dist/svelte/icons/IconSearch.svelte";
	import IconUfo from "@tabler/icons-svelte/dist/svelte/icons/IconUfo.svelte";
	import IconCal from "@tabler/icons-svelte/dist/svelte/icons/IconCalendar.svelte";
	import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconDotsVertical.svelte";
	import IconDown from "@tabler/icons-svelte/dist/svelte/icons/IconTriangleFilled.svelte";
	import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUserCheck.svelte";
	import IconComment from "@tabler/icons-svelte/dist/svelte/icons/IconMessageCircle2.svelte";
	import IconHeart from "@tabler/icons-svelte/dist/svelte/icons/IconHeart.svelte";
	import IconExchange from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsExchange2.svelte";
	import IconSubsidy from "@tabler/icons-svelte/dist/svelte/icons/IconMoneybag.svelte";
	import IconShare from "@tabler/icons-svelte/dist/svelte/icons/IconShare.svelte";
	import { Modal, modalStore } from "$lib/modals/modalStore";
	import ColumnLayout from "$lib/components/column_layout.svelte";
	import MarketCardMedium from "$lib/components/market_card_medium.svelte";
	import { PublicKey } from "@solana/web3.js";
	import AccountSummary from "$lib/components/account_summary.svelte";
	import { web3Store } from "$lib/web3Store";
	import type { TPageData } from "./+page";
	import type { marketFulldata } from "@am/backend/types/market";
	import SuperJSON from "superjson";
	import MainHeader from "$lib/components/main_header.svelte";
	import SmallChart from "$lib/charts/small_chart.svelte";
	import { faker } from "@faker-js/faker";
	import ImageChecker from "$lib/elements/image_checker.svelte";
	import Pill from "$lib/elements/pill.svelte";
	import SubsidyButton from "$lib/elements/subsidy_button.svelte";
	import LikeButton from "$lib/elements/like_button.svelte";
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
		<button
			on:click={() => modalStore.openModal(Modal.search_markets)}
			class="w-1/2 md:w-full h-full flex items-center justify-start gap-2 rounded-full ring-1 ring-gray-200 bg-gray-50 p-4 text-gray-500"
		>
			<IconSearch stroke={1.7} size={18} />
			<h2 class="text-stone-500 text-sm">Search...</h2>
		</button>
	</MainHeader>
	<div
		slot="main"
		class="divide-y w-full overflow-wrap divide-gray-200 dark:divide-neutral-900"
	>
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
		{#each pmMarkets.reverse().slice(100, 110) as market, i}
			<div
				class="group w-full p-3 bg-white dark:bg-neutral-950 ring-inset"
			>
				<a href={`/${market.question_id}`} class="group/link">
					<div class="w-full p-4 flex flex-col gap-4 pr-6">
						<!-- <div class="flex bg-neutral-100 w-full rounded-md p-2">
							<img 
								src={faker.image.avatar()} 
								alt="user"
								class="w-6 h-6 rounded-full ring-white"
							/>
							<span class="text-sm text-neutral-500">
								{faker.internet.userName()}
							</span>
						</div> -->
						<!-- <img
								src={market.icon}
								alt="Market icon"
								class="w-14 h-14 object-cover rounded-xl"
							/> -->

						<div
							class="flex flex-col justify-start items-start gap-6 overflow-hidden w-full"
						>
							<div
								class="w-full flex justify-start gap-2 items-center"
							>
								<Pill>
									<img
										src={faker.image.avatar()}
										alt="user"
										class="w-3.5 h-3.5 rounded-full ring-white ring-1 ring-inset"
									/>
									<span>
										{"Polymarket"}
									</span>
								</Pill>
								<Pill>
									<IconExchange
										size={14}
										class="text-neutral-500"
									/>
									<span>
										{"$247.9K"}
									</span>
								</Pill>
								<Pill>
									<IconSubsidy
										size={14}
										class="text-neutral-500"
									/>
									<span>
										{"$1.2K"}
									</span>
								</Pill>
								<!-- {#each market.categories as category}
									<Pill>
										{category}
									</Pill>
								{/each} -->
								<div class="ml-auto" />
								<Pill>
									<IconCal
										size={14}
										class="text-neutral-500"
									/>
									{`${new Date(
										market.end_date_iso
									).toLocaleDateString("en-us", {
										year: "numeric",
										month: "numeric",
										day: "numeric",
									})}`}
								</Pill>
								<button class="action_icon h-6 w-6">
									<IconMenu size={14} />
								</button>
							</div>
							<ImageChecker
								url={market.image}
								ratio={1.5}
								resolution={200}
							>
								<img
									src={market.image}
									class={`w-full h-72 rounded-lg object-cover object-center`}
									alt="market cover"
								/>
							</ImageChecker>
							<div
								class="flex w-full align-top gap-4 justify-start items-start flex-nowrap"
							>
								<h2
									class="text-xl font-semibold text-white flex-grow group-hover:underline group-visited/link:text-indigo-300"
								>
									{market.question}
								</h2>
								<div
									class="ml-auto flex items-start justify-start"
								>
									<div class="mx-3">
										<h2
											class="text-xl font-bold text-white"
										>
											68%
										</h2>
										<div
											class="flex text-red-500 items-center gap-1"
										>
											<IconDown
												size={6}
												class="rotate-180 text-red-600"
											/>
											<span class="text-xs"> 14% </span>
										</div>
									</div>
									<button
										class="group/trade flex flex-col items-center justify-center rounded-l-md ring-1 ring-inset ring-neutral-800 bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-900"
									>
										<span
											class="text-[10px] flex justify-center items-center py-0.5 text-neutral-400 font-normal tracking-widest border-b border-neutral-800 w-full"
										>
											BUY
										</span>
										<span
											class="text-emerald-500 px-3 py-1"
										>
											{"Yes"}
										</span>
									</button>
									<button
										class="group/trade flex flex-col items-center justify-center rounded-r-md ring-1 ring-inset ring-neutral-800 bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-900"
									>
										<span
											class="text-[10px] flex justify-center items-center py-0.5 text-neutral-400 font-normal tracking-widest border-b border-neutral-800 w-full"
										>
											BUY
										</span>
										<span class="text-red-500 px-3 py-1">
											{"No"}
										</span>
									</button>
								</div>
							</div>
							<p
								class="text-md line-clamp-3 whitespace-pre-wrap text-neutral-700 dark:text-neutral-400"
							>
								{market.description.replaceAll("\n\n", "\n")}
							</p>
							<div
								class="w-full flex flex-nowrap justify-start items-center"
							>
								<div class="flex flex-nowrap pl-4 p-1">
									{#each Array.from(Array(6)) as t}
										<img
											src={faker.image.avatar()}
											alt="s"
											class="h-6 w-6 rounded-full -ml-3 ring-2 ring-neutral-900"
										/>
									{/each}
									<div
										class="h-6 w-6 rounded-full -ml-3 ring-2 ring-neutral-900 bg-neutral-800 flex justify-center items-center text-xs font-semibold text-white"
									>
										+23
									</div>
								</div>
								<div
									class="flex-grow flex ml-auto justify-end items-center gap-6"
								>
									<a
										href={`/app#comments`}
										class="flex items-center justify-center text-sm gap-1 px-2 text-neutral-400"
									>
										<IconComment
											class="stroke-neutral-600 fill-transparent"
											size={20}
										/>
										{29}
									</a>
									<button
										on:click|stopPropagation|preventDefault={(
											e
										) => {
											e.stopPropagation();
										}}
										class="flex items-center justify-center text-sm gap-1 px-2 text-neutral-400"
									>
										<IconHeart
											class="stroke-neutral-600 fill-transparent"
											size={20}
										/>
										{24}
									</button>
									<button
										on:click|stopPropagation|preventDefault={(
											e
										) => {
											e.stopPropagation();
										}}
										class="flex items-center justify-center text-sm gap-1 px-2 text-neutral-400"
									>
										<IconShare
											class="stroke-neutral-600 fill-transparent"
											size={20}
										/>
										{6}
									</button>
								</div>
							</div>
						</div>
						<!-- <div
									class="h-20 flex justify-center items-center w-full"
								>
									<div class="w-3/4 h-full">
										<SmallChart priceData={[]} />
									</div>
								</div> -->
						<!-- <div class="flex gap-4">
									<button class="btn_secondary w-full">
										Buy
										<span class="text-emerald-500">
											{"'Yes'"}
										</span>
									</button>
									<button class="btn_secondary w-full">
										Buy
										<span class="text-red-500">
											{"'No'"}
										</span>
									</button>
								</div> -->
						<!-- <MarketActions small updateMarket={() => console.log()} market={pmBook.get(market.question_id)}/> -->
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
