#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

require_command koyeb
require_env KOYEB_APP_NAME
require_env KOYEB_DOMAIN

if [[ "${KOYEB_DOMAIN}" != *.* ]]; then
  fail "KOYEB_DOMAIN must look like a fully-qualified domain name"
fi

if ! koyeb domains get "${KOYEB_DOMAIN}" >/dev/null 2>&1; then
  info "creating custom domain ${KOYEB_DOMAIN} and attaching it to ${KOYEB_APP_NAME}"
  koyeb domains create "${KOYEB_DOMAIN}" --attach-to "${KOYEB_APP_NAME}"
else
  info "custom domain ${KOYEB_DOMAIN} already exists"
fi

if [[ "${KOYEB_DOMAIN_REFRESH:-0}" == "1" ]]; then
  info "refreshing custom domain validation for ${KOYEB_DOMAIN}"
  koyeb domains refresh "${KOYEB_DOMAIN}"
fi

info "current domain metadata:"
koyeb domains get "${KOYEB_DOMAIN}" -o json
