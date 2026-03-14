# Back4App Containers demo runbook

## Goal

Deploy the single-container demo image to Back4App Containers.

This reuses the same all-in-one Docker target as Hugging Face Spaces.

## What gets deployed

- Root directory: repository root `.`
- Dockerfile path: `deploy/demo-container/Dockerfile`
- Public port: `7860`

## Prerequisites

- Back4App account
- GitHub repo connected to Back4App Containers

## Required environment variable

- `VAULT_MASTER_KEY`

Use a 64-character hex string.

## Dashboard values

Run the helper to print the expected settings:

```bash
./scripts/deploy/back4app-demo.sh
```

Then use these values in Back4App:

- Repository: this repo
- Branch: `main`
- Root directory: `.`
- Dockerfile path: `deploy/demo-container/Dockerfile`
- Container port: `7860`

## Verify

- open the Back4App public URL
- confirm the landing page renders
- call `/api/dashboard`

## Rollback

- Redeploy from an older Git commit in the Back4App dashboard
- Or point the app to a rollback branch

## Notes

- This is workable for a demo, but memory is tighter than Hugging Face Spaces.
- If cold starts or memory pressure become visible, prefer Hugging Face Spaces for the all-in-one demo.

