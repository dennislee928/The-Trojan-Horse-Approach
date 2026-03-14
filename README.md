# The Trojan Horse Approach

A greenfield monorepo MVP for three consumer-facing digital legacy products:

1. `Digital Will DIY`: a guided flow that turns personal account inventories into a digital inheritance guide.
2. `Subscription Steward`: a subscription audit product that builds trust first, then nudges users to add legacy contacts.
3. `Time Capsule Vault`: an encrypted delivery product for messages, files, and future-dated memories.

## Architecture

- `apps/web`: Next.js web app with the B2C product experience.
- `services/core-api`: Go API service that owns journeys, assets, contacts, triggers, and orchestration.
- `services/vault`: Rust vault service that encrypts and decrypts sensitive payloads.
- `pkg/proto`: shared contracts for future gRPC communication between Go and Rust.
- `docs`: product and implementation planning.

## MVP scope

- Beautiful landing and workflow UI for all three product concepts.
- Working API endpoints for guided plans, subscription scans, dead-man switch status, and capsule delivery schedules.
- Working vault endpoints for encrypting and decrypting structured records and uploaded capsule files.
- Mocked integrations where production systems would require legal, compliance, or security review.

## Quick start

```bash
make bootstrap
make dev
```

Then open `http://localhost:3000`.

## Deployment docs

- Runbooks index: [docs/runbooks/README.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/README.md)
- GitHub Actions auto-deploy: [docs/runbooks/github-actions-auto-deploy.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/github-actions-auto-deploy.md)
- Cloudflare DNS visual guide: [docs/runbooks/cloudflare-dns-visual-guide/README.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/cloudflare-dns-visual-guide/README.md)

## Notes

- The implementation favors a realistic MVP over production-hardening.
- Payment rails, legal-signature enforcement, email provider auth, and real beneficiary delivery are stubbed behind safe local mocks.
