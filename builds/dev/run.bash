#!/usr/bin/env bash

solana-test-validator &>/dev/null &

if [[ $1 == "frontend" ]]; then
	cd ../../packages/backend/
	pnpm start &>/dev/null &
	cd ../frontend/
	pnpm dev &
elif [[ $1 == "backend" ]]; then
	cd ../../packages/frontend/
	pnpm dev &>/dev/null &
	cd ../backend/
	pnpm start &
else
	echo "Need to specify frontend or backend (for output)"
	kill $(jobs -p)
	exit
fi

trap "kill $(jobs -p | xargs)" EXIT
wait -f
