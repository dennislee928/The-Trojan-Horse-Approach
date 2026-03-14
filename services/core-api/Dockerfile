FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY services/core-api/go.mod services/core-api/go.sum ./
RUN go mod download

COPY services/core-api ./
RUN go build -o /trojan-core-api .

FROM alpine:3.22

WORKDIR /app
COPY --from=builder /trojan-core-api /usr/local/bin/trojan-core-api
RUN addgroup -S trojan && adduser -S trojan -G trojan
USER trojan

EXPOSE 8080

CMD ["trojan-core-api"]
