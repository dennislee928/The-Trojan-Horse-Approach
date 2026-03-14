# Koyeb core-api runbook

## Goal

Deploy `services/core-api` as the public HTTPS API on Koyeb.

This is the best fit for Koyeb's free single-service model. The Rust vault can stay mocked for MVP or live elsewhere.

## What gets deployed

- Public service: `services/core-api`
- Dockerfile: `services/core-api/Dockerfile`
- Health check: `/health`

## Prerequisites

- Koyeb account
- `koyeb` CLI authenticated
- GitHub repo reachable by Koyeb

## Required environment variables

- `KOYEB_APP_NAME`
- `KOYEB_SERVICE_NAME` optional, defaults to `core-api`
- `KOYEB_GIT_REPO` optional if `origin` is a GitHub remote
- `KOYEB_GIT_BRANCH` optional, defaults to current branch
- `KOYEB_REGION` optional, defaults to `was`
- `KOYEB_INSTANCE_TYPE` optional, defaults to `nano`
- `KOYEB_VAULT_API_URL` optional; if omitted the Go API falls back to local mock sealing

## Deploy

```bash
export KOYEB_APP_NAME=trojan-horse
export KOYEB_SERVICE_NAME=core-api
export KOYEB_GIT_REPO=github.com/your-org/your-repo
export KOYEB_GIT_BRANCH=main
export KOYEB_REGION=was

./scripts/deploy/koyeb-core-api.sh
```

## Verify

```bash
curl -fsSL "https://<your-koyeb-domain>/health"
curl -fsSL "https://<your-koyeb-domain>/api/dashboard"
```

Expected result:

- `/health` returns `{"status":"ok"}`
- `/api/dashboard` returns the seeded dashboard JSON

## Rollback

- Re-run the same script with `KOYEB_GIT_BRANCH` pointing at the last known-good branch or commit-backed release branch.
- Or roll back from the Koyeb dashboard to the previous deployment.

## Notes

- Koyeb free is best treated as `core-api only` for this repo.
- If you later deploy `services/vault` elsewhere, set `KOYEB_VAULT_API_URL` and redeploy.

