# Deployment credentials and identifiers

## Goal

Show exactly how to obtain these values for local deploys and GitHub Actions:

- `KOYEB_TOKEN`
- `KOYEB_APP_NAME`
- `HF_TOKEN`
- `HF_USERNAME`
- `HF_SPACE_NAME`

## Quick reference

| Variable | What it is | Where to get it | Used by |
| --- | --- | --- | --- |
| `KOYEB_TOKEN` | Koyeb API token | Koyeb control panel `Settings -> API` | local shell, GitHub Actions |
| `KOYEB_APP_NAME` | Koyeb App name | Koyeb Apps list, App URL, or the name you choose for a new app | local shell, GitHub Actions |
| `HF_TOKEN` | Hugging Face User Access Token | Hugging Face `Settings -> Access Tokens` | local shell, GitHub Actions |
| `HF_USERNAME` | Hugging Face namespace owner | your profile slug or organization slug | local shell, GitHub Actions |
| `HF_SPACE_NAME` | Hugging Face Space repository name | the Space creation form or the Space URL | local shell, GitHub Actions |

## `KOYEB_TOKEN`

### What it is

This repo uses `KOYEB_TOKEN` as the environment variable consumed by the deployment scripts.

Koyeb's official tooling also documents token-based authentication through the CLI `--token` flag, and other Koyeb examples sometimes use names like `KOYEB_API_TOKEN`.

For this repo, use:

```bash
export KOYEB_TOKEN=...
```

### How to get it

1. Sign in to the Koyeb control panel.
2. Open `Settings`.
3. Open the `API` tab.
4. Click `Create API token`.
5. Give it a recognizable name such as `the-trojan-horse-local` or `the-trojan-horse-github-actions`.
6. Copy the token immediately and store it safely.

Important:

- Koyeb documents that the token value is not accessible later, so copy it at creation time.
- If you lose it, create a new token and rotate the old one out.

### Where to store it

Local shell:

```bash
export KOYEB_TOKEN=your_koyeb_token
```

GitHub Actions secret:

- `KOYEB_TOKEN`

## `KOYEB_APP_NAME`

### What it is

This is the Koyeb App name, not the service name.

In this repo, the default is:

```text
trojan-horse
```

You can override it if you want a different app container name in Koyeb.

### How to get it for an existing app

Use one of these sources:

1. Koyeb dashboard `Apps` list
2. the app header after opening the app in the Koyeb control panel
3. the default Koyeb hostname

Koyeb documents the default app hostname format as:

```text
<YOUR_APP_NAME>-<YOUR_KOYEB_ORGANIZATION>-<HASH>.koyeb.app
```

So if your default hostname is:

```text
trojan-horse-myteam-ab12cd.koyeb.app
```

then the app name is:

```text
trojan-horse
```

### How to choose it for a new app

You can simply decide the value yourself before the first deploy.

Example:

```bash
export KOYEB_APP_NAME=trojan-horse
```

Our deploy script will create the app if it does not exist yet.

### Where to store it

Local shell:

```bash
export KOYEB_APP_NAME=trojan-horse
```

GitHub Actions secret:

- `KOYEB_APP_NAME`

## `HF_TOKEN`

### What it is

This is a Hugging Face User Access Token used to push to the Space repository.

Hugging Face documents that User Access Tokens can be used in place of a password for git/basic auth, which is exactly how this repo's push script uses it.

### How to get it

1. Sign in to Hugging Face.
2. Open `Settings`.
3. Open `Access Tokens`.
4. Click `New token`.
5. Choose a name.
6. Choose a token type that can write to the target Space repository.
7. Copy the token and store it safely.

Recommended posture:

- for a simple personal demo, use a token with write access
- for production-like use, Hugging Face recommends fine-grained tokens when possible

If the Space belongs to an organization, make sure the user who creates the token has write access to that Space.

### Where to store it

Local shell:

```bash
export HF_TOKEN=hf_xxx
```

GitHub Actions secret:

- `HF_TOKEN`

## `HF_USERNAME`

### What it is

Despite the variable name, this value is really the Hugging Face namespace owner.

That means:

- your username for a personal Space
- your organization slug for an org-owned Space

### How to get it

Use the namespace shown in the Space URL or repository path.

Hugging Face documents repository identifiers as:

```text
namespace/repo_name
```

For Spaces, the URL shape is:

```text
https://huggingface.co/spaces/<namespace>/<space_name>
```

Examples:

```text
https://huggingface.co/spaces/dennislee928/trojan-horse-demo
```

Then:

```bash
export HF_USERNAME=dennislee928
```

Or for an organization:

```text
https://huggingface.co/spaces/my-org/trojan-horse-demo
```

Then:

```bash
export HF_USERNAME=my-org
```

### Where to store it

Local shell:

```bash
export HF_USERNAME=your-namespace
```

GitHub Actions secret:

- `HF_USERNAME`

## `HF_SPACE_NAME`

### What it is

This is the Space repository name.

It is the second segment of the Space identifier:

```text
<namespace>/<space_name>
```

### How to get it

Use one of these sources:

1. the Space creation form where you pick the name
2. the Space page URL
3. the repository header on the Space page

Example:

```text
https://huggingface.co/spaces/dennislee928/trojan-horse-demo
```

Then:

```bash
export HF_SPACE_NAME=trojan-horse-demo
```

### Where to store it

Local shell:

```bash
export HF_SPACE_NAME=trojan-horse-demo
```

GitHub Actions secret:

- `HF_SPACE_NAME`

## Copy-paste example

Local shell:

```bash
export KOYEB_TOKEN=your_koyeb_token
export KOYEB_APP_NAME=trojan-horse
export HF_TOKEN=hf_xxx
export HF_USERNAME=your-namespace
export HF_SPACE_NAME=trojan-horse-demo
```

Template file in this repo:

- [.env.deploy.example](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/.env.deploy.example)

GitHub Actions:

- `KOYEB_TOKEN`
- `KOYEB_APP_NAME`
- `HF_TOKEN`
- `HF_USERNAME`
- `HF_SPACE_NAME`

## Recommended follow-up docs

- [github-actions-auto-deploy.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/github-actions-auto-deploy.md)
- [koyeb-cli-setup.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-cli-setup.md)
- [koyeb-core-api.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-core-api.md)
- [huggingface-space-first-repo.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-first-repo.md)
- [huggingface-space-secrets-checklist.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-secrets-checklist.md)

## Official references

- Koyeb CLI reference: https://www.koyeb.com/docs/build-and-deploy/cli/reference
- Koyeb sandbox quickstart token creation steps: https://www.koyeb.com/docs/sandboxes/sandbox-quickstart
- Koyeb Apps reference: https://www.koyeb.com/docs/reference/apps
- Hugging Face user access tokens: https://huggingface.co/docs/hub/main/security-tokens
- Hugging Face Spaces GitHub Actions: https://huggingface.co/docs/hub/en/spaces-github-actions
- Hugging Face repository identifiers: https://huggingface.co/docs/huggingface_hub/guides/repository
