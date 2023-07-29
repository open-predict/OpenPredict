import type { AppRouter } from "@am/backend/server/routers/_app"
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from "superjson"
import { Buffer } from "buffer"
import { PUBLIC_TRPC_URL } from "$env/static/public";

superjson.registerCustom<Buffer, number[]>(
	{
		isApplicable: (v): v is Buffer => v instanceof Buffer,
		serialize: v => [...v],
		deserialize: v => Buffer.from(v)
	},
	"buffer"
);

export const trpcc = createTRPCProxyClient<AppRouter>({
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
