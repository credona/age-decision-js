#!/bin/sh
set -e

npm run check:metadata
npm run docs:generate
npm run build
npm run test
npm run pack:check

echo "CI-equivalent check passed."
