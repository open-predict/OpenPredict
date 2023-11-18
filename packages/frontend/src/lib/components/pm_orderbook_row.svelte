<script lang="ts">
    import { usd } from "$lib/utils/format";
    import type { TLimitOrderFormatted } from "$lib/utils/pm";
    export let item: TLimitOrderFormatted;
</script>
<div class="relative h-8 grid grid-cols-3">
    <slot name="overlay" />
    <p class="px-4 py-2 flex items-center">
        <slot name="price" />
    </p>
    <p class="px-4 py-2 flex items-center">
        {item.shares.toFixed(0)}
    </p>
    <p class="px-4 py-2 flex items-center">
        {usd.format(item.total)}
</div>