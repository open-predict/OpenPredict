<script lang="ts">
  import "../app.postcss";
  import Web3Provider from "$lib/Web3Provider.svelte";
  import LoginModal from "$lib/modals/login.svelte";
  import SearchMarkets from "$lib/modals/search_markets.svelte";
  import BackendAuth from "$lib/modals/backend_auth.svelte";
  // import AccountSummary from "$lib/modals/account_summary.svelte";
  import { Buffer } from "buffer";
  import { browser } from "$app/environment";
  import NProgress from "nprogress";
  // import { navigating } from "$app/stores";
  import "@fontsource-variable/open-sans";
  import "@fontsource-variable/inter";
  import ToastsProvider from "$lib/toasts/toastsProvider.svelte";
  import "$lib/styles/nprogress.css";

  NProgress.configure({
    minimum: 0.16,
    showSpinner: false,
  });

  // $: {
  //   if (browser) {
  //     if ($navigating) {
  //       NProgress.start();
  //     }
  //     if (!$navigating) {
  //       NProgress.done();
  //     }
  //   }
  // }

  // for the ported polyclob lib
  globalThis.Buffer = Buffer;
  if (browser) {
    window.Buffer = Buffer;
    window.global = window;
  }
</script>

<svelte:head>
  <script lang="ts">
    const uiStoreCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme="))
      ?.split("=")[1];
    // const { theme } = superjson.parse<TUiStore>(uiStoreCookie)
    const { theme } = JSON.parse(uiStoreCookie ?? "{}");
    switch (theme) {
      case "dark":
        document.documentElement.classList.add("dark");
        break;

      case "light":
        document.documentElement.classList.remove("dark");
        break;

      default:
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        break;
    }
  </script>
</svelte:head>

<Web3Provider />
<ToastsProvider />

<slot />

<!-- Global modals -->
<LoginModal />
<BackendAuth />
<SearchMarkets />
<!-- <AccountSummary /> -->
