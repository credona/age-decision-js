#!/bin/sh
set -e

node scripts/metadata/sync-metadata.mjs
node scripts/integration/update-compose-integration.mjs

npm run docs:generate
npx prettier --write .

node scripts/metadata/check-project-metadata.mjs
node scripts/metadata/check-compatibility-metadata.mjs
node scripts/metadata/check-release-metadata.mjs

npm run build
npm run test
npm run pack:check

echo "Release preparation passed."
