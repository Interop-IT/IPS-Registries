---
name: Dependency remediation constraints
description: Why the build dependencies use a braces fork and selector-parser override
---

Keep Tailwind 3 during dependency security work unless a styling migration is explicitly requested. Its latest compatible release still depends on unpatched `braces` and an affected selector-parser major.

**Why:** Upstream `braces` has no release fixing the deeply nested pattern stack-exhaustion advisory. Updating the parents alone cannot eliminate it. A Tailwind major migration would unnecessarily widen a dependency-fix task.

**How to apply:** Use a depth-guarded, API-compatible braces replacement for both micromatch and chokidar, and test normal expansions plus deeply nested braces and parentheses. The chosen fork was compared against upstream source to confirm the nesting guard. Keep the selector-parser security override until compatible parent releases permit the fixed major.
