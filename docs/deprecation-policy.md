<h1>Deprecation policy (public SDK contract)</h1>

This document applies to stable exports of <code>@credona/age-decision</code> (types, classes, and methods documented for application use). It is scoped to the SDK repository only.

<hr>

<h2>Semantic versioning</h2>

The package follows semantic versioning via <code>project.json</code> / <code>package.json</code>. Breaking changes to the documented public surface normally require a **major** version bump.

<hr>

<h2>Deprecated surface before removal</h2>

When a public type, class, method, or field is scheduled for removal, it remains documented in usage and type reference material until removal ships, together with changelog guidance pointing to replacements.

<hr>

<h2>Major vs patch for removals</h2>

Removing or renaming exported symbols documented as stable—for example <code>AgeDecisionClient</code>, public types under <code>types</code>, or exported error constructors—normally requires a **major** bump unless explicitly marked experimental or internal in published docs.

Purely internal module paths, non-exported helpers, build wiring, or repo-only scripts may change outside that rule provided they never appeared in stable public docs or compatibility lists.

<hr>

<h2>Privacy leaks</h2>

If an export or documented behavior unintentionally routed privacy-sensitive payloads into errors or surfaced raw downstream diagnostics (estimated age snapshots, undisclosed biometric confidence blobs, undisclosed cumulative scores in error paths, verbatim upstream bodies, stack traces), corrections ship as urgently as versioning policy allows—they are **not** held behind a deprecation period.
