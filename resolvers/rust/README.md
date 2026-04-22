# Rust resolver (`did:webvh`)

HTTP service on **`POST /resolve`** and **`GET /resolve?did=`** using **[didwebvh-rs](https://crates.io/crates/didwebvh-rs)** ([repo](https://github.com/decentralized-identity/didwebvh-rs)).

## Run (local)

Requires **Rust ≥ 1.94** (matches upstream `didwebvh-rs` MSRV).

```bash
cd resolvers/rust
cargo run
# listens on PORT or 8081
```

## Docker

```bash
docker build -t uber-resolver-rust .
docker run --rm -p 8081:8081 uber-resolver-rust
```

## Dependency

Bump **`didwebvh-rs`** in `Cargo.toml` (and features, e.g. `rustls` vs `native-tls`) when upgrading.
