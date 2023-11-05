import { browser, dev } from "$app/environment";

export const api = browser
    ? (await import("$lib/trpc.js")).trpc
    : (await import("$lib/btrpc.js")).btrpc