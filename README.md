<h1>Age Decision JS SDK</h1>

Age Decision JS SDK is a lightweight TypeScript and JavaScript client for interacting with the Age Decision API.

It provides a typed client to call health, readiness, and verification endpoints from Node.js or modern browser environments.

<hr>

<h2>Purpose</h2>

This SDK does not perform age estimation or anti-spoofing locally.

It acts as a client wrapper around an existing Age Decision API instance.

```text
Application
  → Age Decision JS SDK
  → Age Decision API
  → Age Decision Core
  → Age Decision AntiSpoof
```

<hr>

<h2>Status</h2>

Current version: <b>v1.0.0</b>

<hr>

<h2>Features</h2>

- TypeScript support
- ESM and CommonJS builds
- Browser-compatible fetch-based client
- Health check endpoint
- Readiness check endpoint
- Age verification endpoint
- Automatic request_id generation
- Automatic correlation_id generation
- Timeout handling with AbortController
- Configurable retry mechanism
- HTTP error handling

<hr>

<h2>Installation</h2>

```bash
npm install @credona/age-decision
```

The package can also be installed with Yarn or pnpm.

```bash
yarn add @credona/age-decision
```

```bash
pnpm add @credona/age-decision
```

<hr>

<h2>Usage</h2>

<h3>Create a client</h3>

```ts
import { AgeDecisionClient } from "@credona/age-decision";

const client = new AgeDecisionClient({
  baseUrl: "https://your-age-decision-api.example.com",
  timeout: 5000,
  retries: 1,
  retryDelay: 300
});
```

The SDK does not impose any API URL.

The `baseUrl` must point to your own Age Decision API instance.

<hr>

<h3>Health check</h3>

```ts
const health = await client.health();

console.log(health);
```

<hr>

<h3>Readiness check</h3>

```ts
const ready = await client.ready();

console.log(ready);
```

<hr>

<h3>Verify age</h3>

```ts
const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  country: "FR"
});

console.log(result.decision);
```

<hr>

<h3>Verify age with explicit identifiers</h3>

```ts
const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  country: "FR",
  requestId: "req-001",
  correlationId: "corr-001"
});

console.log(result.request_id);
console.log(result.correlation_id);
console.log(result.decision);
```

<hr>

<h2>Response Example</h2>

```json
{
  "request_id": "req-123",
  "correlation_id": "corr-123",
  "decision": "allow",
  "cred_score": 0.94,
  "age_check": {
    "status": "passed",
    "decision": "allow",
    "estimated_age": 76.0,
    "confidence": 0.8,
    "is_adult": true,
    "cred_decision_score": 0.94
  },
  "liveness_check": {
    "status": "passed",
    "decision": "allow",
    "confidence": 0.98,
    "is_real": true,
    "spoof_detected": false,
    "cred_antispoof_score": 0.98
  },
  "privacy": {
    "image_stored": false,
    "biometric_template_stored": false,
    "raw_image_logged": false,
    "downstream_raw_response_exposed": false,
    "retention_policy": "not_stored_by_api_gateway"
  },
  "zk_proof": {
    "zk_ready": true,
    "proof_type": "interactive_zero_knowledge_ready",
    "proof_status": "not_generated",
    "statement": "The API is ready to prove an age decision without exposing the raw image or estimated age."
  },
  "reason": null
}
```

<hr>

<h2>Error Handling</h2>

```ts
import {
  AgeDecisionClient,
  HttpError,
  TimeoutError
} from "@credona/age-decision";

const client = new AgeDecisionClient({
  baseUrl: "https://your-age-decision-api.example.com",
  timeout: 5000
});

try {
  const result = await client.verify({
    imageBase64: "base64-image",
    ageThreshold: 18
  });

  console.log(result);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error("Request timeout:", error.timeout);
  }

  if (error instanceof HttpError) {
    console.error("HTTP error:", error.status);
    console.error(error.body);
  }

  throw error;
}
```

<hr>

<h2>Configuration</h2>

| Option | Type | Default | Description |
|---|---|---|---|
| `baseUrl` | `string` | required | Base URL of the Age Decision API instance |
| `timeout` | `number` | `5000` | Request timeout in milliseconds |
| `retries` | `number` | `0` | Number of retry attempts |
| `retryDelay` | `number` | `300` | Delay between retry attempts in milliseconds |

<hr>

<h2>Development</h2>

This repository includes Docker files for local SDK development and integration testing only.

They do not represent the production deployment configuration of Credona hosted services.

- `Dockerfile.dev` builds the SDK development environment
- `docker-compose.dev.yml` runs the SDK development container
- `docker-compose.integration.yml` runs integration tests against the full Age Decision stack

<h3>Start development container</h3>

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

<h3>Enter container</h3>

```bash
docker exec -it age-decision-js sh
```

<h3>Install dependencies</h3>

```bash
npm install
```

<h3>Run unit tests</h3>

```bash
npm run test
```

<h3>Build package</h3>

```bash
npm run build
```

<h3>Check npm package content</h3>

```bash
npm run pack:check
```

<hr>

<h2>Integration Tests</h2>

Integration tests run the full stack with Docker Compose:

```text
age-decision-js
age-decision-api
age-decision-core
age-decision-antispoof
```

<h3>Run integration tests</h3>

```bash
docker compose -f docker-compose.integration.yml up --build --abort-on-container-exit --exit-code-from age-decision-js
```

<h3>Clean integration stack</h3>

```bash
docker compose -f docker-compose.integration.yml down -v --remove-orphans
```

<hr>

<h2>Package Build Output</h2>

The build generates ESM, CommonJS, and TypeScript declaration files.

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
dist/index.d.cts
```

<hr>

<h2>Publishing</h2>

The package is intended to be published to npm.

Before publishing, run:

```bash
npm run test
npm run build
npm run pack:check
```

Publish:

```bash
npm publish --access public
```

<hr>

<h2>Scope</h2>

This SDK:

- calls an Age Decision API instance
- provides typed request and response contracts
- handles request tracing, retries, timeouts and HTTP errors

It does not:

- perform local age estimation
- perform local anti-spoofing
- store images
- generate Zero-Knowledge proofs

<hr>

<h2>Roadmap</h2>

See `ROADMAP.md`.

<hr>

<h2>License</h2>

Apache License 2.0