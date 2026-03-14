# Deployment platform recommendations

Last reviewed: 2026-03-14

This repo currently contains three services:

- `apps/web`: Next.js web app
- `services/core-api`: Go API
- `services/vault`: Rust vault service

Because the architecture is split across three processes, the best free deployment choice depends on whether the goal is:

1. a single public demo,
2. a stable public API endpoint,
3. compatibility testing on constrained hosts.

## Recommended path

### Best demo target: Hugging Face Spaces

Use Hugging Face Spaces when you want one shareable URL for investors, judges, or user testing.

Why it fits:

- Docker Spaces allow a custom `Dockerfile`.
- Free Spaces expose one public app port, but can use multiple internal ports inside the container.
- Free hardware is relatively generous for a demo tier.

Recommended topology:

- Build one demo container that starts:
  - Next.js on the public port
  - Go core API on an internal port
  - Rust vault on an internal port
- Configure the web app to call the internal Go service.
- Configure the Go service to call the internal Rust service.

Tradeoffs:

- Free Spaces sleep when unused, so this is not a good fit for always-on dead-man-switch logic.
- Disk is not persistent by default, so capsule files and encrypted artifacts should be treated as demo data unless external storage is added.

### Best stable free API target: Koyeb

Use Koyeb when the most important thing is an always-addressable HTTPS API.

Why it fits:

- It supports GitHub-driven deployment and Dockerfile builds well.
- The current repo already has service-specific Dockerfiles.

Recommended topology:

- Deploy `services/core-api` as the public service first.
- Keep `services/vault` either:
  - folded into the same demo deployment flow for MVP, or
  - deployed separately only if you move beyond the free single-service limit.
- Host `apps/web` somewhere cheaper or more presentation-friendly.

Tradeoffs:

- Koyeb's free tier is only one web service, so the current three-service split does not fit for free without consolidation.
- Account validation currently requires a credit card, even though the free instance itself remains free.

### Best low-cost "real stack" free host: alwaysdata

Use alwaysdata if you want SSH access, scheduled tasks, PostgreSQL, and RabbitMQ on a free plan and are willing to deploy without Docker.

Why it fits:

- It supports Go and Rust directly.
- It includes SSH and scheduled tasks.
- PostgreSQL and RabbitMQ are available on Public Cloud free plans.

Recommended topology:

- Run `services/core-api` directly on alwaysdata.
- Run `services/vault` directly as an internal service if resource usage stays low.
- Avoid hosting the full Next.js SSR app there unless necessary.

Tradeoffs:

- The free plan is much smaller than the paid tiers.
- Redis is not available on the Public Cloud free plan.
- Docker is not available on the Public Cloud free plan, so the current container-first setup would need a platform-specific runtime script.

## Platforms I would not choose first for this repo

### Back4App Containers

Good for:

- a single very small Dockerized service
- quick GitHub-connected previews

Not ideal here because:

- the free container is small enough that running Next.js + Go + Rust together would be tight
- the current architecture would likely need to be collapsed into one service for a comfortable free deployment

### Serv00

Good for:

- compatibility testing
- shell-based debugging
- validating a lean Go or Node app behind a proxy

Not ideal here because:

- it is not a Docker-first environment
- FreeBSD adds extra friction for a Linux-oriented container workflow
- it is better for testing resilience than for the first public launch

### Deta Space

Not recommended for this repo in its current form.

Why:

- the official quickstart still documents Node.js 16 as the supported engine for Space apps
- the platform does not match the Go + Rust service split well
- long-running background behavior is a poor fit for dead-man-switch style jobs

## Practical recommendation by stage

### Stage 1: public demo

- Deploy a single all-in-one demo container to Hugging Face Spaces.
- Use seeded or in-memory data only.
- Treat it as a showcase, not a durable service.

### Stage 2: stable API

- Deploy `services/core-api` to Koyeb.
- Point the web app to the Koyeb URL.
- Keep the vault mocked or colocated until you are ready for a second service.

### Stage 3: more complete backend

- Move to alwaysdata if you want free SSH + cron + PostgreSQL + RabbitMQ and are comfortable dropping Docker-first assumptions.
- Otherwise move to a paid multi-service platform later.

## What I would implement next

If deployment work continues, the next two high-leverage tasks are:

1. Add an `all-in-one` demo Docker target for Hugging Face Spaces.
2. Add a `koyeb` deployment target for `services/core-api`.
