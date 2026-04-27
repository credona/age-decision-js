<h1>Changelog</h1>

This changelog tracks changes specific to Age Decision JS SDK.

Global project direction is tracked in the central Age Decision repository.

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
