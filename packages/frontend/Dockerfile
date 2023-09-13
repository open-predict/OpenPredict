# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

WORKDIR /app/packages/frontend

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
