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

It provides a typed fetch-based client for health, version, readiness, and verification endpoints.

It does not perform age estimation or anti-spoofing locally.

It does not load, download, store, or redistribute machine learning model files.

<hr>

<h2>Documentation</h2>

- Repository: https://github.com/credona/age-decision-js
- Usage: docs/usage.md
- API types: docs/types.md
- Compatibility: docs/compatibility.md
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
  retryDelay: 300,
});

const version = await client.version();

console.log(version.version);
console.log(version.contract_version);

const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  majorityCountry: "FR",
});

console.log(result.decision);
console.log(result.cred_global_score);
```

<hr>

<h2>Developer workflow</h2>

Start the SDK development container:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Run auto-fix and validation through Docker:

```bash
npm run fix:docker
npm run check:docker
```

Run the full local check inside the container:

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run check:all
```

Prepare a release locally:

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run release:prepare
```

<hr>

<h2>Integration tests</h2>

Integration tests run the SDK against published Docker images for:

- Age Decision Core
- Age Decision AntiSpoof
- Age Decision API

The image versions are declared in `project.json` and synchronized into `docker-compose.integration.yml`.

Run integration tests:

```bash
docker compose -f docker-compose.integration.yml down -v --remove-orphans
docker compose -f docker-compose.integration.yml pull
docker compose -f docker-compose.integration.yml up --build --abort-on-container-exit --exit-code-from age-decision-js
docker compose -f docker-compose.integration.yml down -v --remove-orphans
```

<hr>

<h2>Project metadata</h2>

Project metadata is declared in `project.json`.

<!-- BEGIN:PROJECT_METADATA -->

```json
{
  "service_name": "age-decision-js",
  "package_name": "@credona/age-decision",
  "app_name": "Age Decision JS SDK",
  "version": "2.2.2",
  "contract_version": "2.2",
  "repository": "https://github.com/credona/age-decision-js",
  "npm_package": "https://www.npmjs.com/package/@credona/age-decision",
  "license": "Apache-2.0",
  "docker": {
    "dev": {
      "dockerfile": "Dockerfile.dev",
      "image": "age-decision-js-dev",
      "title": "Age Decision JS SDK Dev",
      "description": "Development image for the Age Decision JavaScript and TypeScript SDK."
    }
  },
  "integration": {
    "age-decision-core": "2.2.2",
    "age-decision-antispoof": "2.2.2",
    "age-decision-api": "2.2.2"
  }
}
```

<!-- END:PROJECT_METADATA -->

<hr>

<h2>Compatibility metadata</h2>

Compatibility metadata is declared in `compatibility.json`.

<!-- BEGIN:COMPATIBILITY_METADATA -->

```json
{
  "service": "age-decision-js",
  "package": "@credona/age-decision",
  "version": "2.2.2",
  "contract_version": "2.2",
  "compatible_with": {
    "age-decision-api": ">=2.0.0 <3.0.0"
  },
  "public_contract": {
    "client": "AgeDecisionClient",
    "metadata_endpoint": "/version",
    "decision_values": ["allow", "deny"],
    "score_field": "cred_global_score",
    "estimated_age_exposed": false,
    "raw_age_confidence_exposed": false,
    "raw_liveness_confidence_exposed": false,
    "legacy_cred_score_exposed": false
  }
}
```

<!-- END:COMPATIBILITY_METADATA -->

<hr>

<h2>Scope</h2>

This SDK:

- calls an Age Decision API instance
- provides typed request and response contracts
- handles request tracing
- handles timeouts
- handles retries
- exposes HTTP errors
- exposes typed project version metadata

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

<h2>Package output</h2>

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
dist/index.d.cts
project.json
compatibility.json
README.md
LICENSE
```

<hr>

<h2>License</h2>

This repository is released under the Apache License 2.0.

See LICENSE for details.
