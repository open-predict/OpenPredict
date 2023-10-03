import { web3StoreLsKey } from '$lib/web3Store.js';
import { PublicKey } from '@solana/web3.js';

export async function load({ params, cookies }) {
    let publicKey: string | undefined = params.profile_id;
    if (!params.profile_id) {
        let web3Store = cookies.get(web3StoreLsKey);
        if (web3Store) {
            try {
                const parsed = JSON.parse(web3Store);
                if (parsed['publicKey']) {
                    publicKey = new PublicKey(parsed['publicKey']).toBase58()
                }
            } catch (e) {
                console.error(e)
            }
        }
    }
    return {
        publicKey
    }
}