FROM rust:1.92-slim AS builder

WORKDIR /app

COPY services/vault/Cargo.toml services/vault/Cargo.lock ./
RUN mkdir src && printf 'fn main() {}\n' > src/main.rs
RUN cargo build --release || true

COPY services/vault/src ./src
RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=builder /app/target/release/trojan-horse-vault /usr/local/bin/trojan-horse-vault
RUN useradd --system --create-home --uid 10001 trojan
USER trojan

EXPOSE 8090

CMD ["trojan-horse-vault"]
