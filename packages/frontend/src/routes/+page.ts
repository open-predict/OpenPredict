import { api } from '$lib/api';
import { superjson } from '$lib/superjson';
import type { AppRouterOutputs } from '@am/backend/server/routers/_app';

export type TPageData = {
  searchResults?: AppRouterOutputs['searchMarkets'],
  error?: any;
}

export const ssr = true;

export async function load() {
  const data: TPageData = {};
  try {
    data.searchResults = await api.searchMarkets.query({
      tradable: true,
      limit: 20,
      orderBy: "volume"
    }).catch(e => {
      console.error("Error searching markets:", e);
      data.error = e;
      return undefined;
    })
  } catch (e) {
    console.error("Error searching markets:", e);
    data.error = e;
  }

  console.log("Empty responses:", data.searchResults?.data.filter(r => !r.opMarket || !r.pmMarket).length)

  return superjson.serialize(data);
}