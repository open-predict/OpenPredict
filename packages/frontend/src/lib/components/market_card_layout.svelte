<script lang="ts">
    export let small = false;
    export let href: string;
</script>

<div
    class={`group w-full max-w-full bg-white dark:bg-neutral-950 ring-inset ${
        small
            ? "rounded-lg ring-1 ring-inset ring-neutral-950 hover:dark:ring-indigo-950"
            : "p-3"
    }`}
>
    <a href={`/${href}`} class="group/link max-w-full">
        <div class="w-full max-w-full py-1.5 lg:p-2 xl:p-4">
            <div class="w-full flex flex-col justify-start items-start gap-4">
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
                            <slot name="pills" />
                        </div>
                    </div>
                    {#if !small}
                        <slot name="header_right" />
                    {/if}
                </div>
                {#if $$slots["extra_content"]}
                    <div
                        class={`w-full ${
                            small ? "h-16 max-h-16" : "h-60 max-h-60"
                        }`}
                    >
                        <slot name="extra_content" />
                    </div>
                {/if}
                <div
                    class="flex w-full align-top gap-4 justify-start items-start flex-nowrap"
                >
                    <h2
                        class={`font-semibold text-white flex-grow group-hover:underline group-visited/link:text-indigo-300 ${
                            small ? "text-sm" : "text-lg lg:text-xl"
                        }`}
                    >
                        <slot name="title" />
                    </h2>
                        <div class="ml-auto flex items-start justify-start">
                            <div
                                class="ml-3 flex flex-col justify-start items-end"
                            >
                                <h2
                                    class={`font-bold text-white ${small ? "text-md" : "text-md lg:text-xl"}`}
                                >
                                    <slot name="chance" />
                                </h2>
                                <slot name="change" />
                            </div>
                        </div>
                </div>
                {#if !small}
                    <div
                        class="w-full flex flex-nowrap justify-start items-center"
                    >
                        <div class="flex flex-nowrap pl-4 p-1">
                            <slot name="bottom_left" />
                        </div>
                        <div
                            class="flex-grow flex ml-auto justify-end items-center gap-1 lg:gap-4"
                        >
                            <slot name="bottom_right" />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </a>
</div>
