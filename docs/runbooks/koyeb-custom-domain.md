# Koyeb custom domain runbook

## Goal

Attach a custom domain to the public `core-api` deployment on Koyeb and bring it online with HTTPS.

Recommended pattern:

- use a subdomain like `api.example.com`
- keep the apex/root domain like `example.com` redirected elsewhere unless your DNS provider has a well-tested flattening setup

## Prerequisites

- The Koyeb app is already deployed and healthy
- You control the DNS zone
- You have the Koyeb CLI installed and authenticated, or access to the Koyeb dashboard

If the CLI is not ready yet, complete [koyeb-cli-setup.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-cli-setup.md) first.

## Recommended domain choice

Use:

- `api.example.com`

Avoid as the first attempt:

- `example.com`

Why:

- Koyeb officially documents the subdomain `CNAME` path as the normal flow
- Koyeb documents apex/root-domain handling as a redirect workflow for most DNS providers

## Environment variables for the helper script

- `KOYEB_APP_NAME`
- `KOYEB_DOMAIN`

Optional:

- `KOYEB_DOMAIN_REFRESH=1`

Example:

```bash
export KOYEB_APP_NAME=trojan-horse
export KOYEB_DOMAIN=api.example.com
```

## Step 1. Confirm the app is healthy on the Koyeb URL

```bash
curl -fsSL "https://<your-koyeb-app>.koyeb.app/health"
curl -fsSL "https://<your-koyeb-app>.koyeb.app/api/dashboard"
```

Do not move on until this works.

## Step 2. Create and inspect the Koyeb domain

```bash
./scripts/deploy/koyeb-custom-domain.sh
```

The helper script will:

1. create the domain if it does not already exist
2. attach it to the Koyeb app
3. print the domain metadata in JSON using `koyeb domains get`

## Step 3. Create the DNS record at your DNS provider

For a subdomain like `api.example.com`, create a `CNAME` record using the target shown by Koyeb.

The official Koyeb docs describe this shape:

- name: `api` or `www`
- type: `CNAME`
- value: something like `your-org-uuid.cname.koyeb.app`

Use the exact value shown by `koyeb domains get <domain> -o json` or in the Koyeb dashboard.

## Step 4. Refresh validation

Once the DNS record has propagated:

```bash
export KOYEB_DOMAIN_REFRESH=1
./scripts/deploy/koyeb-custom-domain.sh
```

Or manually run:

```bash
koyeb domains refresh "$KOYEB_DOMAIN"
```

## Step 5. Verify HTTPS

```bash
curl -I "https://$KOYEB_DOMAIN/health"
curl -fsSL "https://$KOYEB_DOMAIN/api/dashboard"
```

Expected result:

- HTTPS responds successfully
- `/health` returns `200`
- `/api/dashboard` returns JSON

## Apex/root domain path

If you want `example.com`:

1. create `www.example.com` in Koyeb
2. point `www.example.com` to Koyeb with the documented `CNAME`
3. configure your DNS provider to redirect `example.com` to `https://www.example.com`

This is the officially documented safe path for most DNS providers.

## Cloudflare-specific suggestion

If you use Cloudflare:

- create the `CNAME` for the Koyeb subdomain first
- keep it `DNS only` until Koyeb shows the domain as active and TLS is working
- only then consider enabling Cloudflare proxy if you really need it

For concrete record examples, use [cloudflare-dns-examples.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/cloudflare-dns-examples.md).

## Rollback

- remove or detach the custom domain from Koyeb:

```bash
koyeb domains detach "$KOYEB_DOMAIN"
```

- remove the DNS record
- continue serving traffic from the default `koyeb.app` domain while you fix DNS

## Troubleshooting checklist

- Koyeb app works on the default `koyeb.app` domain
- the DNS record matches the exact Koyeb-provided target
- you used a `CNAME` for a subdomain
- you refreshed validation after DNS propagation
- if TLS is pending, wait a few minutes before retrying
