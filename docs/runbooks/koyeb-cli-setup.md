# Koyeb CLI install and login runbook

## Goal

Install the Koyeb CLI, authenticate it, and verify that the local machine is ready to use the deployment scripts in this repo.

Use this before:

- [koyeb-core-api.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-core-api.md)
- [koyeb-custom-domain.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-custom-domain.md)

## Official install options

Koyeb officially documents three install paths:

- Homebrew
- shell installer
- Docker image

For this repo, the best local options are Homebrew or the shell installer.

## Option 1. Install with Homebrew

Recommended on macOS if you already use Homebrew.

```bash
brew install koyeb/tap/koyeb
```

Upgrade later with:

```bash
brew upgrade koyeb
```

## Option 2. Install with the shell installer

Recommended if you do not use Homebrew.

```bash
curl -fsSL https://raw.githubusercontent.com/koyeb/koyeb-cli/master/install.sh | sh
```

Then add the binary to your shell path:

```bash
echo 'export PATH=$HOME/.koyeb/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

## Option 3. Use the Docker image

Useful for CI or throwaway environments:

```bash
docker pull koyeb/koyeb-cli:latest
```

This is not the most convenient choice for the helper scripts in this repo, because the scripts expect `koyeb` to exist directly on your `PATH`.

## Login

Run:

```bash
koyeb login
```

This opens the Koyeb authentication flow and stores your CLI configuration locally.

If you prefer token-based usage, the Koyeb CLI also supports `--token` and a config file, but the normal `koyeb login` flow is the simplest default.

## Verify the install

Run:

```bash
koyeb version
koyeb apps list
```

Expected result:

- `koyeb version` prints the installed CLI version
- `koyeb apps list` returns your apps or an empty list without authentication errors

## Verify this repo is ready

Once the CLI is installed and authenticated, these scripts should be usable:

```bash
./scripts/deploy/koyeb-core-api.sh
./scripts/deploy/koyeb-custom-domain.sh
```

## Troubleshooting

### `koyeb: command not found`

- Homebrew path is not loaded yet, or
- `~/.koyeb/bin` is not on your shell `PATH`

Confirm with:

```bash
echo "$PATH"
ls ~/.koyeb/bin
```

### Login succeeded in browser but CLI still fails

Try:

```bash
koyeb apps list --debug
```

This helps confirm whether the saved CLI config is being picked up.

### You want a clean re-login

If your local config is corrupted or stale, remove or rename the Koyeb config file and run `koyeb login` again.

The default config path is described by the CLI as:

- `$HOME/.koyeb.yaml`

