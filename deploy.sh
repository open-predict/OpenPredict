#!/bin/bash

rpcUrl="http://127.0.0.1:8899"
feePayerAddress=""
feePayerKey=""
tokenProgramId="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
tokenAccount=""
mint=""
mainProgramId=""
redeploy=true

splTokenAccountsOutput=$(spl-token accounts --output json)
echo $splTokenAccountsOutput
accounts=$(echo $splTokenAccountsOutput | jq -r '.accounts')
numAccounts=$(jq -r '.accounts | length' <<< "$splTokenAccountsOutput")

if [ $numAccounts -gt 0 ]; then
    tokenAccount=$(echo $accounts | jq -r '.[0].address')
    mint=$(echo $accounts | jq -r '.[0].mint')
    redeploy=false
    echo " > found existing custom tokens (usdc), not redeploying"
fi

setFeePayerFromFile() {
    if [ -f "fee_payer.json" ]; then
        feePayerKey=$(cat "fee_payer.json")
        feePayerAddress=$(solana address --keypair ./fee_payer.json)
        lamports=$(solana balance --keypair ./fee_payer.json --output json | jq -r '.lamports')
        if [ "$lamports" -le 0 ]; then
            solana airdrop --keypair ./fee_payer.json 1
        fi
        feePayerSOL=$(solana balance --keypair ./fee_payer.json)
        return 0
    fi
    return 1
}

if ! setFeePayerFromFile; then
    solana-keygen new --no-bip39-passphrase -o ./fee_payer.json
    if ! setFeePayerFromFile; then
        echo " > unable to create and save local fee payer keypair"
        exit 1
    fi
fi

if $redeploy; then
    createTokenOutput=$(spl-token create-token --decimals 6 --output json)
    mint=$(echo $createTokenOutput | jq -r '.commandOutput.address')

    createTokenAccountOuput=$(spl-token create-account $mint)
    tokenAccount=$(echo $createTokenAccountOuput | grep "Creating account" | awk '{print $3}')

    spl-token mint $mint 10000000000
    spl-token transfer $mint 10000000000 $feePayerAddress  
    feePayerUSDC=$(spl-token balance --owner $feePayerAddress)
fi


if $redeploy; then
    FEE_PAYER_KEY=$feePayerAddress USDC_MINT_AUTH_ADDR=$mint cargo build-sbf --manifest-path ./packages/backend/contracts/Cargo.toml
    deployOutput=$(solana program deploy ./packages/backend/contracts/target/deploy/openpredict.so -u $rpcUrl --output json)
    mainProgramId=$(echo $deployOutput | jq -r '.programId')
else
    programShowOutput=$(solana program show --programs --output json)
    mainProgramId=$(echo $programShowOutput | jq -r '.programs[0].programId')
fi

echo " > Fee Payer: $feePayerAddress"
echo " > Fee Payer SOL: $feePayerSOL"
echo " > Fee Payer USDC: $feePayerUSDC"
echo " > USDC Mint: $mint"
echo " > OP Program Id: $mainProgramId"
