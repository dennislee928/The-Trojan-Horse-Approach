#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  if [[ -n "${VAULT_PID:-}" ]]; then
    kill "${VAULT_PID}" >/dev/null 2>&1 || true
  fi

  if [[ -n "${CORE_PID:-}" ]]; then
    kill "${CORE_PID}" >/dev/null 2>&1 || true
  fi

  if [[ -n "${WEB_PID:-}" ]]; then
    kill "${WEB_PID}" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

(
  cd "${ROOT_DIR}/services/vault"
  cargo run
) &
VAULT_PID=$!

(
  cd "${ROOT_DIR}/services/core-api"
  go run .
) &
CORE_PID=$!

(
  cd "${ROOT_DIR}"
  npm run dev
) &
WEB_PID=$!

wait

