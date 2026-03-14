FROM node:22-bookworm-slim AS web-builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV CORE_API_URL=http://127.0.0.1:8080
ENV NEXT_PUBLIC_CORE_API_URL=same-origin

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace apps/web

COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN npm run build

FROM golang:1.25-alpine AS core-builder

WORKDIR /src

COPY services/core-api/go.mod services/core-api/go.sum ./
RUN go mod download

COPY services/core-api ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/core-api .

FROM rust:1.92-slim AS vault-builder

WORKDIR /src

COPY services/vault/Cargo.toml services/vault/Cargo.lock ./
COPY services/vault/src ./src
RUN cargo build --release && mkdir -p /out && cp target/release/trojan-horse-vault /out/vault

FROM node:22-bookworm-slim

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_PORT=7860
ENV CORE_API_PORT=8080
ENV VAULT_API_PORT=8090
ENV VAULT_API_URL=http://127.0.0.1:8090
ENV CORE_API_URL=http://127.0.0.1:8080
ENV NEXT_PUBLIC_CORE_API_URL=same-origin
ENV HOSTNAME=127.0.0.1
ENV PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=web-builder /app/apps/web/.next/standalone /app/web
COPY --from=web-builder /app/apps/web/.next/static /app/web/.next/static
COPY --from=web-builder /app/apps/web/public /app/web/public
COPY --from=core-builder /out/core-api /app/core-api
COPY --from=vault-builder /out/vault /app/vault
COPY deploy/demo-container/nginx.conf /etc/nginx/nginx.conf
COPY deploy/demo-container/start-demo.sh /app/start-demo.sh

RUN chmod +x /app/start-demo.sh /app/core-api /app/vault \
  && useradd --system --create-home --uid 10001 trojan \
  && mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx \
  && chown -R trojan:trojan /app /var/cache/nginx /var/log/nginx /tmp/nginx

USER trojan

EXPOSE 7860

CMD ["/app/start-demo.sh"]
