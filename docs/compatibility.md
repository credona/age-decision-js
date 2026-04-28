<h1>Compatibility</h1>

This document describes compatibility expectations for Age Decision JS SDK.

The SDK consumes the public Age Decision API contract and exposes TypeScript types for downstream applications.

<hr>

<h2>Scope</h2>

This document applies to:

- public SDK exports
- TypeScript request types
- TypeScript response types
- HTTP client methods
- package metadata
- compatibility metadata
- npm package contents

Internal implementation details are not considered stable unless explicitly documented.

<hr>

<h2>Stable public exports</h2>

The following public exports are part of the SDK contract:

```text
AgeDecisionClient
HttpError
TimeoutError
ClientOptions
VerifyRequest
VerifyResponse
HealthResponse
ReadyResponse
ProjectVersionResponse
ErrorResponse
```

<hr>

<h2>Stable client methods</h2>

The following methods are part of the SDK contract:

```text
client.health()
client.version()
client.ready()
client.verify()
```

<hr>

<h2>Project metadata</h2>

Project metadata is stored in:

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
  "version": "2.1.0",
  "contract_version": "2.0",
  "repository": "https://github.com/credona/age-decision-js",
  "npm_package": "https://www.npmjs.com/package/@credona/age-decision"
}
```
<!-- END:PROJECT_METADATA -->

The package version in `package.json` must match `project.json`.

<hr>

<h2>Compatibility metadata</h2>

Compatibility metadata is stored in:

```text
compatibility.json
```

Generated view:

<!-- BEGIN:COMPATIBILITY_METADATA -->
```json
{
  "service": "age-decision-js",
  "package": "@credona/age-decision",
  "version": "2.1.0",
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

This file is machine-readable and checked by CI.

<hr>

<h2>Compatible API line</h2>

The SDK v2.1.0 targets Age Decision API v2.x.

The SDK expects the API to expose:

```text
GET /health
GET /version
GET /ready
POST /verify
```

<hr>

<h2>Stable request fields</h2>

The public `VerifyRequest` type exposes:

```text
imageBase64
ageThreshold
majorityCountry
requestId
correlationId
```

The SDK translates these fields into the API contract:

```text
image_base64
age_threshold
majority_country
X-Request-ID
X-Correlation-ID
```

<hr>

<h2>Stable response fields</h2>

The public `VerifyResponse` type exposes:

```text
request_id
correlation_id
decision
cred_global_score
age_check
liveness_check
privacy
zk_proof
reason
```

<hr>

<h2>Score ownership</h2>

The SDK does not produce scores.

It consumes:

```text
cred_decision_score
cred_antispoof_score
cred_global_score
```

The API owns `cred_global_score`.

Core owns `cred_decision_score`.

AntiSpoof owns `cred_antispoof_score`.

<hr>

<h2>Privacy-first contract</h2>

The SDK v2 public types must not expose:

```text
estimated age
raw age confidence
is_adult
raw liveness confidence
spoof score
downstream model internals
legacy cred_score alias
```

<hr>

<h2>Backward-compatible changes</h2>

The following changes are considered backward-compatible in v2.x:

- adding optional response fields
- adding optional client options
- adding new helper methods
- improving retry behavior without changing defaults
- improving documentation
- improving generated type declarations
- adding tests
- adding CI checks

<hr>

<h2>Breaking changes</h2>

The following changes are considered breaking:

- removing a public export
- renaming a public type
- removing a stable method
- changing request field names
- changing response field names
- changing decision values
- exposing removed sensitive fields again
- changing default behavior in a way that affects existing callers

Breaking changes should be reserved for a new major version.

<hr>

<h2>Package contents</h2>

The npm package should include:

```text
dist
README.md
LICENSE
project.json
compatibility.json
```

The npm package should not include:

```text
src
tests
.github
node_modules
coverage
Docker development files
```

<hr>

<h2>Generated documentation</h2>

The following documentation blocks are generated from `project.json` and `compatibility.json`:

```text
PROJECT_METADATA
COMPATIBILITY_METADATA
```

They are updated by:

```bash
npm run docs:generate
```

CI fails if generated documentation is not synchronized.

<hr>

<h2>Release checks</h2>

On tag release, CI verifies that the Git tag matches the version declared in `project.json`.

Example:

```text
project.json version: 2.1.0
expected Git tag: v2.1.0
```

A mismatched tag must fail the release or publish workflow.
