import type {AppRouter} from "@am/backend/server/routers/_app"
import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';
import superjson from "superjson"
import {Buffer} from "buffer"
import {PUBLIC_INTERNAL_TRPC_URL} from "$env/static/public";

superjson.registerCustom<Buffer, number[]>(
  {
    isApplicable: (v): v is Buffer => v instanceof Buffer,
    serialize: v => [...v],
    deserialize: v => Buffer.from(v)
  },
  "buffer"
);

export const btrpcc = createTRPCProxyClient<AppRouter>({
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
