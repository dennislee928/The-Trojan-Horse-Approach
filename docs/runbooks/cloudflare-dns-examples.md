# Cloudflare DNS examples

## Goal

Show the exact DNS shapes to use in Cloudflare when pointing traffic to:

- a Koyeb custom subdomain
- an apex domain redirect
- a root-to-subdomain redirect

This runbook is written as a text-first visual guide so it is easy to follow inside the Cloudflare dashboard.

## Recommended pattern for this repo

For the Koyeb-hosted API, use:

- `api.example.com` -> Koyeb

For the human-facing website, keep it separate:

- `www.example.com` -> web frontend host
- `example.com` -> redirect to `www.example.com`

This keeps the API cutover simple and avoids mixing apex-domain tricks with the first Koyeb deployment.

## Example 1. API subdomain -> Koyeb

Use this for:

- `api.example.com`

Cloudflare DNS record:

```text
Type:   CNAME
Name:   api
Target: your-org-uuid.cname.koyeb.app
Proxy:  DNS only
TTL:    Auto
```

Visual shape:

```text
api.example.com
  -> CNAME
  -> your-org-uuid.cname.koyeb.app
```

Why `DNS only` first:

- it reduces moving parts while Koyeb validates the domain and issues TLS
- once the domain is active and healthy, you can decide whether to keep it `DNS only` or enable the Cloudflare proxy later

## Example 2. Root domain -> WWW redirect

Use this when you want:

- `example.com` to redirect to `www.example.com`

Cloudflare DNS records:

```text
Type:   A
Name:   @
IPv4:   192.0.2.1
Proxy:  Proxied

Type:   A
Name:   www
IPv4:   192.0.2.1
Proxy:  Proxied
```

Then create a Redirect Rule:

```text
When incoming requests match:
  Wildcard pattern
  https://example.com/*

Then:
  Forward to
  https://www.example.com/${1}
  Status code: 301
  Preserve query string: enabled
```

Visual shape:

```text
example.com
  -> Cloudflare proxied placeholder record
  -> Redirect Rule
  -> https://www.example.com/${1}
```

## Example 3. Apex domain record in Cloudflare

If your DNS provider is Cloudflare and you truly need an apex record:

```text
Type:   CNAME
Name:   @
Target: target.example.host
Proxy:  DNS only or Proxied depending on your use case
TTL:    Auto
```

Cloudflare supports apex `CNAME` usage through CNAME flattening.

For this repo, I still recommend avoiding apex -> Koyeb as the first move. Start with `api.example.com`.

## Example 4. WWW -> Koyeb instead of API

If you want Koyeb to serve the public hostname directly:

```text
Type:   CNAME
Name:   www
Target: your-org-uuid.cname.koyeb.app
Proxy:  DNS only
TTL:    Auto
```

Visual shape:

```text
www.example.com
  -> CNAME
  -> your-org-uuid.cname.koyeb.app
```

Then optionally redirect:

```text
example.com -> https://www.example.com/${1}
```

## Dashboard walkthrough

### Create the DNS record

1. Open your Cloudflare zone.
2. Go to `DNS`.
3. Select `Add record`.
4. Fill in the record values from the matching example above.
5. Save the record.

### Create the redirect rule

1. Go to `Rules`.
2. Open `Redirect Rules`.
3. Create a new rule.
4. Use the hostname or wildcard pattern from the example above.
5. Set a `301` redirect target.
6. Save and deploy.

## Recommended rollout order

1. Create the Koyeb custom domain in Koyeb first.
2. Copy the exact target hostname Koyeb gives you.
3. Add the Cloudflare DNS record as `DNS only`.
4. Wait for the domain to validate and TLS to issue on Koyeb.
5. Test:
   - `https://api.example.com/health`
   - `https://api.example.com/api/dashboard`
6. Only after success, consider turning the record `Proxied` if you actually need Cloudflare proxy features.

## Common mistakes

- Creating an `A` record to Koyeb instead of the Koyeb-provided `CNAME`
- Enabling the Cloudflare proxy too early during Koyeb validation
- Forgetting that Cloudflare Redirect Rules require proxied records
- Trying to use `example.com` before the subdomain path is confirmed healthy

## Pairing with Koyeb

This runbook is designed to be used with:

- [koyeb-custom-domain.md](/Users/dennis_leedennis_lee/Documents/GitHub/The Trojan Horse Approach/docs/runbooks/koyeb-custom-domain.md)

