#!/bin/sh
set -e

docker compose -f docker-compose.dev.yml exec -T age-decision-js scripts/ci/fix_all.sh
