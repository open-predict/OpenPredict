import type {AppRouter} from "@am/backend/server/routers/_app"
import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';
import superjson from "superjson"
import {Buffer} from "buffer"
import {env} from "$env/dynamic/private";

console.log(env.INTERNAL_TRPC_URL)

superjson.registerCustom<Buffer, number[]>(
  {
    isApplicable: (v): v is Buffer => v instanceof Buffer,
    serialize: v => [...v],
    deserialize: v => Buffer.from(v)
  },
  "buffer"
);

export const btrpc = createTRPCProxyClient<AppRouter>({
  // transformer,
  transformer: superjson,
  links: [
    httpBatchLink({
      url: env.INTERNAL_TRPC_URL,
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
