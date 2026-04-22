/**
 * Thin HTTP resolver: POST/GET `/resolve` using `didwebvh-ts`.
 * @see https://github.com/decentralized-identity/didwebvh-ts
 */

import { createRequire } from 'node:module';
import express from 'express';
import { resolveDID } from 'didwebvh-ts';

const require = createRequire(import.meta.url);

const ENGINE = 'didwebvh-ts';
const PORT = Number(process.env.PORT || 8083);

let SERVICE_VERSION = '0.1.0';
let LIBRARY_VERSION = 'unknown';
try {
  ({ version: SERVICE_VERSION } = require('../package.json'));
} catch {
  /* ignore */
}
try {
  ({ version: LIBRARY_VERSION } = require('didwebvh-ts/package.json'));
} catch {
  /* ignore */
}

function toW3c(result) {
  const { did, doc, controlled, meta } = result;
  const base = {
    '@context': 'https://w3id.org/did-resolution/v1',
    didDocument: doc ?? null,
    didDocumentMetadata: {},
    didResolutionMetadata: {
      contentType: 'application/did+ld+json',
      did,
      ...(controlled !== undefined ? { controlled } : {}),
      ...(meta && typeof meta === 'object' ? meta : {}),
      driver: 'uber-resolver-didwebvh-ts/didwebvh-ts',
    },
  };
  return base;
}

function httpStatus(body) {
  const err = body.didResolutionMetadata?.error;
  if (!err) return 200;
  if (err === 'notFound') return 404;
  return 400;
}

const app = express();
app.use(express.json({ limit: '64kb' }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    engine: ENGINE,
    serviceVersion: SERVICE_VERSION,
    libraryVersion: LIBRARY_VERSION,
  });
});

async function handleResolve(did, res) {
  const trimmed = (did || '').trim();
  if (!trimmed || !trimmed.startsWith('did:webvh:')) {
    return res.status(400).json(
      toW3c({
        did: trimmed || 'unknown',
        doc: null,
        meta: {
          error: 'invalidDid',
          problemDetails: { detail: 'Query/body must include non-empty "did" starting with did:webvh:' },
        },
      }),
    );
  }
  const result = await resolveDID(trimmed, {});
  const body = toW3c(result);
  return res.status(httpStatus(body)).json(body);
}

app.post('/resolve', async (req, res) => {
  const did = req.body?.did;
  await handleResolve(typeof did === 'string' ? did : '', res);
});

app.get('/resolve', async (req, res) => {
  const raw = req.query.did;
  const one = Array.isArray(raw) ? raw[0] : raw;
  await handleResolve(one ?? '', res);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`uber-resolver-didwebvh-ts listening on http://0.0.0.0:${PORT}`);
});
