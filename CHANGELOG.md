<h1>Changelog</h1>

This changelog tracks changes specific to Age Decision JS SDK.

Global project direction is tracked in the central Age Decision repository.

<h2>2.6.0</h2>

<ul>
  <li>Added SDK benchmark execution workflow for API end-to-end benchmark calls.</li>
  <li>Added privacy-safe SDK benchmark report generation with aggregate latency and decision distribution.</li>
  <li>Added SDK benchmark privacy tests preventing raw payload, base64, downstream response, threshold, confidence, and estimated age exposure.</li>
  <li>Kept SDK benchmark logic limited to API calls and report generation without duplicating API business logic.</li>
  <li>Updated package, project, compatibility, and lockfile metadata to 2.6.0.</li>
  <li>Updated generated SDK usage, types, compatibility, and README examples.</li>
  <li>Validated the release through unit tests and Node syntax checks.</li>
</ul>

<hr>

<h2>2.5.0</h2>

<ul>
  <li>Hardened responseFilter with strict public contract allowlist enforcement.</li>
  <li>Added hostile payload tests ensuring removal of raw, downstream_response, internal_thresholds and hidden fields.</li>
  <li>Ensured SDK never exposes estimated_age, confidence, or internal scoring artifacts.</li>
  <li>Aligned SDK public typing with the API v2.5 public contract.</li>
  <li>Kept responseFilter as the only unsafe payload casting boundary.</li>
  <li>Added stricter response filtering for public decisions, statuses, and score bounds.</li>
  <li>Preserved SDK client behavior without adding business scoring or decision logic.</li>
  <li>Kept unsupported input types forwarded deterministically to the API.</li>
  <li>Updated generated SDK usage, types, compatibility, and README examples.</li>
  <li>Updated package, project, compatibility, and lockfile metadata to 2.5.0.</li>
  <li>Preserved privacy-first stripping of raw, confidence, estimated age, and downstream fields.</li>
  <li>Validated the release through Docker build and unit tests.</li>
</ul>

<hr>

<h2>2.4.0</h2>

<ul>
  <li>Introduced SDK application/domain structure for v2.4.0 alignment.</li>
  <li>Added public verify response filtering before returning SDK responses.</li>
  <li>Added strict SDK response filtering to strip unsafe downstream and internal fields.</li>
  <li>Added public inputType support aligned with v3 multi-input preparation.</li>
  <li>Added deterministic standardized error mapping for unsupported input types.</li>
  <li>Renamed age and liveness response types to decision check and spoof check.</li>
  <li>Centralized public decision and check status constants using const-object unions.</li>
  <li>Updated SDK documentation to use neutral public terminology.</li>
  <li>Kept SDK public contract stable while aligning with API orchestration boundaries.</li>
  <li>Preserved standardized error mapping and privacy-first response handling.</li>
  <li>Validated the refactor with build and test checks.</li>
</ul>

<hr>

<h2>2.3.0</h2>

<ul>
  <li>Added typed SDK error mapping for standardized API <code>ErrorResponse</code> in <code>AgeDecisionClient</code>.</li>
  <li>Introduced <code>StandardizedApiError</code> exposing <code>status</code>, <code>code</code>, <code>requestId</code>, <code>correlationId</code>, <code>body</code>, and stable <code>message</code>.</li>
  <li>Mapped HTTP <code>400</code> and HTTP <code>502</code> standardized gateway failures to <code>StandardizedApiError</code>.</li>
  <li>Left malformed and non-standard error bodies falling back to <code>HttpError</code>.</li>
  <li>Kept privacy-first strict envelope validation in <code>mapStandardizedApiError</code> so forbidden fields are not admitted as typed properties.</li>
  <li>Documented public SDK deprecation rules in <code>docs/deprecation-policy.md</code>.</li>
  <li>Documented the SDK error model in <code>docs/error-model.md</code>.</li>
  <li>Documented stable status client methods and <code>contract_version</code> in <code>docs/status-contract.md</code>.</li>
</ul>

<hr>

<h2>2.2.3</h2>

<ul>
  <li>Enforced documentation boundaries between global and repository-specific docs.</li>
  <li>Removed cross-repository documentation duplication.</li>
  <li>Normalized repository <code>README.md</code> scope.</li>
  <li>Normalized <code>CONTRIBUTING.md</code> to local workflows.</li>
  <li>Normalized <code>SECURITY.md</code> and <code>COMPATIBILITY.md</code> scope.</li>
  <li>Enforced absolute GitHub links only for cross-repository documentation references.</li>
  <li>Centralized global documentation in <code>age-decision</code>.</li>
</ul>

<hr>

<h2>2.2.2</h2>

<ul>
  <li>Npm publish workflow remains tag-only (<code>v*.*.*</code>).</li>
  <li>Release workflow builds GitHub release description from the matching <code>CHANGELOG.md</code> section.</li>
  <li>Release workflow validates that the Git tag matches the <code>project.json</code> version.</li>
  <li>Updated <code>tsconfig.json</code> for TypeScript 6 declaration emit compatibility.</li>
</ul>

<hr>

<h2>2.2.1</h2>

