<h1>Age Decision JS SDK Usage</h1>

This document describes how to use the TypeScript and JavaScript SDK.

<hr>

<h2>Create a client</h2>

```ts
import { AgeDecisionClient } from "@credona/age-decision";

const client = new AgeDecisionClient({
  baseUrl: "https://your-age-decision-api.example.com",
  timeout: 5000,
  retries: 1,
  retryDelay: 300,
});
```

The SDK does not impose an API URL.

`baseUrl` must point to an Age Decision API instance.

<hr>

<h2>Health</h2>

```ts
const health = await client.health();

console.log(health.status);
console.log(health.version);
console.log(health.contract_version);
```

<hr>

<h2>Version</h2>

```ts
const version = await client.version();

console.log(version.service_name);
console.log(version.version);
console.log(version.contract_version);
```

<hr>

<h2>Readiness</h2>

```ts
const ready = await client.ready();

console.log(ready.status);
console.log(ready.version);
console.log(ready.contract_version);
```

<hr>

<h2>Verify</h2>

```ts
const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  majorityCountry: "FR",
});

console.log(result.decision);
console.log(result.cred_global_score);
console.log(result.decision_check.cred_decision_score);
console.log(result.decision_check.threshold);
console.log(result.spoof_check.cred_antispoof_score);
```

<hr>

<h2>Verify with explicit identifiers</h2>

```ts
const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  majorityCountry: "FR",
  requestId: "req-001",
  correlationId: "corr-001",
});

console.log(result.request_id);
console.log(result.correlation_id);
```

The SDK sends these values through headers:

```text
X-Request-ID
X-Correlation-ID
```

<hr>

<h2>Error handling</h2>

```ts
import {
  AgeDecisionClient,
  HttpError,
  StandardizedApiError,
  TimeoutError,
} from "@credona/age-decision";

const client = new AgeDecisionClient({
  baseUrl: "https://your-age-decision-api.example.com",
  timeout: 5000,
});

try {
  const result = await client.verify({
    imageBase64: "base64-image",
    ageThreshold: 18,
  });

  console.log(result);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error("Request timeout:", error.timeout);
  }

  if (error instanceof StandardizedApiError) {
    console.error("API contract error:", error.status, error.code);
    console.error(error.message, error.requestId, error.correlationId);
    console.error(error.body);
  }

  if (error instanceof HttpError) {
    console.error("HTTP error:", error.status);
    console.error(error.body);
  }

  throw error;
}
```

For lower-level parsing of a response body outside the client, the SDK exports <code>mapStandardizedApiError(status, rawBodyText)</code>, which returns <code>null</code> when the body is not a strict standardized gateway envelope (privacy-first key allowlist).

<hr>

<h2>Configuration</h2>

| Option       | Type     | Default  | Description                                  |
| ------------ | -------- | -------- | -------------------------------------------- |
| `baseUrl`    | `string` | required | Base URL of the Age Decision API instance    |
| `timeout`    | `number` | `5000`   | Request timeout in milliseconds              |
| `retries`    | `number` | `0`      | Number of retry attempts                     |
| `retryDelay` | `number` | `300`    | Delay between retry attempts in milliseconds |

<hr>

<h2>Development</h2>

```bash
docker compose -f docker-compose.dev.yml up -d --build
npm run fix:docker
npm run check:docker
```

<hr>

<h2>Integration tests</h2>

Integration tests run the SDK against published Age Decision Docker images.

Image versions are declared in `project.json` and synchronized into `docker-compose.integration.yml`.

```bash
docker compose -f docker-compose.integration.yml pull
docker compose -f docker-compose.integration.yml up --build --abort-on-container-exit --exit-code-from age-decision-js
docker compose -f docker-compose.integration.yml down -v --remove-orphans
```

<hr>

<h2>Public privacy contract</h2>

The SDK v2 contract does not expose:

- estimated age
- raw decision signal quality
- `is_adult`
- raw spoof signal quality
- spoof score
- downstream model details
- legacy `cred_score` alias

<hr>

<h2>Project metadata</h2>

Project metadata is declared in:

```text
project.json
```

Generated view:

<!-- BEGIN:PROJECT_METADATA -->

```json
{
  "service_name": "age-decision-js",
  "package_name": "@credona/age-decision",
  "app_name": "Age Decision JS SDK",
  "version": "2.4.0",
  "contract_version": "2.4",
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

Compatibility metadata is declared in:

```text
compatibility.json
```

Generated view:

<!-- BEGIN:COMPATIBILITY_METADATA -->

```json
{
  "service": "age-decision-js",
  "package": "@credona/age-decision",
  "version": "2.4.0",
  "contract_version": "2.4",
  "compatible_with": {
    "age-decision-api": ">=2.0.0 <3.0.0"
  },
  "public_contract": {
    "client": "AgeDecisionClient",
    "metadata_endpoint": "/version",
    "decision_values": ["allow", "deny"],
    "score_field": "cred_global_score",
    "internal_estimate_exposed": false,
    "raw_decision_signal_quality_exposed": false,
    "raw_spoof_signal_quality_exposed": false,
    "legacy_cred_score_exposed": false
  }
}
```

<!-- END:COMPATIBILITY_METADATA -->

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
