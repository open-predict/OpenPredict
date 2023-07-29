#!/usr/bin/env bash
cd ../packages/backend/
npm run start &
cd ../frontend/
npm run start &
wait -n < <(jobs -p)
