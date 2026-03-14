#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

VAULT_MASTER_KEY_VALUE="${VAULT_MASTER_KEY:-}"

if [[ -z "${VAULT_MASTER_KEY_VALUE}" ]] && command -v openssl >/dev/null 2>&1; then
  VAULT_MASTER_KEY_VALUE="$(openssl rand -hex 32)"
fi

printf '%s\n' \
  "Hugging Face Space demo checklist" \
  "" \
  "Local shell values for ./scripts/deploy/huggingface-space.sh:" \
  "  HF_USERNAME=<your-hf-user>" \
  "  HF_SPACE_NAME=<your-space-name>" \
  "  HF_TOKEN=<hf_token_with_write_access>" \
  "  HF_SPACE_TITLE=<optional-title>" \
  "" \
  "Space Settings > Variables:" \
  "  none required for the current demo image" \
  "" \
  "Space Settings > Secrets:" \
  "  VAULT_MASTER_KEY=${VAULT_MASTER_KEY_VALUE:-<set-a-64-char-hex-string>}" \
  "" \
  "Then run:" \
  "  ./scripts/deploy/huggingface-space.sh"

