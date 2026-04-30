#!/bin/sh
set -e

npm run check:all

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git diff --exit-code README.md docs/usage.md docs/types.md docs/compatibility.md compatibility.json package.json project.json package-lock.json CHANGELOG.md
else
  echo "Skipping git diff (not a git repository)"
fi

echo "Local check passed."
