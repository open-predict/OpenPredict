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
      "term": "musk",
    })
  } catch (e) {
    console.error(e)
    data.error = e;
  }

  return superjson.serialize(data);
}