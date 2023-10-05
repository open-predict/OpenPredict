import { searchMarkets, type TMarketWrapper } from '$lib/api';
import { superjson } from '$lib/superjson';

export type TPageData = TMarketWrapper[]

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
  return superjson.serialize(data);
}