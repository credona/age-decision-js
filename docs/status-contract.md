<h1>Status contract (Age Decision JS SDK)</h1>

This document summarizes **stable typed methods** against metadata and readiness endpoints. It mirrors the gateway contract at a high level; exact server evolution remains governed by upstream OpenAPI—this repo documents how the SDK surfaces responses.

<hr>

<h2>Methods</h2>

<ul>
  <li><code>client.health()</code> — <strong>GET /health</strong></li>
  <li><code>client.ready()</code> — <strong>GET /ready</strong></li>
  <li><code>client.version()</code> — <strong>GET /version</strong></li>
</ul>

These return parsed JSON typed as below. Errors use the SDK error model in <code>docs/error-model.md</code>.

<hr>

<h2>health()</h2>

Resolved type: <strong><code>HealthResponse</code></strong>

Stable fields modeled by this SDK:

<ul>
  <li><strong>status</strong> — textual service state,</li>
  <li><strong>service</strong> — gateway service identifier,</li>
  <li><strong>version</strong> — deployment semver,</li>
  <li><strong>contract_version</strong> — advertised public contract line.</li>
</ul>

<hr>

<h2>ready()</h2>

Resolved type: <strong><code>ReadyResponse</code></strong>

Stable core fields:

<ul>
  <li><strong>status</strong>, <strong>service</strong>, <strong>version</strong>, <strong>contract_version</strong> — aggregated gateway readiness,</li>
  <li>Optional <strong>core</strong> / <strong>antispoof</strong> subtrees typed as <code>ReadyServiceStatus</code> with <strong>status</strong> plus optional metadata such as URLs where the gateway publishes them.</li>
</ul>

These responses must not be used to extract inferred age, raw confidence, internal thresholds, or raw downstream JSON beyond what the gateway documents for readiness.

<hr>

<h2>version()</h2>

Resolved type: <strong><code>ProjectVersionResponse</code></strong>

Expected keys include <strong>service_name</strong>, <strong>app_name</strong>, <strong>version</strong>, <strong>contract_version</strong>, <strong>repository</strong>, plus optional packaged metadata such as <strong>npm_package</strong> or <strong>image</strong>.

Consumers should correlate <strong>contract_version</strong> with compatibility metadata rather than inferring schema from undocumented extras.

<hr>

<h2><code>contract_version</code> behavior</h2>

The value strings returned on health, ready, and version align with ecosystem contract lines advertised for coordinated releases (same semver minor family as server metadata). The SDK exposes them verbatim as strings—it does **not** transform or downgrade them—and treats them as the consumer-facing indication of JSON contract lineage.
