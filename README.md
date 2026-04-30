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

<h2>Responsibility</h2>

This repository owns the typed JavaScript and TypeScript client interface for Age Decision API consumers.

<h2>Scope</h2>

It provides a typed fetch-based client for health, version, readiness, and verification endpoints.

It does not perform age estimation or anti-spoofing locally.

It does not load, download, store, or redistribute machine learning model files.

<hr>

<h2>When to use this repository</h2>

- you want to integrate Age Decision in a frontend or Node.js app
- you need typed API access
- you want quick integration

<h2>When NOT to use this repository</h2>

- you want backend orchestration
- you want direct model usage
- you want to modify decision logic

<hr>

<h2>Documentation</h2>

- Repository: https://github.com/credona/age-decision-js
- Usage: docs/usage.md
- API types: docs/types.md
- Compatibility: docs/compatibility.md
- Security: SECURITY.md
- Global architecture and ownership: https://github.com/credona/age-decision/blob/main/docs/architecture.md
- Global scoring model: https://github.com/credona/age-decision/blob/main/docs/scoring.md
- Changelog: CHANGELOG.md
- Contributing: CONTRIBUTING.md
- Global project: https://github.com/credona/age-decision

<hr>

<h2>Installation</h2>

```bash
npm install @credona/age-decision
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

<h2>Detailed scope</h2>

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

For package metadata, compatibility details, developer workflows, integration tests, and advanced setup, see `docs/usage.md`.

<hr>

<h2>License</h2>

This repository is released under the Apache License 2.0.

See LICENSE for details.
