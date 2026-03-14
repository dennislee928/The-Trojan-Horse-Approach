# alwaysdata runbook

## Goal

Use alwaysdata for a more traditional SSH-based deployment of the backend services.

Recommended first use:

- deploy `services/core-api`
- optionally deploy `services/vault`
- host the Next.js web app elsewhere, or only add it later if resource usage allows

## What gets deployed

- Synced source tree for Go and Rust services
- Runtime processes managed as alwaysdata User Programs

## Prerequisites

- alwaysdata account with SSH access
- a site/subdomain configured in alwaysdata
- ports reserved for user programs

## Required environment variables for sync

- `ALWAYSDATA_HOST`
- `ALWAYSDATA_USER`
- `ALWAYSDATA_REMOTE_ROOT` optional

## Sync files

```bash
export ALWAYSDATA_HOST=ssh-your-account.alwaysdata.net
export ALWAYSDATA_USER=youruser

./scripts/deploy/alwaysdata-sync.sh
```

## Build on the server

SSH into alwaysdata and run:

```bash
cd ~/trojan-horse/services/core-api
go build -o ~/trojan-horse/bin/core-api .

cd ~/trojan-horse/services/vault
cargo build --release
cp target/release/trojan-horse-vault ~/trojan-horse/bin/vault
```

## Create user programs

In the alwaysdata dashboard create:

1. `core-api`
   - command: `~/trojan-horse/bin/core-api`
   - environment:
     - `CORE_API_PORT=8300`
     - `VAULT_API_URL=http://127.0.0.1:8301`

2. `vault`
   - command: `~/trojan-horse/bin/vault`
   - environment:
     - `VAULT_API_PORT=8301`
     - `VAULT_MASTER_KEY=<64-hex-character key>`

Expose only `core-api` publicly through a site or reverse proxy rule.

## Verify

```bash
curl -fsSL "https://<your-alwaysdata-domain>/health"
curl -fsSL "https://<your-alwaysdata-domain>/api/dashboard"
```

## Rollback

- Re-sync from an older commit and restart the User Programs
- Or keep release directories on the server and switch the commands back to the previous binary path

## Notes

- alwaysdata is a stronger fit for backend services than for the full Next.js SSR frontend.
- If you later add PostgreSQL or RabbitMQ, this is the free platform in your list that best supports that direction.

