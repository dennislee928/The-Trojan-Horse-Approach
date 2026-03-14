# MVP plan

## Goal

Ship one repo that demonstrates the three product lines on a shared platform:

1. A digital will wizard.
2. A subscription management dashboard with a dead-man switch.
3. A time capsule studio for encrypted memory delivery.

## Product slices

### 1. Digital Will DIY

- Guided intake with account categories, beneficiaries, notes, and unlock instructions.
- Generate a printable inheritance guide preview from the questionnaire answers.
- Encrypt the guide payload and track who receives it when the switch is triggered.

### 2. Subscription Steward

- Inbox scan simulation that extracts subscription receipts from mock email events.
- Dashboard showing monthly spend, duplicate services, and savings suggestions.
- Prompt users to add a trusted contact and configure inactivity thresholds.

### 3. Time Capsule Vault

- Compose written notes for recipients with delivery timing.
- Upload placeholder file metadata for encrypted capsule storage.
- View delivery rules for future dates or posthumous release.

## Technical plan

### Repository structure

- `apps/web`: Next.js App Router app.
- `services/core-api`: Go + Gin REST API.
- `services/vault`: Rust + Axum REST API.
- `pkg/proto`: protobuf contracts for future gRPC bridge.

### Delivery order

1. Create monorepo scaffolding, docs, and local run scripts.
2. Build the web shell and product flows with local API integration.
3. Build the Go core API with seeded data, workflows, and orchestration endpoints.
4. Build the Rust vault with AES-256-GCM encryption helpers and capsule APIs.
5. Wire the web app to both backends, add docker support, and validate.

## MVP constraints

- Use mocked email scans instead of provider OAuth.
- Use mocked PDF generation metadata instead of a legally-binding will pipeline.
- Store sample data in memory or seed files so the repo runs locally without infrastructure.
- Keep protobuf definitions ready even if the first pass uses HTTP for easier local bring-up.

