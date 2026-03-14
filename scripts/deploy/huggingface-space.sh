#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command git

require_env HF_USERNAME
require_env HF_SPACE_NAME
require_env HF_TOKEN

SPACE_TITLE="${HF_SPACE_TITLE:-The Trojan Horse Approach Demo}"
BUNDLE_DIR="$("${ROOT_DIR}/scripts/deploy/prepare-demo-bundle.sh" "${ROOT_DIR}/.deploy/hf-space")"
README_FILE="${BUNDLE_DIR}/README.md"

sed "s/__SPACE_TITLE__/${SPACE_TITLE}/g" \
  "${ROOT_DIR}/deploy/demo-container/space-readme.template.md" > "${README_FILE}"

info "initializing temporary Space repository"
git -C "${BUNDLE_DIR}" init -b main >/dev/null
git -C "${BUNDLE_DIR}" config user.name "Codex Deploy"
git -C "${BUNDLE_DIR}" config user.email "codex@example.com"
git -C "${BUNDLE_DIR}" add .
git -C "${BUNDLE_DIR}" commit -m "deploy: update Hugging Face Space bundle" >/dev/null
git -C "${BUNDLE_DIR}" remote add origin "https://${HF_USERNAME}:${HF_TOKEN}@huggingface.co/spaces/${HF_USERNAME}/${HF_SPACE_NAME}"

info "pushing bundle to Hugging Face Space ${HF_USERNAME}/${HF_SPACE_NAME}"
git -C "${BUNDLE_DIR}" push --force origin main

info "done"

