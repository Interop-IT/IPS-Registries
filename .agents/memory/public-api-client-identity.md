---
name: Public API client identity
description: Security tradeoff for rate limiting behind an unverified reverse proxy.
---

Use transport peer identity for public API abuse controls until a trusted proxy topology is verified. Shared limits for visitors behind the same proxy are an accepted security tradeoff.

**Why:** Raw forwarding headers let an unauthenticated caller rotate identities and bypass throttling. No verified proxy trust configuration was available when choosing the conservative approach.

**How to apply:** Do not switch to raw forwarding headers or broadly trust all proxies to recover per-visitor limits. First verify which proxies and hops are trusted, then add spoofing regression coverage for that topology.
