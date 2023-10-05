<script lang="ts">
    import IconCal from "@tabler/icons-svelte/dist/svelte/icons/IconCalendar.svelte";
    import IconMenu from "@tabler/icons-svelte/dist/svelte/icons/IconDotsVertical.svelte";
    import IconTrade from "@tabler/icons-svelte/dist/svelte/icons/IconArrowsUpDown.svelte";
    import { faker } from "@faker-js/faker";
    import ImageChecker from "$lib/elements/image_checker.svelte";
    import Pill from "$lib/elements/pill.svelte";
    import PolymarketLogo from "$lib/elements/polymarket_logo.svelte";
    import LikeButton from "$lib/elements/like_button.svelte";
    import ShareButton from "$lib/elements/share_button.svelte";
    import CommentButton from "$lib/elements/comment_button.svelte";
    import type { TPmMarket } from "$lib/types";
    import ChangeIndicator from "$lib/elements/change_indicator.svelte";
    import SubsidyPill from "$lib/elements/subsidy_pill.svelte";
    import VolumePill from "$lib/elements/volume_pill.svelte";
    import type { marketFulldata } from "@am/backend/types/market";
    export let market: TPmMarket;
    export let updateMarket: (market?: marketFulldata | TPmMarket) => void;
</script>

<div
    class="group w-full max-w-full p-3 bg-white dark:bg-neutral-950 ring-inset"
>
    <a href={`/${market.data.condition_id}`} class="group/link max-w-full">
        <div class="w-full max-w-full py-1.5 lg:p-2 xl:p-4 flex flex-col gap-4">
            <div class="w-full flex flex-col justify-start items-start gap-6">
                <div
                    class="w-full flex justify-between items-center flex-nowrap gap-2"
                >
                    <div class="relative w-9/10 max-w-9/10 overflow-hidden">
                        <div
                            class="absolute h-full w-20 bg-gradient-to-r from-transparent to-neutral-950 right-0"
                        />
                        <div
                            class="w-full flex justify-start gap-2 items-center overflow-x-scroll scrollbar_hide pr-20"
                        >
                            <Pill>
                                <div
                                    class="w-4 h-4 rounded-full ring-neutral-400 bg-blue-700 ring-1 ring-inset stroke-white p-1"
                                >
                                    <PolymarketLogo />
                                </div>
                                <span>
                                    {"Polymarket"}
                                </span>
                            </Pill>
                            <VolumePill pmMarket={market} />
                            <SubsidyPill pmMarket={market} />
                            <Pill>
                                <IconCal size={14} class="text-red-400/50" />
                                {`${new Date(
                                    market.data.end_date_iso
                                ).toLocaleDateString("en-us", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                })}`}
                            </Pill>
                        </div>
                    </div>
                    <button class="action_icon h-6 w-6">
                        <IconMenu size={14} />
                    </button>
                </div>
                <ImageChecker
                    url={market.data.image}
                    ratio={1.5}
                    resolution={200}
                >
                    <img
                        src={market.data.image}
                        class={`w-full h-72 rounded-lg object-cover object-center`}
                        alt="market cover"
                    />
                </ImageChecker>
                <div
                    class="flex w-full align-top gap-4 justify-start items-start flex-nowrap"
                >
                    <h2
                        class="text-lg lg:text-xl font-semibold text-white flex-grow group-hover:underline group-visited/link:text-indigo-300"
                    >
                        {market.data.question}
                    </h2>
                    <div class="ml-auto flex items-start justify-start">
                        <div class="ml-3 flex flex-col justify-start items-end">
                            <h2 class="text-md lg:text-xl font-bold text-white">
                                68%
                            </h2>
                            <ChangeIndicator pmMarket={market} />
                        </div>
                    </div>
                </div>
                <p
                    class="w-full break-words text-sm lg:text-md overflow-hidden line-clamp-3 whitespace-pre-wrap text-neutral-700 dark:text-neutral-400"
                />
                <div class="w-full flex flex-nowrap justify-start items-center">
                    <div class="flex flex-nowrap pl-4 p-1">
                        {#each Array.from(Array(4)) as t}
                            <img
                                src={faker.image.avatar()}
                                alt="s"
                                class="h-6 w-6 rounded-full -ml-3 ring-2 ring-neutral-900"
                            />
                        {/each}
                        <div
                            class="h-6 w-6 rounded-full -ml-3 ring-2 ring-indigo-800 bg-neutral-900 flex justify-center items-center text-[9px] font-extrabold text-white"
                        >
                            +23
                        </div>
                    </div>
                    <div
                        class="flex-grow flex ml-auto justify-end items-center gap-1 lg:gap-4"
                    >
                        <ShareButton pmMarket={market} {updateMarket} />
                        <CommentButton pmMarket={market} />
                        <LikeButton pmMarket={market} {updateMarket} />
                        <button
                            class="flex items-center justify-center rounded-lg text-sm gap-1 py-1.5 px-2.5 ring-1 ring-transparent shadow-lg bg-neutral-900 text-indigo-400/80 hover:text-indigo-300 hover:ring-indigo-800 hover:shadow-indigo-500/10"
                        >
                            <IconTrade size={16} />
                            Trade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </a>
</div>
