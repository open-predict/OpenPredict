import type { AppRouter } from "@am/backend/server/routers/_app"
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import {
  PUBLIC_INTERNAL_TRPC_URL,
} from "$env/static/public";
import { superjson } from "./superjson";

export const btrpc = createTRPCProxyClient<AppRouter>({
  // transformer,
  transformer: superjson,
  links: [
    httpBatchLink({
      url: PUBLIC_INTERNAL_TRPC_URL,
      fetch(url, options) {
        //No headers
        return fetch(url, {
          body: options != null ? options.body : undefined,
          method: options != null ? options.method : undefined,
          signal: options != null ? options.signal : undefined,
          credentials: 'include',
        });
      },
    }),
  ],
});
