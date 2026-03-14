#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  for pid_var in NGINX_PID WEB_PID CORE_PID VAULT_PID; do
    if [[ -n "${!pid_var:-}" ]]; then
      kill "${!pid_var}" >/dev/null 2>&1 || true
    fi
  done
}

trap cleanup EXIT INT TERM

/app/vault &
VAULT_PID=$!

/app/core-api &
CORE_PID=$!

cd /app/web
node server.js &
WEB_PID=$!

nginx -g "daemon off;" &
NGINX_PID=$!

wait -n "${VAULT_PID}" "${CORE_PID}" "${WEB_PID}" "${NGINX_PID}"

