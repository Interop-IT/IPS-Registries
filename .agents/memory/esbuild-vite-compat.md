---
name: esbuild 0.28.x + vite compatibility
description: vite@8 works with esbuild 0.28.x; vite@6 does not. CSS fixes required for lightningcss minifier.
---

## Rule
Use vite@8.x (not vite@6.x) to achieve zero esbuild vulnerabilities. Vite 8 is compatible with esbuild 0.28.x. Remove any `"vite": { "esbuild": ... }` scoped override from package.json.

## Why
esbuild 0.28.x has a regression where it cannot transform destructuring for the older browser targets that vite uses with `baseline-widely-available` (chrome87/edge88/firefox78/safari14). This breaks vite 6.x's dev optimizer entirely. Vite 8.x works correctly with esbuild 0.28.x without any config changes.

## Required package versions
- `vite@^8.0.0` in devDependencies
- `@vitejs/plugin-react@^6.0.0` (required for vite 8)
- `@tailwindcss/vite@^4.3.1` (vite 8 compatible: `^5.2.0 || ^6 || ^7 || ^8`)
- `@types/node@^20.19.0` (vite 8 peer dep: `^20.19.0 || >=22.12.0`)
- `esbuild@^0.28.1` in devDependencies (the non-vulnerable version)
- Global override: `"esbuild": "^0.28.1"` in package.json overrides — use the literal range that EXACTLY matches the direct `esbuild` devDependency, NOT the `$esbuild` reference form (see `$esbuild` section below for why)

## CSS fix required for vite 8 / lightningcss
Vite 8 switched from cssnano to lightningcss for CSS minification. lightningcss rejects invalid chained pseudo-element selectors (`::after::after`, `::after::before`) that Tailwind JIT generates when `after:*` utilities are used in HTML AND custom classes with `::after`/`::before` are defined in `@layer utilities`.

Fix: Move hover-elevate/active-elevate/toggle-elevate CSS rules **outside** of `@layer utilities` into unlayered plain CSS. Unlayered CSS has higher cascade priority than layered rules (correct for interactive overlays). Also change `.border.elevate-class::pseudo` selectors to `[class~="border"].elevate-class::pseudo` to prevent Tailwind from treating `border` as a variant-eligible utility in compound selectors.

## Override pattern for stale nested esbuild installs
```json
"overrides": {
  "esbuild": "^0.28.1",
  "@esbuild-kit/core-utils": { "esbuild": "^0.28.1" },
  "drizzle-kit": { "esbuild": "^0.28.1" }
}
```
When overrides are added after packages are installed, npm may leave stale nested node_modules/esbuild dirs. Fix: delete them manually, then reinstall the parent package.

## `$esbuild` override breaks adding NEW packages (npm 10.8.2)
The `"esbuild": "$esbuild"` reference form fails when installing a new dependency
whose peer graph touches esbuild (e.g. adding `vitest`, which pulls vite 8's
peers incl. `@vitejs/devtools`). npm aborts the ideal-tree build with
`Unable to resolve reference $esbuild` during `#loadPeerSet`.
**Why:** npm can't resolve the `$name` reference inside a sub-context peer set.
**Fix:** use the literal range that EXACTLY matches the direct `esbuild`
devDependency (`^0.28.1`). A non-matching literal (e.g. `0.28.1`) triggers
`EOVERRIDE: Override for esbuild@^0.28.1 conflicts with direct dependency`, so it
must match the caret range character-for-character. `^0.28.1` resolves to the
same installed version as `$esbuild`, so dev/build behavior is unchanged.
