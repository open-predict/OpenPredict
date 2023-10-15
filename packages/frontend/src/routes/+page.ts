import { searchMarkets } from '$lib/api';
import { superjson } from '$lib/superjson';
import type { MarketSearchResult } from '@am/backend/server/routers/_app';

export type TPageData = MarketSearchResult[]
export const ssr = true;

export async function load() {

  // const trpc = browser
  //   ? (await import("$lib/trpc.js")).trpcc
  //   : (await import("$lib/btrpc.js")).btrpc;

  // try {
  //   data.searchResponse = (await trpc.searchMarkets.query({
  //     term: "",
  //     limit: 10,
  //   }))
  // } catch (err) {
  //   console.log("Couldn't search markets: ", err)
  // }

  const response = await searchMarkets();
  const data: TPageData = response;
  data.sort((a, b) => Number(b.numNativeLikes - a.numNativeLikes))
  return superjson.serialize(data);
}