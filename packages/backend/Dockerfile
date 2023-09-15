# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY node_module[s] ./node_modules

WORKDIR /app/packages/backend
COPY packages/backend/package.json ./
COPY packages/backend/node_module[s] ./node_modules

RUN pnpm install

COPY packages/backend/prisma/ ./prisma
ENV PRISMA_BINARIES_MIRROR http://prisma-builds.s3-eu-west-1.amazonaws.com
RUN pnpx prisma generate

COPY packages/backend ./

RUN ls -la

# Set the command to run the built application
CMD ["/app/packages/backend/start.sh"]
