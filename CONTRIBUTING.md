<h1>Contributing to Age Decision JS SDK</h1>

This repository contains the TypeScript and JavaScript SDK.

For global contribution rules, see:

```text
https://github.com/credona/age-decision/blob/main/CONTRIBUTING.md
```

<hr>

<h2>Local setup</h2>

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

<hr>

<h2>Developer workflow</h2>

Run auto-fix and full validation through Docker:

```bash
npm run fix:docker
npm run check:docker
```

Run the complete local validation command inside the container:

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run check:all
```

Prepare a release locally:

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run release:prepare
```

<hr>

<h2>Build and tests</h2>

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run build
docker compose -f docker-compose.dev.yml exec age-decision-js npm run test
docker compose -f docker-compose.dev.yml exec age-decision-js npm run pack:check
```

<hr>

<h2>Generated files</h2>

Some files are synchronized from `project.json` and `compatibility.json`.

This includes:

- `package.json`
- `compatibility.json`
- documentation blocks
- `docker-compose.integration.yml`

Use:

```bash
npm run fix:docker
```

Do not edit generated blocks manually.

Generated blocks are delimited by comments such as:

```text
<!-- BEGIN:PROJECT_METADATA -->
<!-- END:PROJECT_METADATA -->
```

<hr>

<h2>Integration tests</h2>

Integration image versions are declared in `project.json`.

The integration compose file is synchronized automatically.

Run:

```bash
docker compose -f docker-compose.integration.yml pull
docker compose -f docker-compose.integration.yml up --build --abort-on-container-exit --exit-code-from age-decision-js
docker compose -f docker-compose.integration.yml down -v --remove-orphans
```

<hr>

<h2>Contribution scope</h2>

Good SDK contributions include:

- TypeScript contract improvements
- request tracing improvements
- timeout handling improvements
- retry behavior improvements
- typed error responses
- Node.js helper utilities
- browser helper utilities
- framework examples
- integration tests
- developer workflow improvements
- release automation improvements

<hr>

<h2>Rules</h2>

Do not commit:

- npm tokens
- credentials
- raw user images
- local build artifacts
- generated package tarballs
- node_modules
- production secrets

<hr>

<h2>Project metadata policy</h2>

Project identity metadata must be edited in:

```text
project.json
```

Compatibility metadata is synchronized from:

```text
project.json
```

The package version in `package.json` must match `project.json`.

Release tags must match the version declared in `project.json`.

Example:

```text
project.json version: 2.2.1
Git tag: v2.2.1
```

<hr>

<h2>Documentation</h2>

Use:

- README.md for the repository entry point
- docs/usage.md for SDK usage
- docs/types.md for public TypeScript contracts
- docs/compatibility.md for compatibility and contract stability rules
- CHANGELOG.md for release history
