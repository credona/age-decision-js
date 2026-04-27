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

<h2>VerifyRequest</h2>

```ts
interface VerifyRequest {
  imageBase64: string;
  ageThreshold?: number;
  ageMargin?: number;
  confidenceThreshold?: number;
  country?: string;
  requestId?: string;
  correlationId?: string;
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
  cred_score: number;
  age_check: AgeCheckResponse;
  liveness_check: LivenessCheckResponse;
  privacy: PrivacyMetadata;
  zk_proof: ZkProofMetadata;
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
  estimated_age?: number | null;
  confidence?: number | null;
  is_adult?: boolean | null;
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
  confidence?: number | null;
  is_real?: boolean | null;
  spoof_detected?: boolean | null;
  cred_antispoof_score: number;
}
```

<hr>

<h2>PrivacyMetadata</h2>

```ts
interface PrivacyMetadata {
  image_stored: boolean;
  biometric_template_stored: boolean;
  raw_image_logged: boolean;
  downstream_raw_response_exposed: boolean;
  retention_policy: string;
}
```

<hr>

<h2>ZkProofMetadata</h2>

```ts
interface ZkProofMetadata {
  zk_ready: boolean;
  proof_type: string;
  proof_status: string;
  statement: string;
}
```

<hr>

<h2>Score fields</h2>

<h3>cred_decision_score</h3>

Score produced by Age Decision Core.

<h3>cred_antispoof_score</h3>

Score produced by Age Decision AntiSpoof.

<h3>cred_global_score</h3>

Global API score computed from downstream scores.

<h3>cred_score</h3>

Temporary compatibility alias for `cred_global_score`.

New integrations should read `cred_global_score`.
