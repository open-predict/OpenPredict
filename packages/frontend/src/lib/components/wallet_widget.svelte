<script lang="ts">
    import { web3Store } from "$lib/web3Store";
    import { Modal, modalStore } from "$lib/modals/modalStore";
    import {
        IconBell,
        IconNotification,
        IconPlus,
        IconTriangleFilled,
    } from "@tabler/icons-svelte";
    import { usd } from "$lib/utils/format";

    $: funds = ($web3Store?.solanaUsdc?.balances.USDC?.ui ?? 0) + ($web3Store?.polymarket?.balances.USDC?.ui ?? 0) + ($web3Store?.polygon?.balances.USDC?.ui ?? 0);
</script>

<!-- {#if $web3Store?.solanaAddress} -->

<a
    href="/profile#positions"
    class="h-full px-2 flex flex-col justify-center items-start text-neutral-300 hover:text-white hover:bg-neutral-900"
>
    <p class="text-[10px] font-semibold text-neutral-500">Positions</p>
    <div class="flex flex-nowrap justify-center items-center gap-2">
        <p class="text-xs font-medium">
            <!-- {usd.format(Number($web3Store ?? 0))} -->
        </p>
        <!-- <IconTriangleFilled size={8} class="rotate-180" /> -->
    </div>
</a>
<a
    href="/profile#orders"
    class="h-full px-2 flex flex-col justify-center items-start text-neutral-300 hover:text-white hover:bg-neutral-900"
>
    <p class="text-[10px] font-semibold text-neutral-500">Orders</p>
    <div class="flex flex-nowrap justify-center items-center gap-2">
        <p class="text-xs font-medium">
            {usd.format(Number($web3Store?.solanaUsdc?.balances.USDC ?? 0))}
        </p>
        <!-- <IconTriangleFilled size={8} class="rotate-180" /> -->
    </div>
</a>
<a
    href="/profile#funds"
    class="h-full px-2 flex flex-col justify-center items-start text-neutral-300 hover:text-white hover:bg-neutral-900"
>
    <p class="text-[10px] font-semibold text-neutral-500">Funds</p>
    <div class="flex flex-nowrap justify-center items-center gap-2">
        <p class="text-xs font-medium">
            {usd.format(funds)}
        </p>
        <!-- <IconTriangleFilled size={8} class="rotate-180" /> -->
    </div>
</a>
<!-- {/if} -->
