bootstrap:
	npm run bootstrap
	cd services/core-api && go mod tidy
	cd services/vault && cargo check

dev:
	./scripts/dev.sh

dev-web:
	npm run dev

test:
	npm run lint
	cd services/core-api && go test ./...
	cd services/vault && cargo test

build:
	npm run build
	cd services/core-api && go build ./...
	cd services/vault && cargo build
