---
name: Stale dev server after dependency merges
description: ERR_MODULE_NOT_FOUND for vite internal dep-*.js chunks after a vite upgrade merges under a running dev server
---

# Stale dev server after a dependency upgrade merges

Symptom: the running app throws `Error [ERR_MODULE_NOT_FOUND]: Cannot find module
.../node_modules/vite/dist/node/chunks/dep-XXXX.js` (often during an HMR update),
even though the on-disk vite dist is intact and contains no such `dep-*.js` files.

Cause: the dev workflow (`npm run dev` via tsx) was started while an OLDER vite
version was installed. A later merged task upgraded vite on disk, deleting the old
internal chunk files. The long-lived process still references the old chunk hashes
and fails to lazily load them.

**Why:** node_modules can change underneath a running process when a task merges a
dependency upgrade; the post-merge script does not restart the dev server.

**How to apply:** When you see ERR_MODULE_NOT_FOUND for vite/esbuild internal
chunks (`dep-*.js`, mismatched hash) and the on-disk package looks correct, just
restart the `Start application` workflow — do NOT reinstall or edit overrides.
Confirm by triggering an HMR (touch a client file) and checking fresh logs via
refresh_all_logs.
