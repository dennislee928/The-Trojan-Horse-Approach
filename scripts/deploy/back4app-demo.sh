#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

info "Back4App Containers configuration for this repo:"
printf '%s\n' \
  "  repository: your GitHub fork/repo" \
  "  branch: ${BACK4APP_BRANCH:-$(default_git_branch)}" \
  "  root directory: ." \
  "  dockerfile path: deploy/demo-container/Dockerfile" \
  "  exposed port: 7860" \
  "  required env: VAULT_MASTER_KEY=<64-hex-character key>"
printf '\n'
info "The demo container routes public traffic through Nginx and runs Next.js, Go, and Rust in one container."

