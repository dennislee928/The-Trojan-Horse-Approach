---
title: "__SPACE_TITLE__"
emoji: "🛡️"
colorFrom: "green"
colorTo: "blue"
sdk: "docker"
app_port: 7860
pinned: false
---

# __SPACE_TITLE__

Single-container demo deployment for The Trojan Horse Approach.

This Space runs:

- Next.js web app
- Go core API
- Rust vault service

The public traffic lands on Nginx and is proxied internally to the right process.

