---
name: esbuild 0.28.x + vite 6 incompatibility
description: esbuild 0.28.1 (the only non-vulnerable version) breaks vite 6's dev optimizer due to browser target resolution; workaround documented.
---

## Rule
Never force vite to use esbuild 0.28.x via a global npm override. Use a scoped vite exception in `overrides` to give vite its own compatible esbuild.

## Why
esbuild 0.28.x has a behavioral change where it fails to transform destructuring for the browser targets vite 6 uses by default (`baseline-widely-available` → chrome87/edge88/firefox78/safari14 + 2 extra targets). The error is "Transforming destructuring to the configured target environment is not supported yet". This is likely a regression in esbuild 0.28.x that hasn't been patched yet (0.28.1 is the only 0.28.x release as of June 2026).

## How to apply
In package.json overrides, use this pattern to fix esbuild everywhere except vite:
```json
"overrides": {
  "esbuild": "$esbuild",
  "vite": {
    "esbuild": "^0.25.0"
  }
}
```
Keep `"esbuild": "^0.28.1"` in devDependencies. The `$esbuild` reference avoids the EOVERRIDE conflict that occurs with literal version strings.

## Remaining vulnerabilities
The vite scoped override leaves 7 vulnerabilities (vite and its dependents flagged for nested esbuild 0.25.x + drizzle-kit chain). Both advisories (GHSA-67mh-4wv8-2f99, GHSA-gv7w-rqvm-qjhr) require esbuild --serve or Deno — neither applies here. The only npm-suggested fix (vite@8.x) requires changes to protected files.
