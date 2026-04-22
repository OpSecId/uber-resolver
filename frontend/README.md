# WebVH playground (React + shadcn)

Single-page UI to call the three **`did:webvh`** resolver microservices (`POST /resolve`, `GET /health`), similar in spirit to the [Universal Resolver dev UI](https://dev.uniresolver.io/) but scoped to WebVH engines in this repo.

## Run

1. Start one or more resolvers (e.g. `docker compose up` from repo root, or run each service on **8081–8083**).
2. From this directory:

```bash
npm install
npm run dev
```

The Vite dev server proxies:

| Path prefix              | Target (default)   |
|-------------------------|--------------------|
| `/engine/didwebvh-rs/*` | `http://127.0.0.1:8081` |
| `/engine/didwebvh-py/*` | `http://127.0.0.1:8082` |
| `/engine/didwebvh-ts/*` | `http://127.0.0.1:8083` |

Override bases with `VITE_ENGINE_DIDWEBVH_RS` (and `_PY` / `_TS`) — see `.env.example`.

## Build

```bash
npm run build
npm run preview
```

## Docker

Build and run with the rest of the stack (from repo root):

```bash
docker compose up --build
```

Then open **http://localhost:3000** (UI) while resolvers stay on **8081–8083**.

The image serves the static build and **reverse-proxies** `/engine/didwebvh-rs/`, `/engine/didwebvh-py/`, `/engine/didwebvh-ts/` to the resolver containers. Override targets with:

| Variable          | Default                 |
|-------------------|-------------------------|
| `ENGINE_RS_HOST`  | `resolver-didwebvh-rs`  |
| `ENGINE_RS_PORT`| `8081`                  |
| `ENGINE_PY_HOST`| `resolver-didwebvh-py`  |
| `ENGINE_PY_PORT`| `8082`                  |
| `ENGINE_TS_HOST`| `resolver-didwebvh-ts`  |
| `ENGINE_TS_PORT`| `8083`                  |

Build only the UI image:

```bash
docker build -t uber-resolver-frontend ./frontend
```
