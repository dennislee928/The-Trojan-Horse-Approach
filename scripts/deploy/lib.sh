#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

info() {
  printf '[deploy] %s\n' "$*"
}

fail() {
  printf '[deploy] error: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

require_env() {
  local name="$1"
  [[ -n "${!name:-}" ]] || fail "missing required environment variable: $name"
}

default_git_branch() {
  git -C "${ROOT_DIR}" rev-parse --abbrev-ref HEAD
}

default_git_repo() {
  local remote
  remote="$(git -C "${ROOT_DIR}" remote get-url origin 2>/dev/null || true)"

  if [[ "${remote}" =~ github\.com[:/]([^/]+/[^/.]+)(\.git)?$ ]]; then
    printf 'github.com/%s\n' "${BASH_REMATCH[1]}"
    return 0
  fi

  return 1
}

