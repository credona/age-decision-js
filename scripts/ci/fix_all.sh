#!/bin/sh
set -e

echo "Sync metadata..."
node scripts/metadata/sync-metadata.mjs

echo "Sync integration compose..."
node scripts/integration/update-compose-integration.mjs

echo "Generate docs..."
npm run docs:generate

echo "Formatting..."
npx prettier --write .

echo "Build..."
npm run build

echo "Fix completed."
