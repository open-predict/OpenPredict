<script lang="ts">
    import type { PublicKey } from "@solana/web3.js";
    import ProfileButton from "./profile_button.svelte";
    import type { TUser } from "@am/backend/types/user";
    import type { marketUserChaindata } from "@am/backend/types/market";
    import { USDC_PER_DOLLAR } from "$lib/utils/op";

    export let publicKey: string;
    export let profile: undefined | TUser = undefined;
    export let marketUserChaindata: marketUserChaindata;
</script>

<div class="flex p-8 justify-between">
    <ProfileButton {publicKey} {profile} />
    <p class={`text-base`}>
        {Math.abs(Number(marketUserChaindata.Shares) / USDC_PER_DOLLAR).toFixed(2)}
        <span
            class={Number(marketUserChaindata.Shares) / USDC_PER_DOLLAR > 0
                ? "text-green-500"
                : "text-red-500"}
        >
            {Number(marketUserChaindata.Shares) / USDC_PER_DOLLAR > 0 ? "YES" : "NO"}
        </span>
    </p>
</div>
