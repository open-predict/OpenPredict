<script lang="ts">
    import type { marketFulldata } from "@am/backend/types/market";
    import { PublicKey } from "@solana/web3.js";
    import IconUser from "@tabler/icons-svelte/dist/svelte/icons/IconUserCheck.svelte";
    import IconComment from "@tabler/icons-svelte/dist/svelte/icons/IconMessageCircle2.svelte";
    import { getChance } from "$lib/utils";
    import SmallChart from "../charts/small_chart.svelte";
    import ProfileButton from "./profile_button.svelte";
    import type { TUser } from "@am/backend/types/user";
    import MarketActions from "./market_actions.svelte";
    import base58 from "bs58";
    import LikeButton from "../elements/like_button.svelte";
    import SubsidyButton from "$lib/elements/subsidy_button.svelte";

    export let market: marketFulldata;
    export let creator: TUser | undefined | null = undefined;
    export let updateMarket: (market: marketFulldata) => void;

    $: chance = getChance(market.data.data.Yes, market.data.data.No);
    $: createdAt = market?.data?.PriceHistory[0]?.At as Date | undefined;
    export const dateFormatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
    });
</script>

{#if !!market}
    <div class="flex flex-col p-4 md:p-8 gap-6 w-full">
        <div
            class="w-full flex items-center bg-transparent"
        >
            <ProfileButton
                publicKey={new PublicKey(market.data.data.OperatorKey)}
                profile={creator}
            />
            {#if createdAt}
                <span class="text-xs text-gray-600 ml-auto">
                    {`Created on ${dateFormatter.format(createdAt)}`}
                </span>
            {/if}
        </div>
        <div>
            <h5 class="text-xl text-black leading-8 font-semibold">
                {market.metadata?.title ?? "No title found"}
            </h5>
            <p
                class="mt-6 text-gray-700 whitespace-pre-wrap line-clamp-2 sm:line-clamp-4"
            >
                {market.metadata?.description ?? "No description found"}
            </p>
        </div>
        <div class="w-full flex flex-nowrap justify-between items-center pr-4">
            <div class="flex flex-col">
                <p class={`whitespace-pre-wrap text-3xl`}>
                    {`${(chance * 100).toFixed(1)}%`}
                </p>
                <span class="text-xs -mt-1 text-gray-500">{"CHANCE"}</span>
            </div>
            {#if market}
                <div class="w-3/4 lg:w-1/2 h-24 pl-10">
                    <SmallChart priceData={market.data.PriceHistory} />
                </div>
            {/if}
        </div>
        <div class="flex gap-4">
            <MarketActions {market} {updateMarket} />
        </div>
        <div class="flex flex-nowrap justify-between">
            <SubsidyButton subsidy={market.data.data.Subsidy} />
            <a
                href={`/${base58.encode(
                    market.data.data.AmmAddress
                )}#positions`}
                class="flex py-2.5 px-4 justify-center items-center rounded-full gap-2 text-gray-500 fill-gray-200 stroke-gray-500 text-md hover:bg-gray-100 hover:text-gray-600 hover:stroke-gray-600 hover:fill-gray-300"
            >
                <IconUser class="stroke-inherit fill-inherit" size={20} />
                {market.data.UserAccounts.size}
            </a>
            <a
                href={`/${base58.encode(market.data.data.AmmAddress)}#comments`}
                class="flex py-2.5 px-4 justify-center items-center rounded-full gap-2 text-gray-500 fill-gray-200 stroke-gray-500 text-md hover:bg-gray-100 hover:text-gray-600 hover:stroke-gray-600 hover:fill-gray-300"
            >
                <IconComment class="stroke-inherit fill-inherit" size={20} />
                {market.data.CommentCount}
            </a>
            <LikeButton {market} {updateMarket} />
        </div>
    </div>
{/if}
