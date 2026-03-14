# GitHub Actions auto-deploy

## Goal

Automate the two public deployment targets in this repo:

- Koyeb for `services/core-api`
- Hugging Face Spaces for the all-in-one demo container

## Workflow files

- [deploy-koyeb.yml](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/.github/workflows/deploy-koyeb.yml)
- [deploy-huggingface-space.yml](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/.github/workflows/deploy-huggingface-space.yml)

## Trigger model

Both workflows support:

- automatic deploy after the `CI` workflow succeeds on `main`
- manual deploy through `workflow_dispatch`

That gives you a safe default:

1. code merges to `main`
2. CI passes
3. deploy workflow runs

## GitHub secrets and variables

For where to obtain each secret and identifier, use [deployment-credentials-and-identifiers.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/deployment-credentials-and-identifiers.md).

### Koyeb workflow

Required GitHub secrets:

- `KOYEB_TOKEN`
- `KOYEB_APP_NAME`

Optional GitHub secret:

- `KOYEB_DOMAIN`

Optional GitHub variables:

- `KOYEB_SERVICE_NAME`
- `KOYEB_REGION`
- `KOYEB_INSTANCE_TYPE`
- `KOYEB_VAULT_API_URL`

Recommended defaults:

```text
KOYEB_SERVICE_NAME=core-api
KOYEB_REGION=was
KOYEB_INSTANCE_TYPE=nano
```

### Hugging Face workflow

Required GitHub secrets:

- `HF_TOKEN`
- `HF_USERNAME`
- `HF_SPACE_NAME`

Optional GitHub variable:

- `HF_SPACE_TITLE`

## Repository settings checklist

1. Open `Settings -> Secrets and variables -> Actions`.
2. Add the required secrets for the target platform.
3. Add optional variables if you want to override defaults.
4. Open `Actions` and run the workflow manually once to verify permissions and values.

## Koyeb flow details

The Koyeb workflow:

1. checks out the tested commit or the manually selected ref
2. installs the official Koyeb CLI
3. runs [koyeb-core-api.sh](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/scripts/deploy/koyeb-core-api.sh)
4. optionally refreshes the custom domain through [koyeb-custom-domain.sh](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/scripts/deploy/koyeb-custom-domain.sh)

The deployment scripts support `KOYEB_TOKEN`, so the workflow can authenticate without an interactive login.

## Hugging Face flow details

The Hugging Face workflow:

1. checks out the tested commit or the manually selected ref
2. runs [huggingface-space.sh](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/scripts/deploy/huggingface-space.sh)
3. builds a clean `.deploy/hf-space` bundle
4. force-pushes the bundle to the target Space repository

This matches the existing local deployment flow, so local and CI deploys stay aligned.

## Recommended branch policy

- keep auto-deploy tied to `main`
- use pull requests for review
- let `CI` gate the deploy workflows

If you want preview environments later, add separate workflows for non-`main` branches instead of widening the production workflow.

## Pair with these runbooks

- [koyeb-cli-setup.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-cli-setup.md)
- [koyeb-core-api.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-core-api.md)
- [koyeb-custom-domain.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-custom-domain.md)
- [huggingface-space-first-repo.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-first-repo.md)
- [huggingface-space-secrets-checklist.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-secrets-checklist.md)
- [huggingface-space-demo.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-demo.md)
