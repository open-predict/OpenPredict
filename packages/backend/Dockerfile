# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

WORKDIR /app/packages/backend

ENV PRISMA_BINARIES_MIRROR http://prisma-builds.s3-eu-west-1.amazonaws.com
RUN pnpx prisma generate

# Set the command to run the built application
CMD ["/app/packages/backend/start.sh"]
