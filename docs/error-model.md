<h1>Error model (Age Decision JS SDK)</h1>

This document describes how <code>AgeDecisionClient</code> surfaces HTTP failures after v2.3. It applies to SDK behavior only; gateway and service error catalogs live with those deployments.

<hr>

<h2>Exceptions hierarchy</h2>

<ul>
  <li><strong><code>AgeDecisionError</code></strong> — base type for typed client failures.</li>
  <li><strong><code>StandardizedApiError</code></strong> — strict gateway <strong>ErrorResponse</strong> mapping for selected HTTP statuses (see below).</li>
  <li><strong><code>HttpError</code></strong> — generic HTTP failure with raw body text when standardized mapping does not apply.</li>
  <li><strong><code>TimeoutError</code></strong> — request aborted due to configured client timeout (not tied to HTTP status).</li>
</ul>

<hr>

<h2>ErrorResponse mapping</h2>

Gateways may return failures shaped as:

<pre>
request_id / correlation_id / error: { code, message }
</pre>

<code>mapStandardizedApiError(status, rawBodyText)</code> parses this envelope **only** when:

<ul>
  <li><code>status</code> is <strong>400</strong> or <strong>502</strong>; and</li>
  <li>the body is JSON whose object keys match the allowlist exactly (no extra keys at the root or under <code>error</code>); and</li>
  <li><code>request_id</code>, <code>correlation_id</code>, <code>error.code</code>, and <code>error.message</code> are strings as expected.</li>
</ul>

When that passes, <code>AgeDecisionClient</code> throws <code>StandardizedApiError</code> with:

<ul>
  <li><code>status</code> — HTTP status,</li>
  <li><code>code</code> / correlated <code>message</code> (via <code>Error.message</code>) from <code>error</code>,</li>
  <li><code>requestId</code> / <code>correlationId</code>,</li>
  <li><code>body</code> — original response body string (JSON as returned).</li>
</ul>

Malformed JSON, unexpected keys (including benign extras), incompatible types, other HTTP statuses, or non-gateway bodies yield <code>null</code> so the client raises <strong><code>HttpError</code></strong> instead.

<hr>

<h2>StandardizedApiError behavior</h2>

Use <code>instanceof StandardizedApiError</code> to branch on standardized gateway failures. The SDK preserves <strong>only</strong> the fields validated above—it does **not** attach inferred ages, biometric confidence payloads, undocumented score blobs, thresholds, verbatim upstream payloads beyond the constrained body string, stack traces from servers, or framework trace arrays.

Retries: <code>StandardizedApiError</code> with <code>status &gt;= 500</code> participates in retry policy like <code>HttpError</code> for transient server-class failures.

<hr>

<h2>HttpError fallback</h2>

<code>HttpError</code> carries <code>status</code>, a short <code>message</code> (typically body text when present else status text), and <code>body</code> holding the raw text body string. Consumers must treat untyped bodies cautiously—they are not subjected to forbidden-field stripping because they did not satisfy strict mapping.

<hr>

<h2>TimeoutError behavior</h2>

<code>TimeoutError</code> is emitted when fetch aborts after the configured <code>ClientOptions.timeout</code> (default 5000 ms). It exposes <code>timeout</code> in milliseconds. It is independent of HTTP status codes and is eligible for retry when retries are configured.

<hr>

<h2>Forbidden fields (strict mapping)</h2>

For <code>StandardizedApiError</code>, the parser accepts **only** root keys <code>request_id</code>, <code>correlation_id</code>, and <code>error</code>, and only <code>code</code> and <code>message</code> inside <code>error</code>. Any additional property—such as <code>detail</code>, <code>errors</code>, trace arrays, stack fields, or nested diagnostic objects—causes rejection and <code>HttpError</code> fallback, keeping typed properties aligned with privacy-first gateway contracts.

Constants <code>STANDARDIZED_GATEWAY_ERROR_KEYS</code> and <code>STANDARDIZED_GATEWAY_ERROR_DETAIL_KEYS</code> in the published types mirror that allowlist for reference.
