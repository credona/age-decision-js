#!/bin/sh
set -e

docker compose -f docker-compose.dev.yml exec age-decision-js scripts/ci/fix_all.sh
