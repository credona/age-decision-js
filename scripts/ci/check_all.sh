#!/bin/sh
set -e

echo "Checking metadata..."
node scripts/metadata/check-project-metadata.mjs
node scripts/metadata/check-compatibility-metadata.mjs

echo "Checking generated docs and formatting..."
TMP_DIR="$(mktemp -d)"
cp README.md "$TMP_DIR/README.md"
cp CONTRIBUTING.md "$TMP_DIR/CONTRIBUTING.md"
cp compatibility.json "$TMP_DIR/compatibility.json"
cp package.json "$TMP_DIR/package.json"
mkdir -p "$TMP_DIR/docs"
cp docs/usage.md "$TMP_DIR/docs/usage.md"
cp docs/types.md "$TMP_DIR/docs/types.md"
cp docs/compatibility.md "$TMP_DIR/docs/compatibility.md"

npm run docs:generate
node scripts/integration/update-compose-integration.mjs
npx prettier --write README.md CONTRIBUTING.md compatibility.json package.json docs/usage.md docs/types.md docs/compatibility.md

cmp -s README.md "$TMP_DIR/README.md" || { echo "Generated file is outdated: README.md"; exit 1; }
cmp -s CONTRIBUTING.md "$TMP_DIR/CONTRIBUTING.md" || { echo "Generated file is outdated: CONTRIBUTING.md"; exit 1; }
cmp -s compatibility.json "$TMP_DIR/compatibility.json" || { echo "Generated file is outdated: compatibility.json"; exit 1; }
cmp -s package.json "$TMP_DIR/package.json" || { echo "Generated file is outdated: package.json"; exit 1; }
cmp -s docs/usage.md "$TMP_DIR/docs/usage.md" || { echo "Generated file is outdated: docs/usage.md"; exit 1; }
cmp -s docs/types.md "$TMP_DIR/docs/types.md" || { echo "Generated file is outdated: docs/types.md"; exit 1; }
cmp -s docs/compatibility.md "$TMP_DIR/docs/compatibility.md" || { echo "Generated file is outdated: docs/compatibility.md"; exit 1; }

rm -rf "$TMP_DIR"

echo "Checking formatting..."
npx prettier --check .

echo "Checking TypeScript build..."
npm run build

echo "Running tests..."
npm test

echo "All checks passed."
