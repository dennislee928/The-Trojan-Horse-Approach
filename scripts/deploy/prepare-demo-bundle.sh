#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command rsync

BUNDLE_DIR="${1:-${ROOT_DIR}/.deploy/demo-bundle}"

info "preparing demo bundle at ${BUNDLE_DIR}"
rm -rf "${BUNDLE_DIR}"
mkdir -p "${BUNDLE_DIR}"

cp "${ROOT_DIR}/package.json" "${ROOT_DIR}/package-lock.json" "${ROOT_DIR}/.env.example" "${BUNDLE_DIR}/"

mkdir -p "${BUNDLE_DIR}/apps" "${BUNDLE_DIR}/services" "${BUNDLE_DIR}/deploy"

rsync -a --delete \
  --exclude '.next' \
  --exclude 'node_modules' \
  "${ROOT_DIR}/apps/web/" "${BUNDLE_DIR}/apps/web/"

rsync -a --delete \
  "${ROOT_DIR}/services/core-api/" "${BUNDLE_DIR}/services/core-api/"

rsync -a --delete \
  --exclude 'target' \
  "${ROOT_DIR}/services/vault/" "${BUNDLE_DIR}/services/vault/"

rsync -a --delete \
  "${ROOT_DIR}/deploy/demo-container/" "${BUNDLE_DIR}/deploy/demo-container/"

cp "${BUNDLE_DIR}/deploy/demo-container/Dockerfile" "${BUNDLE_DIR}/Dockerfile"

info "demo bundle ready"
printf '%s\n' "${BUNDLE_DIR}"

