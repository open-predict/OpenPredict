<script lang="ts">
  import "../app.postcss";
  import Web3Provider from "$lib/Web3Provider.svelte";
  import LoginModal from "$lib/modals/login.svelte";
  import SearchMarkets from "$lib/modals/search_markets.svelte";
  import BackendAuth from "$lib/modals/backend_auth.svelte";
  import AccountSummary from "$lib/modals/account_summary.svelte";
  import { Buffer } from "buffer";
  import { browser } from "$app/environment";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import "nprogress/nprogress.css";
  import "@fontsource-variable/open-sans";
  import "@fontsource-variable/inter";
  import ToastsProvider from "$lib/toasts/toastsProvider.svelte";

  NProgress.configure({
    minimum: 0.16,
    showSpinner: false,
  });

  $: {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  }

  // for the ported polyclob lib
  globalThis.Buffer = Buffer;
  if (browser) {
    window.Buffer = Buffer;
    window.global = window;
  }

</script>

<Web3Provider />
<ToastsProvider />

<slot />

<!-- Global modals -->
<LoginModal />
<BackendAuth />
<SearchMarkets />
<AccountSummary />
