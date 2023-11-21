<div class="w-full max-w-full p-4 flex flex-col gap-4">
    <div class="flex justify-start items-start">
        <h2
            class="text-2xl font-semibold flex-grow group-visited/link:text-indigo-300"
        >
            <slot name="title" />
        </h2>
    </div>
    <div class="w-full flex items-center flex-nowrap gap-2">
        <div class="relative w-9/10 max-w-9/10 grow overflow-hidden">
            <div
                class="absolute h-full w-20 bg-gradient-to-r from-transparent to-white dark:to-black right-0"
            />
            <div
                class="w-full flex justify-start gap-2 items-center overflow-x-scroll scrollbar_hide pr-20"
            >
                <slot name="pills" />
                <div class="ml-auto" />
            </div>
        </div>
    </div>
    <div
        class="flex flex-col h-[20.7rem] mb-4 rounded-xl overflow-hidden border bg-neutral-50 border-neutral-200 dark:bg-neutral-950 dark:border-neutral-900 dark:border-0"
    >
        <slot name="interactive" />
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <div class="flex justify-between items-center">
            <h4 class="text-xl font-semibold">Trade</h4>
        </div>
        <div
            class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
        />
        <slot name="trade" />
    </div>
    {#if $$slots["positions"]}
        <div class="flex flex-col gap-2 mb-8">
            <div class="flex justify-between items-center">
                <h4 class="text-xl font-semibold">Your position</h4>
            </div>
            <div
                class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
            />
            <slot name="positions" />
        </div>
    {/if}
    <div class={`flex flex-col gap-2 mb-8`}>
        <h4 class="text-xl font-semibold">Description</h4>
        <div
            class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
        />
        <p
            class="w-full font-normal leading-relaxed break-words overflow-hidden whitespace-pre-wrap"
        >
            <slot name="about" />
        </p>
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <h4 class="text-xl font-semibold">Resolution</h4>
        <div
            class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
        />
        <slot name="resolution" />
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <div class="flex justify-between items-end">
            <h4 class="text-xl font-semibold">Holders</h4>
        </div>
        <div
            class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
        />
        <slot name="holders" />
    </div>
    <div class="flex flex-col gap-2 mb-8">
        <div class="flex justify-between items-end">
            <h4 class="text-xl font-semibold">Comments</h4>
        </div>
        <div
            class="w-full border-t mb-2 border-neutral-200 dark:border-neutral-900"
        />
        <slot name="comments" />
    </div>
</div>
