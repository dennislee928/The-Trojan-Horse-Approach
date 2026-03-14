#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command rsync
require_env ALWAYSDATA_HOST
require_env ALWAYSDATA_USER

REMOTE_ROOT="${ALWAYSDATA_REMOTE_ROOT:-/home/${ALWAYSDATA_USER}/trojan-horse}"

info "syncing repository subset to alwaysdata:${REMOTE_ROOT}"
rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'target' \
  "${ROOT_DIR}/apps/web/" "${ALWAYSDATA_USER}@${ALWAYSDATA_HOST}:${REMOTE_ROOT}/apps/web/"

rsync -az --delete \
  "${ROOT_DIR}/services/core-api/" "${ALWAYSDATA_USER}@${ALWAYSDATA_HOST}:${REMOTE_ROOT}/services/core-api/"

rsync -az --delete \
  --exclude 'target' \
  "${ROOT_DIR}/services/vault/" "${ALWAYSDATA_USER}@${ALWAYSDATA_HOST}:${REMOTE_ROOT}/services/vault/"

rsync -az \
  "${ROOT_DIR}/package.json" \
  "${ROOT_DIR}/package-lock.json" \
  "${ROOT_DIR}/.env.example" \
  "${ALWAYSDATA_USER}@${ALWAYSDATA_HOST}:${REMOTE_ROOT}/"

info "done"
info "Next steps: create User program sites/services in alwaysdata using the runbook."

