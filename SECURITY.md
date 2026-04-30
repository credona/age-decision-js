<h1>Security Policy</h1>

This document covers repository-specific security constraints for Age Decision JS SDK.

For ecosystem-wide policy and coordinated disclosure guidance, see:
https://github.com/credona/age-decision/blob/main/SECURITY.md

<hr>

<h2>Local security scope</h2>

Security reports in this repository may concern:

- client request and header handling
- retry, timeout, and error-surface behavior
- accidental leakage through thrown or serialized errors
- package publishing metadata and integrity
- example code that could encourage unsafe usage

<hr>

<h2>Local privacy constraints</h2>

The SDK should not:

- persist image payloads by default
- expose removed sensitive fields in public types
- log raw image bytes or base64 payloads in helpers
- embed secrets or tokens in distributed package artifacts
- claim to perform local model inference
