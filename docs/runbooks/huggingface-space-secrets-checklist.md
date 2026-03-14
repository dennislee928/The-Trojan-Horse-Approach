# Hugging Face Space secrets checklist

## Goal

Make the official Hugging Face demo deployment reproducible without guessing which values belong:

- in your local shell for pushing code
- in the Space Settings page as Variables
- in the Space Settings page as Secrets

This checklist is for the Docker Space runbook in [huggingface-space-demo.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-demo.md).

## 1. Local shell values for the push script

These are not stored in the Space runtime. They are only used by [huggingface-space.sh](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/scripts/deploy/huggingface-space.sh) when pushing the generated bundle to the Space repo.

Required:

- `HF_USERNAME`
- `HF_SPACE_NAME`
- `HF_TOKEN`

Optional:

- `HF_SPACE_TITLE`

Example:

```bash
export HF_USERNAME=your-hf-user
export HF_SPACE_NAME=trojan-horse-demo
export HF_TOKEN=hf_xxx
export HF_SPACE_TITLE="The Trojan Horse Approach Demo"
```

## 2. Space Settings > Variables

No runtime Variables are required for the current demo image.

Why:

- `NEXT_PUBLIC_CORE_API_URL=same-origin` is already baked into the demo container.
- `CORE_API_URL=http://127.0.0.1:8080` is also already baked into the image.
- the public app port is declared in the generated Space `README.md`

Only add Variables if you intentionally change the demo image behavior.

## 3. Space Settings > Secrets

Required:

- `VAULT_MASTER_KEY`

Value format:

- a 64-character hex string

Example:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

## 4. Recommended production-style demo posture

Use this exact baseline:

- Space visibility: `public`
- SDK: `docker`
- hardware: `CPU Basic`
- storage: none, unless you intentionally need persistence
- Space secret: `VAULT_MASTER_KEY`
- Space variables: none

## 5. Pre-push checklist

- The Space already exists and is configured as a Docker Space.
- `HF_TOKEN` has write access to the Space repo.
- `VAULT_MASTER_KEY` has been added in the Space Settings page before the first public demo.
- You are okay with demo data being ephemeral on free hardware.

## 6. Push flow

1. Export the local shell values.
2. Confirm the Space has `VAULT_MASTER_KEY` set in Settings.
3. Run:

```bash
./scripts/deploy/huggingface-space-checklist.sh
./scripts/deploy/huggingface-space.sh
```

4. Wait for the Space build to finish.
5. Open the Space URL and test:
   - landing page
   - digital will generation
   - time capsule creation

## 7. Important caveats

- Hugging Face Variables are public in the repo settings UI and are duplicated with the Space.
- Hugging Face Secrets are private and are not duplicated.
- Changing Variables or Secrets triggers a Space restart.
- For Docker Spaces, Variables can be used at build time and runtime, while Secrets can also be used at runtime and can be mounted at build time if explicitly requested in the Dockerfile.

