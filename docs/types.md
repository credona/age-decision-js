<h1>Age Decision JS SDK Types</h1>

This document describes the public TypeScript contracts exposed by the SDK.

<hr>

<h2>ClientOptions</h2>

```ts
interface ClientOptions {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}
```

<hr>

<h2>HealthResponse</h2>

```ts
interface HealthResponse {
  status: string;
  service: string;
  version: string;
  contract_version: string;
}
```

<hr>

<h2>ProjectVersionResponse</h2>

```ts
interface ProjectVersionResponse {
  service_name: string;
  package_name?: string;
  app_name: string;
  version: string;
  contract_version: string;
  repository: string;
  npm_package?: string;
  image?: string;
}
```

<hr>

<h2>ReadyResponse</h2>

```ts
interface ReadyResponse {
  status: string;
  service: string;
  version: string;
  contract_version: string;
  core?: ReadyServiceStatus;
  antispoof?: ReadyServiceStatus;
}
```

<hr>

<h2>VerifyRequest</h2>

```ts
interface VerifyRequest {
  imageBase64: string;
  ageThreshold?: number;
  majorityCountry?: string;
  requestId?: string;
  correlationId?: string;
}
```

<hr>

<h2>ThresholdPolicy</h2>

```ts
interface ThresholdPolicy {
  type: "minimum_age";
  value: number;
  source: "explicit" | "majority_country" | "default";
  majority_country?: string | null;
}
```

<hr>

<h2>VerifyResponse</h2>

```ts
interface VerifyResponse {
  request_id: string;
  correlation_id: string;
  decision: "allow" | "deny" | string;
  cred_global_score: number;
  age_check: AgeCheckResponse;
  liveness_check: LivenessCheckResponse;
  privacy: PrivacyMetadataResponse;
  zk_proof: ZkProofMetadataResponse;
  reason?: string | null;
}
```

<hr>

<h2>AgeCheckResponse</h2>

```ts
interface AgeCheckResponse {
  status: "passed" | "failed" | "unknown" | string;
  decision: "allow" | "deny" | string;
  reason?: string | null;
  threshold: ThresholdPolicy;
  cred_decision_score: number;
}
```

<hr>

<h2>LivenessCheckResponse</h2>

```ts
interface LivenessCheckResponse {
  status: "passed" | "failed" | "unknown" | string;
  decision: "allow" | "deny" | string;
  reason?: string | null;
  is_real?: boolean | null;
  spoof_detected?: boolean | null;
  cred_antispoof_score: number;
}
```

<hr>

<h2>PrivacyMetadataResponse</h2>

```ts
interface PrivacyMetadataResponse {
  image_stored: boolean;
  biometric_template_stored: boolean;
  raw_image_logged: boolean;
  downstream_raw_response_exposed: boolean;
  retention_policy: string;
}
```

<hr>

<h2>ZkProofMetadataResponse</h2>

```ts
interface ZkProofMetadataResponse {
  zk_ready: boolean;
  proof_type: string;
  proof_status: string;
  statement: string;
}
```

<hr>

<h2>Project metadata</h2>

<!-- BEGIN:PROJECT_METADATA -->
```json
{
  "service_name": "age-decision-js",
  "package_name": "@credona/age-decision",
  "app_name": "Age Decision JS SDK",
  "version": "2.2.0",
  "contract_version": "2.0",
  "repository": "https://github.com/credona/age-decision-js",
  "npm_package": "https://www.npmjs.com/package/@credona/age-decision"
}
```
<!-- END:PROJECT_METADATA -->

<hr>

<h2>Compatibility metadata</h2>

<!-- BEGIN:COMPATIBILITY_METADATA -->
```json
{
  "service": "age-decision-js",
  "package": "@credona/age-decision",
  "version": "2.2.0",
  "contract_version": "2.0",
  "compatible_with": {
    "age-decision-api": ">=2.0.0 <3.0.0"
  },
  "public_contract": {
    "client": "AgeDecisionClient",
    "metadata_endpoint": "/version",
    "decision_values": [
      "allow",
      "deny"
    ],
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

<h2>Score fields</h2>

<h3>cred_decision_score</h3>

Score produced by Age Decision Core.

<h3>cred_antispoof_score</h3>

Score produced by Age Decision AntiSpoof.

<h3>cred_global_score</h3>

Global API score computed from downstream scores.

It is the only global score exposed by SDK v2.

<hr>

<h2>Removed from v2 public contract</h2>

The following fields are no longer part of the public SDK contract:

- `cred_score`
- `estimated_age`
- `confidence`
- `is_adult`
- `ageMargin`
- `confidenceThreshold`
- `country`

Use `majorityCountry` instead of `country`.
