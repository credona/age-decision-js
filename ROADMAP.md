<h1>Age Decision JS SDK Roadmap</h1>

This document tracks the public roadmap of Age Decision JS SDK.

<h2>Versioning Strategy</h2>

Age Decision JS SDK follows semantic versioning:

```text
vX.Y.Z
```

Meaning:

- `X` changes for major architectural or trust model changes
- `Y` changes for feature releases
- `Z` changes for patches, automation, documentation, CI, distribution, and maintenance

Examples:

```text
v1.0.1 -> automation and distribution patch
v1.1.0 -> SDK usability and typing improvements
v2.0.0 -> trust and proof client milestone
```

<h2>Roadmap</h2>

<h3>v1.0.0 - Credona Initial Public Release</h3>

- [x] Migrate repository to Credona
- [x] Provide clean open source snapshot
- [x] Add Apache License 2.0
- [x] Add TypeScript client
- [x] Add ESM build
- [x] Add CommonJS build
- [x] Add TypeScript declaration output
- [x] Add health endpoint client
- [x] Add readiness endpoint client
- [x] Add verification endpoint client
- [x] Add automatic request_id generation
- [x] Add automatic correlation_id generation
- [x] Add timeout handling
- [x] Add retry mechanism
- [x] Add HTTP error handling
- [x] Add unit tests
- [x] Add integration test setup
- [x] Add local Docker development setup
- [x] Add npm-ready package configuration
- [x] Add README documentation

<h3>v1.0.1 - Automation and Distribution</h3>

- [x] Add GitHub Actions CI
- [x] Add automated tests on pull requests
- [x] Add automated build checks
- [x] Add npm package publishing workflow
- [x] Add automated release workflow
- [x] Add automated tag-based release notes
- [x] Add CodeQL scanning
- [x] Add Dependabot configuration
- [x] Add README badges
- [x] Add image-based integration stack
- [x] Use published GHCR images for API, Core and AntiSpoof integration tests
- [x] Align roadmap structure with core, antispoof and api repositories
- [x] Document automation workflows
- [x] Document npm publishing flow

<h3>v1.0.2 - Dependency and CI Maintenance</h3>

- [x] Update GitHub Actions
- [x] Update TypeScript
- [x] Update Vitest
- [x] Update Vite / esbuild dependency chain
- [x] Validate test suite
- [x] Validate package build
- [x] Validate package dry run
- [x] Validate integration tests

<h3>v1.1.0 - SDK API Contract Alignment</h3>

- [x] Add `cred_global_score` to verification response types
- [x] Keep `cred_score` as legacy compatibility alias
- [x] Add typed `cred_decision_score` support
- [x] Add typed `cred_antispoof_score` support
- [x] Add typed privacy metadata response
- [x] Add typed ZK-ready metadata response
- [x] Send request identifiers through headers
- [x] Add `age_margin` request support
- [x] Add `confidence_threshold` request support
- [x] Add request payload contract tests
- [x] Add request header propagation tests
- [x] Add score compatibility tests
- [x] Update README response examples

<h3>v1.x - SDK Improvements</h3>

- [ ] Add typed health response contract
- [ ] Add typed readiness response contract
- [ ] Add typed error response contracts
- [ ] Add browser file-to-base64 helper
- [ ] Add Node.js file-to-base64 helper
- [ ] Add custom fetch adapter
- [ ] Add retry strategy configuration
- [ ] Add SDK examples for Node.js
- [ ] Add SDK examples for browser usage
- [ ] Add SDK examples for Nuxt and Next.js
- [ ] Add integration tests for request_id propagation
- [ ] Add integration tests for correlation_id propagation
- [ ] Add OpenAPI-driven type generation research

<h3>v2 - Trust and Proof APIs</h3>

- [ ] Add signed verification result support
- [ ] Add reusable Credona score envelope
- [ ] Add proof verification client
- [ ] Add Zero-Knowledge proof client contracts
- [ ] Add tokenized cred reuse API support
- [ ] Add verifier-side SDK helpers
- [ ] Add proof-friendly response parsing
- [ ] Add external verification example

<h3>v3 - Developer Experience Layer</h3>

- [ ] Add React helper hooks
- [ ] Add Vue composables
- [ ] Add server-side integration examples
- [ ] Add hosted API examples for api.credona.dev
- [ ] Add framework-specific examples
- [ ] Add browser upload example
- [ ] Add Node.js CLI example
- [ ] Add production integration guide
