# uber-resolver

One API surface, multiple **`did:webvh`** resolver implementations (Rust, Python, TypeScript) behind a small gateway. The frontend talks only to the gateway; the gateway delegates to a selected engine (or runs comparison / fallback policies).

Each resolver is a thin HTTP service wrapping the corresponding **decentralized-identity** library:

- TypeScript: [didwebvh-ts](https://github.com/decentralized-identity/didwebvh-ts)
- Rust: [didwebvh-rs](https://github.com/decentralized-identity/didwebvh-rs)
- Python: [didwebvh-py](https://github.com/decentralized-identity/didwebvh-py)

See [docs/REFERENCE_IMPLEMENTATIONS.md](docs/REFERENCE_IMPLEMENTATIONS.md) for integration notes and version alignment.

## Layout (planned)

| Path | Role |
|------|------|
| `gateway/` | HTTP BFF: routes `POST /v1/resolve` to the chosen resolver service; normalizes responses. |
| `resolvers/rust/` | Rust resolver HTTP service. |
| `resolvers/python/` | Python resolver HTTP service. |
| `resolvers/typescript/` | TypeScript (Node) resolver HTTP service. |
| `contracts/` | Shared request/response schema (e.g. OpenAPI or JSON Schema) + golden test vectors. |

## Principles

- **Same contract** for every implementation (input DID, output DID document / resolution metadata).
- **Separate processes** (containers), not one polyglot binary.
- **Delegation** via gateway: `resolver` field or header (`rust` \| `python` \| `ts` \| `auto`).

## Run the three resolvers (local)

| Service | Port | Command |
|---------|------|---------|
| Rust | `8081` | `cd resolvers/rust && cargo run` |
| Python | `8082` | `cd resolvers/python && python3 -m venv .venv && . .venv/bin/activate && pip install -e . && uber-resolver-python` |
| TypeScript | `8083` | `cd resolvers/typescript && npm install && npm start` |

**API (each service):**

- `GET /health` — `{ "status": "ok", "engine": "rust" \| "python" \| "typescript" }`
- `POST /resolve` — JSON body `{ "did": "did:webvh:…" }`
- `GET /resolve?did=did:webvh:…` — convenience alias

Response shape follows W3C DID Resolution where applicable; see [`contracts/openapi.yaml`](contracts/openapi.yaml).

**Docker Compose** (builds all three):

```bash
docker compose up --build
```

## Status

Resolver microservices implemented; gateway and golden-vector CI still optional follow-ups.

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
