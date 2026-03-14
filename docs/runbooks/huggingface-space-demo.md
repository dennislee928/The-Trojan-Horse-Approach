# Hugging Face Space demo runbook

## Goal

Deploy a single-container public demo that bundles:

- Next.js web app
- Go core API
- Rust vault

This uses `deploy/demo-container/Dockerfile` and exposes one public port through Nginx.

## What gets deployed

- Space SDK: Docker
- Public port: `7860`
- Internal ports:
  - Next.js `3000`
  - Go core-api `8080`
  - Rust vault `8090`

## Prerequisites

- Hugging Face account
- Existing Docker Space repository
- A Hugging Face access token with write permission

## Required environment variables

- `HF_USERNAME`
- `HF_SPACE_NAME`
- `HF_TOKEN`
- `HF_SPACE_TITLE` optional

## Required Space secret

- `VAULT_MASTER_KEY`

Use a 64-character hex string.

## Deploy

```bash
export HF_USERNAME=your-hf-user
export HF_SPACE_NAME=trojan-horse-demo
export HF_TOKEN=hf_xxx
export HF_SPACE_TITLE="The Trojan Horse Approach Demo"

./scripts/deploy/huggingface-space.sh
```

The script:

1. Creates a standalone deployment bundle in `.deploy/hf-space`
2. Writes a Space-compatible `README.md`
3. Pushes the bundle to `huggingface.co/spaces/<user>/<space>`

## Verify

After the Space finishes building:

- open `https://huggingface.co/spaces/<user>/<space>`
- confirm the landing page renders
- create a digital will preview
- create a time capsule and confirm it returns `Encrypted and staged`

## Rollback

- Re-run the script from an older commit
- Or open the Space repo history and revert the last push

## Notes

- This is the best free public demo target for the current repo.
- It is still a demo deployment: if the Space sleeps, cold start is expected.
- For production-like reliability, move the API out to a non-sleeping service later.

