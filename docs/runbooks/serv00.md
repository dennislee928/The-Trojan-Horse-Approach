# Serv00 runbook

## Goal

Use Serv00 for compatibility testing or a lean backend deployment under FreeBSD shell constraints.

Recommended first use:

- deploy `services/core-api`
- optionally keep `services/vault` local or mocked
- use Serv00 mainly to prove the backend survives constrained hosting

## Prerequisites

- Serv00 account
- SSH access
- a domain or subdomain attached to your account
- Binexec enabled
- TCP ports reserved for your services

## Required environment variables for sync

- `SERV00_HOST`
- `SERV00_USER`
- `SERV00_REMOTE_ROOT` optional

## Sync files

```bash
export SERV00_HOST=s0.serv00.com
export SERV00_USER=youruser

./scripts/deploy/serv00-sync.sh
```

## Prepare the account

After SSH login:

```bash
devil binexec on
devil port add tcp 18080
devil port add tcp 18090
```

Create a proxy page that forwards public traffic to the Go service:

```bash
devil www add yourdomain.example proxy localhost 18080
```

## Build and run

On the server:

```bash
cd ~/trojan-horse/services/core-api
go build -o ~/trojan-horse/bin/core-api .

cd ~/trojan-horse/services/vault
cargo build --release
cp target/release/trojan-horse-vault ~/trojan-horse/bin/vault
```

Start the services in long-lived sessions:

```bash
tmux new -d -s vault 'VAULT_API_PORT=18090 VAULT_MASTER_KEY=<64-hex-character key> ~/trojan-horse/bin/vault'
tmux new -d -s core 'CORE_API_PORT=18080 VAULT_API_URL=http://127.0.0.1:18090 ~/trojan-horse/bin/core-api'
```

## Verify

```bash
curl -fsSL "https://yourdomain.example/health"
curl -fsSL "https://yourdomain.example/api/dashboard"
```

## Rollback

- Kill the tmux sessions
- Replace the binaries with the previous build
- Start new tmux sessions from the last known-good release

## Notes

- Serv00 is not the best first public home for the full three-service product.
- It is very useful for proving that the Go backend still works in a low-friction shell host.
