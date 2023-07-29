<script lang="ts">
    import { generateProfileImage, readablePublicKey } from "$lib/utils";
    import type { TUser, TUserMetadataSchemaV0 } from "@am/backend/types/user";
    import type { PublicKey } from "@solana/web3.js";
    import base58 from "bs58";

    export let small = false;
    export let publicKey: PublicKey;
    export let profile: TUser | undefined | null = undefined;
</script>

<a
    href={`/profile/${publicKey}`}
    class="flex items-center justify-center gap-2.5"
>
    <div
        class={`rounded-full bg-gray-200 overflow-hidden ring-2 ring-gray-200 hover:ring-orange-300 transition-all h-7 w-7`}
    >
        <img src={generateProfileImage(publicKey)} alt="profile" />
    </div>
    {#if !small}
        <span class="text-sm text-gray-600 transition-all hover:underline hover:text-black">
            {profile?.username ?? readablePublicKey(publicKey)}
        </span>
    {/if}
</a>
