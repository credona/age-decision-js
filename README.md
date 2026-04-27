<h1>Age Decision JS SDK</h1>

<p>
  <img src="https://img.shields.io/github/actions/workflow/status/credona/age-decision-js/ci.yml?branch=main&label=CI" alt="CI">
  <img src="https://img.shields.io/github/actions/workflow/status/credona/age-decision-js/codeql.yml?branch=main&label=CodeQL" alt="CodeQL">
  <img src="https://img.shields.io/github/v/release/credona/age-decision-js" alt="Release">
  <img src="https://img.shields.io/npm/v/@credona/age-decision" alt="npm">
  <img src="https://img.shields.io/npm/dm/@credona/age-decision" alt="npm downloads">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="License">
</p>

Age Decision JS SDK is a TypeScript and JavaScript client for the Age Decision API.

It provides a typed fetch-based client for health, readiness and verification endpoints.

It does not perform age estimation or anti-spoofing locally.

It does not load, download, store, or redistribute machine learning model files.

<hr>

<h2>Documentation</h2>

- Usage: docs/usage.md
- API types: docs/types.md
- Changelog: CHANGELOG.md
- Contributing: CONTRIBUTING.md
- Global project: https://github.com/credona/age-decision

<hr>

<h2>Installation</h2>

```bash
npm install @credona/age-decision
```

```bash
yarn add @credona/age-decision
```

```bash
pnpm add @credona/age-decision
```

<hr>

<h2>Quickstart</h2>

```ts
import { AgeDecisionClient } from "@credona/age-decision";

const client = new AgeDecisionClient({
  baseUrl: "https://your-age-decision-api.example.com",
  timeout: 5000,
  retries: 1,
  retryDelay: 300
});

const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  country: "FR"
});

console.log(result.decision);
console.log(result.cred_global_score);
```

<hr>

<h2>Scope</h2>

This SDK:

- calls an Age Decision API instance
- provides typed request and response contracts
- handles request tracing
- handles timeouts
- handles retries
- exposes HTTP errors

It does not:

- perform local age estimation
- perform local anti-spoofing
- load model files
- download model files
- redistribute model files
- store images
- generate Zero-Knowledge proofs
- replace certified legal identity checks
- perform face recognition

<hr>

<h2>Integration tests</h2>

Integration tests start the published Docker images for:

- Age Decision Core
- Age Decision AntiSpoof
- Age Decision API

Model files are downloaded at test runtime into Docker volumes for the downstream services.

The SDK does not download, load, or manage model files.

Run integration tests:

```bash
docker compose -f docker-compose.integration.yml down -v --remove-orphans
docker compose -f docker-compose.integration.yml pull
docker compose -f docker-compose.integration.yml up --build --abort-on-container-exit
```

<hr>

<h2>License</h2>

This repository is released under the Apache License 2.0.

See LICENSE for details.
