import type {AppRouter} from "@am/backend/server/routers/_app"
import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';
import {PUBLIC_TRPC_URL} from "$env/static/public";
import { superjson } from "./superjson";

export const trpc = createTRPCProxyClient<AppRouter>({
  // transformer,
  transformer: superjson,
  links: [
    httpBatchLink({
      url: PUBLIC_TRPC_URL,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
