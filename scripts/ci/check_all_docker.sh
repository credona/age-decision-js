#!/bin/sh
set -e

docker compose -f docker-compose.dev.yml exec age-decision-js scripts/ci/check_all.sh
