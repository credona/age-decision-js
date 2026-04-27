<h1>Age Decision JS SDK Usage</h1>

This document describes how to use the TypeScript and JavaScript SDK.

For global project concepts, see:

```text
https://github.com/credona/age-decision
```

<hr>

<h2>Create a client</h2>

```ts
import { AgeDecisionClient } from "@credona/age-decision";

const client = new AgeDecisionClient({
  baseUrl: "https://your-age-decision-api.example.com",
  timeout: 5000,
  retries: 1,
  retryDelay: 300
});
```

The SDK does not impose an API URL.

`baseUrl` must point to an Age Decision API instance.

<hr>

<h2>Health</h2>

```ts
const health = await client.health();

console.log(health.status);
```

<hr>

<h2>Readiness</h2>

```ts
const ready = await client.ready();

console.log(ready.status);
```

<hr>

<h2>Verify</h2>

```ts
const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  majorityCountry: "FR"
});

console.log(result.decision);
console.log(result.cred_global_score);
console.log(result.age_check.cred_decision_score);
console.log(result.age_check.threshold);
console.log(result.liveness_check.cred_antispoof_score);
```

<hr>

<h2>Verify with explicit identifiers</h2>

```ts
const result = await client.verify({
  imageBase64: "base64-image",
  ageThreshold: 18,
  majorityCountry: "FR",
  requestId: "req-001",
  correlationId: "corr-001"
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

<h2>Public privacy contract</h2>

The SDK v2 contract does not expose:

- estimated age
- raw age confidence
- `is_adult`
- raw liveness confidence
- spoof score
- downstream model details
- legacy `cred_score` alias

<hr>

<h2>Error handling</h2>

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

```bash
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec age-decision-js npm run test
docker compose -f docker-compose.dev.yml exec age-decision-js npm run build
docker compose -f docker-compose.dev.yml exec age-decision-js npm run pack:check
```

<hr>

<h2>Integration tests</h2>

Integration tests run the SDK against published Age Decision Docker images.

```bash
docker compose -f docker-compose.integration.yml pull
docker compose -f docker-compose.integration.yml up --build --abort-on-container-exit --exit-code-from age-decision-js
docker compose -f docker-compose.integration.yml down -v --remove-orphans
```

<hr>

<h2>Package output</h2>

```text
dist/index.js
dist/index.cjs
dist/index.d.ts
dist/index.d.cts
```
