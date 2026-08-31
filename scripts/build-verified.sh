#!/usr/bin/env bash
set -euo pipefail
bash scripts/sites-env.sh -- npx tsc --noEmit
bash scripts/sites-env.sh -- npx next build
bash scripts/sites-env.sh -- npx vinext build
