import {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "./types/polymarket_schema.graphql",
  documents: ['./amclient/polymarket.ts'],
  generates: {
    './__generated__/': {
      preset: 'client',
    },
  },
};

export default config;
