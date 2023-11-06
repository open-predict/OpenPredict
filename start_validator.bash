#!/usr/bin/env bash
set -m

#Start validator
solana-test-validator --account-dir ./test-accounts >/dev/null &
TEST_VALIDATOR_PID=$!
function clean_up {
    # Perform program exit housekeeping
    KILL $TEST_VALIDATOR_PID
    exit
}
trap clean_up SIGHUP SIGINT SIGTERM

sleep 6

# Make fee payer if not exists
[ -f ./fee_payer.json ] || solana-keygen new --no-bip39-passphrase -o ./fee_payer.json
FEE_PAYER_PUBKEY="$(solana-keygen pubkey ./fee_payer.json)"
[ -f ./test-accounts/fee_payer.json ] || (solana airdrop --keypair ./fee_payer.json 300 -u localhost && solana account $FEE_PAYER_PUBKEY --output-file ./test-accounts/fee_payer.json --output json -u localhost)

# Create mint address if not exists
if [[ -f ./test-accounts/usdc_mint.json ]]; then
  USDC_MINT_AUTH_ADDR=$(jq .pubkey ./test-accounts/usdc_mint.json)
else
  USDC_MINT_AUTH_ADDR=$(spl-token create-token --output json -u localhost | jq .commandOutput.address -r)
  solana account $USDC_MINT_AUTH_ADDR --output-file ./test-accounts/usdc_mint.json --output json -u localhost
fi

# Deploy program if not exists
cd ./packages/backend/contracts/
RUST_BACKTRACE=1 USDC_MINT_AUTH_ADDR=$USDC_MINT_AUTH_ADDR cargo build-sbf
[ -f ./target/deploy/openpredict-keypair.json ] || solana-keygen new --no-bip39-passphrase -o ./target/deploy/openpredict-keypair.json
cd ../../../

echo "Fee payer key: $FEE_PAYER_PUBKEY"
echo "Mint address: $USDC_MINT_AUTH_ADDR"
echo "Validator running and active!"
wait $TEST_VALIDATOR_PID
