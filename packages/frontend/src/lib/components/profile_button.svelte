<script lang="ts">
    import { generateProfileImage, readableAddress } from "$lib/utils";
    import type { TUser, TUserMetadataSchemaV0 } from "@am/backend/types/user";
    import type { PublicKey } from "@solana/web3.js";
    import base58 from "bs58";

    export let small = false;
    export let publicKey: string;
    export let profile: TUser | undefined | null = undefined;

</script>

<a
    href={`/profile/${publicKey}`}
    class="flex items-center justify-center gap-2.5 group transition-all"
>
    <div
        class={`rounded-full bg-white overflow-hidden ring-2 ring-gray-300 h-6 w-6 p-0.5 group-hover:ring-indigo-400`}
    >
        <img src={generateProfileImage(publicKey)} alt="profile" class="rounded-full" />
    </div>
    {#if !small}
        <span class="text-sm text-gray-600 font-medium group-hover:text-black">
            {profile?.username ?? readableAddress(publicKey)}
        </span>
    {/if}
</a>
