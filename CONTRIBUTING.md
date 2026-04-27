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

<h2>Run tests</h2>

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run test
```

<hr>

<h2>Build package</h2>

```bash
docker compose -f docker-compose.dev.yml exec age-decision-js npm run build
docker compose -f docker-compose.dev.yml exec age-decision-js npm run pack:check
```

<hr>

<h2>Integration tests</h2>

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

<h2>Documentation</h2>

Use:

- README.md for the repository entry point
- docs/usage.md for SDK usage
- docs/types.md for public TypeScript contracts
- CHANGELOG.md for release history