<ul>
  <li>Introduced single source of truth metadata via project.json.</li>
  <li>Synchronized package.json and compatibility.json from project metadata.</li>
  <li>Added Docker-first local validation for the SDK.</li>
  <li>Added one-command auto-fix pipeline (fix_all_docker.sh).</li>
  <li>Added one-command CI-equivalent validation (check_all_docker.sh).</li>
  <li>Added generated documentation synchronization checks.</li>
  <li>Added pre-push validation hook aligned with CI.</li>
  <li>Simplified SDK developer workflow.</li>
</ul>

<hr>

<h2>2.2.0</h2>

<ul>
  <li>Added one-command local validation.</li>
  <li>Added one-command release preparation.</li>
  <li>Reorganized developer, CI, metadata, documentation, and release scripts.</li>
  <li>Added automatic release tagging from project metadata after main CI success.</li>
  <li>Aligned GitHub release and npm publish workflows with tag-triggered automation.</li>
  <li>Updated integration stack to use Age Decision v2.2.0 downstream images.</li>
</ul>

<hr>

<h2>2.1.0</h2>

- Added centralized SDK metadata through `project.json`.
- Added package compatibility metadata through `compatibility.json`.
- Aligned `package.json` version with `project.json`.
- Added SDK compatibility metadata for Age Decision API v2.x.
- Added typed `/version` client support through `client.version()`.
- Added `ProjectVersionResponse` TypeScript contract.
- Updated `HealthResponse` and `ReadyResponse` types with `version` and `contract_version`.
- Added metadata validation through `scripts/check-project-metadata.mjs`.
- Added compatibility validation through `scripts/check-compatibility-metadata.mjs`.
- Added release metadata validation through `scripts/check-release-metadata.mjs`.
- Added generated documentation update scripts for README, usage, types and compatibility documentation.
- Added generated documentation synchronization checks in CI.
- Added Docker integration job using the v2.1.0 downstream image matrix.
- Replaced `latest` integration images with explicit v2.1.0 service image tags.
- Added package metadata files to npm package output.
- Updated Docker ignore and npm ignore rules.
- Added EditorConfig-based whitespace normalization.
- Added shared VS Code workspace settings and extension recommendations.
- Updated SDK tests for the `/version` endpoint and v2.1 metadata responses.
- Updated package dry-run validation for metadata inclusion.
- Updated CI workflow to validate metadata, generated documentation, build, unit tests, package content and Docker integration.

<hr>

<h2>2.0.0</h2>

- Clarified SDK scope as a pure HTTP client.
- Explicitly documented that the SDK does not perform local inference.
- Explicitly documented that the SDK does not load, download, store, or redistribute model binaries.
- Clarified that model lifecycle is handled by downstream services (Core and AntiSpoof).
- Updated integration test documentation to reflect runtime model download via Docker volumes.
- Improved README clarity for integration testing and architecture boundaries.
- Introduced SDK support for the privacy-first Age Decision API v2 contract.
- Replaced `country` request field with `majorityCountry`.
- Removed `ageMargin` and `confidenceThreshold` request fields.
- Removed legacy `cred_score` from `VerifyResponse`.
- Removed `estimated_age`, raw age confidence, and `is_adult` from `AgeCheckResponse`.
- Removed raw liveness confidence from `LivenessCheckResponse`.
- Added `ThresholdPolicy` to `AgeCheckResponse`.
- Kept `cred_global_score` as the only global Credona score.
- Updated unit tests for the v2 request and response contract.
- Updated README and SDK documentation.

<hr>

<h2>1.1.1</h2>

- Documentation structure simplified.
- Repository README reduced to a concise entry point.
- SDK usage moved to docs/usage.md.
- Type contracts moved to docs/types.md.
- Local roadmap removed in favor of the central roadmap.

<hr>

<h2>1.1.0</h2>

- Added `cred_global_score` to verification response types.
- Kept `cred_score` as a compatibility alias.
- Added typed `cred_decision_score` support.
- Added typed `cred_antispoof_score` support.
- Added typed privacy metadata response.
- Added typed ZK-ready metadata response.
- Sent request identifiers through headers.
- Added `age_margin` request support.
- Added `confidence_threshold` request support.
- Added request payload contract tests.
- Added request header propagation tests.
- Added score compatibility tests.
- Updated response documentation.

<hr>

<h2>1.0.2</h2>

- Updated GitHub Actions.
- Updated TypeScript.
- Updated Vitest.
- Updated Vite and esbuild dependency chain.
- Validated test suite.
- Validated package build.
- Validated package dry run.
- Validated integration tests.

<hr>

<h2>1.0.1</h2>

- Added CI workflow.
- Added package build checks.
- Added npm publishing workflow.
- Added release workflow.
- Added CodeQL scanning.
- Added Dependabot configuration.
- Added image-based integration stack.
- Used published GHCR images for integration tests.

<hr>

<h2>1.0.0</h2>

- Initial public release.
- Added TypeScript client.
- Added ESM build.
- Added CommonJS build.
- Added TypeScript declaration output.
- Added health endpoint client.
- Added readiness endpoint client.
- Added verification endpoint client.
- Added request identifier generation.
- Added timeout handling.
- Added retry mechanism.
- Added HTTP error handling.
- Added unit tests.
- Added npm package configuration.
