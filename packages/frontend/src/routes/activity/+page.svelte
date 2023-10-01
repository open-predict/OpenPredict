<script lang="ts">
    import ColumnLayout from "$lib/components/column_layout.svelte";

    const rotations = Array.from(new Array(10)).map(() =>
        (Math.random() * 360).toFixed()
    );
</script>

<ColumnLayout>
    <div
        slot="main-header"
        class="w-full h-full flex items-center justify-start px-5 gap-3 text-stone-500 text-sm"
    >
        Your recent activity
    </div>
    <div slot="main" class="flex flex-col divide-y divide-gray-200 p-10">
        <div
            class="relative h-60 w-60 flex justify-center items-center overflow-hidden rounded-full"
        >
            {#each rotations as ra}
                <div
                    class={`blob absolute bg-black/20 w-40 h-40 text-xs border-none`}
                    style={`transform:rotate(${ra}deg)`}
                >
                </div>
            {/each}
            <div class={`absolute flex justify-center items-center text-3xl text-white font-bold`}>
                {"90%"}
            </div>
        </div>
    </div>
    <div slot="right" />
</ColumnLayout>

<style>
    .blob {
        border-radius: 42% 58% 70% 30% / 30% 40% 60% 70%;
    }
</style>
