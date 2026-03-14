# Hugging Face Space first repo setup

## Goal

Create the Hugging Face Docker Space for this project from scratch, before using the push helper scripts.

Use this before:

- [huggingface-space-secrets-checklist.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-secrets-checklist.md)
- [huggingface-space-demo.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-demo.md)

## What you are creating

A Hugging Face Space repository with:

- SDK: `Docker`
- public demo visibility as you choose
- the generated demo bundle later pushed by [huggingface-space.sh](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/scripts/deploy/huggingface-space.sh)

## Step 1. Create the Space in the UI

1. Open the Spaces page on Hugging Face.
2. Click `Create new Space`.
3. Choose:
   - Owner: your account or organization
   - Space name: for example `trojan-horse-demo`
   - License: optional
   - Visibility: `Public` for a shareable demo, `Private` for staging
   - SDK: `Docker`
4. Create the Space.

Hugging Face documents that Spaces are regular git repositories under the hood, and that Docker Spaces are configured by setting `sdk: docker` in the README metadata.

## Step 2. Open the new Space repository

Once created, the empty Space repository becomes available immediately.

At this point you can:

- view the Space page
- open the repository files
- use the `Clone repository` dropdown

## Step 3. Decide whether you will push with HTTPS or SSH

For this repo, the provided helper script uses HTTPS with a token:

```text
https://<HF_USERNAME>:<HF_TOKEN>@huggingface.co/spaces/<HF_USERNAME>/<HF_SPACE_NAME>
```

This means the simplest supported path is:

- create a User Access Token on Hugging Face
- store it in local shell env as `HF_TOKEN`
- use [huggingface-space.sh](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/scripts/deploy/huggingface-space.sh)

If you prefer manual git operations, you can also clone the Space repo from the `Clone repository` menu using HTTPS or SSH.

## Step 4. Add the runtime secret before the first real deploy

Go to the Space `Settings` page and add:

- Secret: `VAULT_MASTER_KEY`

Use the checklist in:

- [huggingface-space-secrets-checklist.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/huggingface-space-secrets-checklist.md)

You do not need any Space Variables for the current demo image.

## Step 5. Prepare your local shell

```bash
export HF_USERNAME=your-hf-user
export HF_SPACE_NAME=trojan-horse-demo
export HF_TOKEN=hf_xxx
export HF_SPACE_TITLE="The Trojan Horse Approach Demo"
```

Optional helper:

```bash
./scripts/deploy/huggingface-space-checklist.sh
```

## Step 6. Push the first deployment

```bash
./scripts/deploy/huggingface-space.sh
```

This script will:

1. prepare a clean deployment bundle in `.deploy/hf-space`
2. generate a Space-compatible `README.md`
3. initialize a temporary git repo
4. push that bundle to your Hugging Face Space repo

## Step 7. Watch the first build

After the push:

1. open the Space page
2. wait for the build to start
3. confirm the Space status changes from `Building` to running

## Step 8. Verify the demo

Check:

- landing page loads
- `/api/dashboard` works
- digital will preview works
- time capsule creation returns `Encrypted and staged`

## Manual git alternative

If you want to do the first deploy manually instead of using the helper script:

1. create the Space in the UI
2. clone the Space repo from the `Clone repository` menu
3. copy the prepared bundle into that local clone
4. commit and push to `main`

The helper script exists so you do not have to manage that temporary Space repo by hand.

