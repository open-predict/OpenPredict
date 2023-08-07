<script lang="ts">
  import "../app.postcss";
  import { onMount } from "svelte";
  import WalletProvider from "$lib/wallets/WalletProvider.svelte";
  import type { Adapter } from "@solana/wallet-adapter-base";
  import Web3Provider from "$lib/Web3Provider.svelte";
  import LoginModal from "$lib/modals/login.svelte";
  import SwapModal from "$lib/modals/swap.svelte";
  import LowSolModal from "$lib/modals/low_sol.svelte";
  import SearchMarkets from "$lib/modals/search_markets.svelte";
  import BackendAuth from "$lib/modals/backend_auth.svelte";
  import SendFunds from "$lib/modals/send_funds.svelte";
  import AccountSummary from "$lib/modals/account_summary.svelte";
  import { Buffer } from "buffer";
  import process from "process";
  import { browser } from "$app/environment";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import "nprogress/nprogress.css";
  import '@fontsource-variable/open-sans';
  import '@fontsource-variable/inter';

  NProgress.configure({
    minimum: 0.16,
    showSpinner: false    
  });

  $: {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  }

  globalThis.Buffer = Buffer;
  globalThis.process = process;

  if (browser) {
    window.process = process;
    window.Buffer = Buffer;
    window.global = window;
  }

  const localStorageKey = "walletAdapter";
  let wallets: Adapter[];

  onMount(async () => {
    const {
      PhantomWalletAdapter,
      SlopeWalletAdapter,
      SolflareWalletAdapter,
      TorusWalletAdapter,
      CoinbaseWalletAdapter,
      LedgerWalletAdapter,
      HyperPayWalletAdapter,
      BraveWalletAdapter,
    } = await import("@solana/wallet-adapter-wallets");
    const walletsMap = [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new HyperPayWalletAdapter(),
      new BraveWalletAdapter(),
    ];
    wallets = walletsMap;
  });
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<Web3Provider />

<slot />

<!-- Global modals -->
<LoginModal />
<BackendAuth />
<SendFunds />
<SwapModal />
<LowSolModal />
<SearchMarkets />
<AccountSummary />