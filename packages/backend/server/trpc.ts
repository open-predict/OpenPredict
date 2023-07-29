import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import * as http from 'http'

superjson.registerCustom<Buffer, number[]>(
	{
		isApplicable: (v): v is Buffer => v instanceof Buffer,
		serialize: v => [...v],
		deserialize: v => Buffer.from(v)
	},
	"buffer"
);

export const createContext = async ({ req, res }: CreateHTTPContextOptions) => {
	var req2: http.IncomingMessage = req;
	var res2: http.ServerResponse = res;
	return {
		req: req2,
		res: res2,
	};
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createContext>().create({
	transformer: superjson,
	// transformer,
})

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export type Context = inferAsyncReturnType<typeof createContext>;
