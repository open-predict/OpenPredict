# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY node_module[s] ./node_modules

WORKDIR /app/packages/frontend
COPY packages/frontend/package.json ./
COPY packages/frontend/node_module[s] ./node_modules

RUN pnpm install

COPY packages/frontend ./

ARG PUBLIC_MAGIC_PUBLISHABLE_API_KEY
ENV PUBLIC_MAGIC_PUBLISHABLE_API_KEY=$PUBLIC_MAGIC_PUBLISHABLE_API_KEY
ARG PUBLIC_MAIN_PROGRAM_ID
ENV PUBLIC_MAIN_PROGRAM_ID=$PUBLIC_MAIN_PROGRAM_ID
ARG PUBLIC_USDC_MINT_ADDR
ENV PUBLIC_USDC_MINT_ADDR=$PUBLIC_USDC_MINT_ADDR
ARG PUBLIC_FEE_PAYER_KEY
ENV PUBLIC_FEE_PAYER_KEY=$PUBLIC_FEE_PAYER_KEY
ARG PUBLIC_SOLANA_RPC_URL
ENV PUBLIC_SOLANA_RPC_URL=$PUBLIC_SOLANA_RPC_URL
ARG PUBLIC_TRPC_URL
ENV PUBLIC_TRPC_URL=$PUBLIC_TRPC_URL

RUN pnpm build

CMD ["pnpm", "run", "start"]
