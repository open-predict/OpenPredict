import { gql } from '@graphql-mesh/utils';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';
import GraphqlHandler from "@graphql-mesh/graphql";
import UsePollingLive from "@graphprotocol/client-polling-live";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import * as importedModule$0 from "./sources/polymarket/introspectionSchema.js";
import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');
const importFn = (moduleId) => {
    const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
    switch (relativeModuleId) {
        case ".graphclient/sources/polymarket/introspectionSchema.js":
            return Promise.resolve(importedModule$0);
        default:
            return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
    }
};
const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "js",
}), {
    readonly: true,
    validate: false
});
export const rawServeConfig = undefined;
export async function getMeshOptions() {
    const pubsub = new PubSub();
    const sourcesStore = rootStore.child('sources');
    const logger = new DefaultLogger("GraphClient");
    const cache = new MeshCache({
        ...{},
        importFn,
        store: rootStore.child('cache'),
        pubsub,
        logger,
    });
    const sources = [];
    const transforms = [];
    const additionalEnvelopPlugins = [];
    const polymarketTransforms = [];
    const additionalTypeDefs = [];
    const polymarketHandler = new GraphqlHandler({
        name: "polymarket",
        config: { "endpoint": "https://goldsky.openpredict.org/c/polymarket/gn/subgraphs/name/2f21c18c" },
        baseDir,
        cache,
        pubsub,
        store: sourcesStore.child("polymarket"),
        logger: logger.child("polymarket"),
        importFn,
    });
    sources[0] = {
        name: 'polymarket',
        handler: polymarketHandler,
        transforms: polymarketTransforms
    };
    additionalEnvelopPlugins[0] = await UsePollingLive({
        ...({
            "defaultInterval": 5000
        }),
        logger: logger.child("pollingLive"),
        cache,
        pubsub,
        baseDir,
        importFn,
    });
    const additionalResolvers = [];
    const merger = new BareMerger({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
    });
    return {
        sources,
        transforms,
        additionalTypeDefs,
        additionalResolvers,
        cache,
        pubsub,
        merger,
        logger,
        additionalEnvelopPlugins,
        get documents() {
            return [
                {
                    document: AllFilledOrdersDocument,
                    get rawSDL() {
                        return printWithCache(AllFilledOrdersDocument);
                    },
                    location: 'AllFilledOrdersDocument.graphql'
                }, {
                    document: TrackFilledOrdersDocument,
                    get rawSDL() {
                        return printWithCache(TrackFilledOrdersDocument);
                    },
                    location: 'TrackFilledOrdersDocument.graphql'
                }, {
                    document: AllMarketPositionsDocument,
                    get rawSDL() {
                        return printWithCache(AllMarketPositionsDocument);
                    },
                    location: 'AllMarketPositionsDocument.graphql'
                }, {
                    document: TrackMarketPositionsDocument,
                    get rawSDL() {
                        return printWithCache(TrackMarketPositionsDocument);
                    },
                    location: 'TrackMarketPositionsDocument.graphql'
                }
            ];
        },
        fetchFn,
    };
}
export function createBuiltMeshHTTPHandler() {
    return createMeshHTTPHandler({
        baseDir,
        getBuiltMesh: getBuiltGraphClient,
        rawServeConfig: undefined,
    });
}
let meshInstance$;
export function getBuiltGraphClient() {
    if (meshInstance$ == null) {
        meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
            const id = mesh.pubsub.subscribe('destroy', () => {
                meshInstance$ = undefined;
                mesh.pubsub.unsubscribe(id);
            });
            return mesh;
        });
    }
    return meshInstance$;
}
export const execute = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));
export const subscribe = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK(globalContext) {
    const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
    return getSdk((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export const AllFilledOrdersDocument = gql `
    query AllFilledOrders($market_ids: [ID!]) {
  filledOrders(where: {market_: {id_in: $market_ids}}) {
    timestamp
    maker {
      id
    }
    price
    side
    size
    taker {
      id
    }
    market {
      id
    }
  }
}
    `;
export const TrackFilledOrdersDocument = gql `
    query TrackFilledOrders($market_ids: [ID!]) {
  filledOrders(
    where: {market_: {id_in: $market_ids}}
    first: 5
    orderDirection: desc
    orderBy: timestamp
  ) {
    id
    timestamp
    maker {
      id
    }
    price
    side
    size
    taker {
      id
    }
    market {
      id
    }
  }
}
    `;
export const AllMarketPositionsDocument = gql `
    query AllMarketPositions($market_ids: [ID!]) {
  marketPositions(where: {market_: {id_in: $market_ids}}) {
    outcomeIndex
    netQuantity
    netValue
    market {
      id
    }
    user {
      id
    }
  }
}
    `;
export const TrackMarketPositionsDocument = gql `
    query TrackMarketPositions($market_ids: [ID!]) {
  marketPositions(where: {market_: {id_in: $market_ids}}) {
    outcomeIndex
    netQuantity
    netValue
    market {
      id
    }
    user {
      id
    }
  }
}
    `;
export function getSdk(requester) {
    return {
        AllFilledOrders(variables, options) {
            return requester(AllFilledOrdersDocument, variables, options);
        },
        TrackFilledOrders(variables, options) {
            return requester(TrackFilledOrdersDocument, variables, options);
        },
        AllMarketPositions(variables, options) {
            return requester(AllMarketPositionsDocument, variables, options);
        },
        TrackMarketPositions(variables, options) {
            return requester(TrackMarketPositionsDocument, variables, options);
        }
    };
}
