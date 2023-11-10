#!/usr/bin/env bash
set -m
mkdir -p ./test-accounts
mkdir -p ./secrets

filenames=("./secrets/polygon_rpc_url" "./secrets/web3auth_id")

for filename in "${filenames[@]}"; do
    if [[ ! -e $filename ]]; then
        echo "Please enter the contents of $filename:"
        read file_contents

        echo "$file_contents" > "$filename"
    fi
done

POLYGON_RPC_URL=$(cat ./secrets/polygon_rpc_url)
WEB3AUTH_ID=$(cat ./secrets/web3auth_id)

# Make MEILI_MASTER_KEY if not exists
[ -f ./secrets/meili_master_key ] || openssl rand -hex 16 > ./secrets/meili_master_key
MEILI_MASTER_KEY=$(cat ./secrets/meili_master_key)

# Make DB_PASSWORD if not exists
[ -f ./secrets/db_password ] || openssl rand -hex 16 > ./secrets/db_password
DB_PASSWORD=$(cat ./secrets/db_password)
DB_USER=admin
DB_NAME=openpredict

# Make fee payer if not exists
[ -f ./secrets/fee_payer.json ] || solana-keygen new -s --no-bip39-passphrase -o ./secrets/fee_payer.json
FEE_PAYER_PUBKEY="$(solana-keygen pubkey ./secrets/fee_payer.json)"
[ -f ./test-accounts/fee_payer.json ] || (solana airdrop --keypair ./secrets/fee_payer.json 300 -u localhost && solana account $FEE_PAYER_PUBKEY --output-file ./test-accounts/fee_payer.json --output json -u localhost)

# Create mint address if not exists
if [[ -f ./test-accounts/usdc_mint.json ]]; then
  USDC_MINT_AUTH_ADDR=$(jq -r .pubkey ./test-accounts/usdc_mint.json)
else
  USDC_MINT_AUTH_ADDR=$(spl-token create-token --output json -u localhost | jq .commandOutput.address -r)
  solana account $USDC_MINT_AUTH_ADDR --output-file ./test-accounts/usdc_mint.json --output json -u localhost
fi

# Deploy program if not exists
cd ./packages/backend/contracts/
RUST_BACKTRACE=1 FEE_PAYER_KEY=$FEE_PAYER_PUBKEY USDC_MINT_AUTH_ADDR=$USDC_MINT_AUTH_ADDR cargo --quiet build-sbf
[ -f ./target/deploy/openpredict-keypair.json ] || solana-keygen new --no-bip39-passphrase -o ./target/deploy/openpredict-keypair.json
deployOutput=$(solana program deploy ./target/deploy/openpredict.so -u localhost --output json)
MAIN_PROGRAM_ID=$(echo $deployOutput | jq -r '.programId')
cd ../../../

echo "FEE_PAYER_PUBKEY=${FEE_PAYER_PUBKEY}
FEE_PAYER_PRIVKEY=$(cat ./secrets/fee_payer.json)
MAIN_PROGRAM_ID=${MAIN_PROGRAM_ID}
USDC_MINT_ADDRESS=${USDC_MINT_AUTH_ADDR}
MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
POLYGON_RPC_URL=${POLYGON_RPC_URL}
WEB3AUTH_ID=${WEB3AUTH_ID}
SOLANA_RPC_URL=http://testvalidator:8899"
