# Use a Node.js base image
FROM solanalabs/solana:stable

RUN apt-get update -y
RUN apt-get install -y jq

# Set the working directory
WORKDIR /validator

WORKDIR /validator/packages/backend/contracts/

COPY packages/backend/contracts/ ./

WORKDIR /validator

CMD solana-test-validator --quiet --accounts-dir=./test-accounts
