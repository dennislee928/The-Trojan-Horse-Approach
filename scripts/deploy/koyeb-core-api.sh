#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command koyeb

KOYEB_APP_NAME="${KOYEB_APP_NAME:-trojan-horse}"
KOYEB_SERVICE_NAME="${KOYEB_SERVICE_NAME:-core-api}"
KOYEB_GIT_BRANCH="${KOYEB_GIT_BRANCH:-$(default_git_branch)}"
KOYEB_GIT_REPO="${KOYEB_GIT_REPO:-$(default_git_repo || true)}"
KOYEB_REGION="${KOYEB_REGION:-was}"
KOYEB_INSTANCE_TYPE="${KOYEB_INSTANCE_TYPE:-nano}"

[[ -n "${KOYEB_GIT_REPO}" ]] || fail "set KOYEB_GIT_REPO, for example github.com/owner/repo"

if ! koyeb_cli apps describe "${KOYEB_APP_NAME}" >/dev/null 2>&1; then
  info "creating Koyeb app ${KOYEB_APP_NAME}"
  koyeb_cli apps create "${KOYEB_APP_NAME}" >/dev/null
fi

SERVICE_REF="${KOYEB_APP_NAME}/${KOYEB_SERVICE_NAME}"
ENV_ARGS=(--env "CORE_API_PORT=8080")

if [[ -n "${KOYEB_VAULT_API_URL:-}" ]]; then
  ENV_ARGS+=(--env "VAULT_API_URL=${KOYEB_VAULT_API_URL}")
fi

if koyeb_cli services describe "${SERVICE_REF}" >/dev/null 2>&1; then
  info "updating Koyeb service ${SERVICE_REF}"
  koyeb_cli services update "${SERVICE_REF}" \
    --git "${KOYEB_GIT_REPO}" \
    --git-branch "${KOYEB_GIT_BRANCH}" \
    --git-builder docker \
    --git-docker-dockerfile services/core-api/Dockerfile \
    --ports 8080:http \
    --routes "/:8080" \
    --checks 8080:http:/health \
    --regions "${KOYEB_REGION}" \
    --instance-type "${KOYEB_INSTANCE_TYPE}" \
    "${ENV_ARGS[@]}"
else
  info "creating Koyeb service ${SERVICE_REF}"
  koyeb_cli services create "${KOYEB_SERVICE_NAME}" \
    --app "${KOYEB_APP_NAME}" \
    --git "${KOYEB_GIT_REPO}" \
    --git-branch "${KOYEB_GIT_BRANCH}" \
    --git-builder docker \
    --git-docker-dockerfile services/core-api/Dockerfile \
    --ports 8080:http \
    --routes "/:8080" \
    --checks 8080:http:/health \
    --regions "${KOYEB_REGION}" \
    --instance-type "${KOYEB_INSTANCE_TYPE}" \
    "${ENV_ARGS[@]}"
fi

info "done"
