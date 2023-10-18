import { browser, dev } from "$app/environment";
import { PUBLIC_FAKE_API } from "$env/static/public";

export const api = (dev && !!PUBLIC_FAKE_API)
    ? (await (import('$lib/fake_api/trpc'))).trpc
    : browser
        ? (await import("$lib/trpc.js")).trpc
        : (await import("$lib/btrpc.js")).trpc