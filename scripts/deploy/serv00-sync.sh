#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command rsync
require_env SERV00_HOST
require_env SERV00_USER

REMOTE_ROOT="${SERV00_REMOTE_ROOT:-/usr/home/${SERV00_USER}/trojan-horse}"

info "syncing repository subset to serv00:${REMOTE_ROOT}"
rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'target' \
  "${ROOT_DIR}/services/core-api/" "${SERV00_USER}@${SERV00_HOST}:${REMOTE_ROOT}/services/core-api/"

rsync -az --delete \
  --exclude 'target' \
  "${ROOT_DIR}/services/vault/" "${SERV00_USER}@${SERV00_HOST}:${REMOTE_ROOT}/services/vault/"

rsync -az \
  "${ROOT_DIR}/.env.example" \
  "${SERV00_USER}@${SERV00_HOST}:${REMOTE_ROOT}/"

info "done"
info "Next steps: reserve TCP ports, enable Binexec, and proxy the public domain to the reserved application port."
