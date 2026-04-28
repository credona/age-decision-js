#!/bin/sh
set -e

npm run docs:generate
npm run check:metadata
npm run check:release
npm run build
npm run test
npm run pack:check

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git diff --exit-code
else
  echo "Skipping git diff (not a git repository)"
fi

echo "Release preparation passed."
