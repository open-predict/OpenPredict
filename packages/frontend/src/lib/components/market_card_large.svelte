<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import Svend3rChart from "$lib/charts/interactive_chart.svelte";
    import { web3Store } from "$lib/web3Store";
    import { USDC_PER_DOLLAR, getChance } from "$lib/utils";
    import ProfileButton from "./profile_button.svelte";
    import { PublicKey } from "@solana/web3.js";
    import MarketActions from "./market_actions.svelte";
    import type { TUser } from "@am/backend/types/user";
    import IconCurrency from "@tabler/icons-svelte/dist/svelte/icons/IconCurrency.svelte";
    import LikeButton from "../elements/like_button.svelte";
    import SubsidyButton from "$lib/elements/subsidy_button.svelte";

    export let market: marketFulldata;
    export let users: Map<string, TUser> | undefined;
    export let updateMarket: (market: marketFulldata) => void;

    $: chance = getChance(market.data.data.Yes, market.data.data.No);
    $: position = $web3Store?.publicKey
        ? market.data.UserAccounts.get($web3Store.publicKey.toBase58())
        : null;

    const operatorKey = market ? market.data.data.OperatorKey.toString() : "";
    const operatorProfile = users ? users.get(operatorKey) : null;
    const isCreator =
        operatorKey &&
        $web3Store?.publicKey &&
        operatorKey === $web3Store.publicKey?.toBase58();
    const isResolved = market.data.data.Resolved;
</script>

{#if !!market}
    <div class="w-full text-left bg-white">
        <div class="flex items-center text-gray-400 text-xs">
            <ProfileButton
                publicKey={new PublicKey(market.data.data.OperatorKey)}
                profile={operatorProfile}
            />
            <div class="ml-auto" />
            <SubsidyButton subsidy={market.data.data.Subsidy} />
            <LikeButton {market} {updateMarket} />
        </div>
        <div class="flex flex-col gap-4">
            <h5 class="text-2xl font-semibold py-4 text-black">
                {market.metadata?.title ?? "No title found"}
            </h5>
            <div class="w-full flex flex-col my-4">
                <h5 class="text-2xl text-black leading-none">
                    {`${(chance * 100).toFixed(1)}%`}
                </h5>
                <p class="text-sm text-gray-600">
                    {"CHANCE"}
                </p>
            </div>
            <div class="-ml-1">
                <Svend3rChart
                    priceData={market.data.PriceHistory}
                    onScrub={(c) => (chance = c / 100)}
                />
            </div>
            <!-- <div class="flex flex-col mt-8 bg-neutral-800 rounded-3xl"> -->
                <!-- <div class="flex flex-col gap-2 divide-gray-200 p-8">
                    <h4 class="text-xl text-white">Place a trade</h4>
                    <p class="text-neutral-400">
                        Make a prediction by trading 'yes' or 'no.'
                    </p>
                </div> -->
                <div class="flex justify-center items-center gap-4 mt-8">
                    <MarketActions {market} {updateMarket} />
                </div>
            <!-- </div> -->
            <p class="text-md text-black whitespace-pre-wrap mt-8">
                {market.metadata?.description ?? "No description found"}
            </p>
        </div>
    </div>
{/if}
