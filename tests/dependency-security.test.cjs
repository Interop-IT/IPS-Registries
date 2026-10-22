const assert = require("node:assert/strict");
const { createRequire } = require("node:module");
const { test } = require("node:test");

// Test the actual implementations used by the build tool and file watcher,
// including nested installs, rather than an unrelated top-level dependency.
for (const parent of ["micromatch", "chokidar"]) {
  const requireFromParent = createRequire(require.resolve(parent));
  const braces = requireFromParent("braces");

  test(`${parent} uses the depth-guarded braces replacement`, () => {
    assert.equal(requireFromParent("braces/package.json").name, "@zklogic/braces");
  });

  test(`${parent} preserves normal brace expansion and compilation`, () => {
    assert.deepEqual(braces.expand("src/{pages,components}/*.{ts,tsx}"), [
      "src/pages/*.ts",
      "src/pages/*.tsx",
      "src/components/*.ts",
      "src/components/*.tsx",
    ]);
    assert.deepEqual(braces.expand("{01..03}"), ["01", "02", "03"]);
    assert.deepEqual(braces("src/{pages,components}/*.tsx"), [
      "src/(pages|components)/*.tsx",
    ]);
  });

  for (const [open, close] of [["{", "}"], ["(", ")"]]) {
    test(`${parent} safely handles deeply nested ${open}${close} patterns`, () => {
      // Below the input-length limit, but deep enough to overflow the old
      // recursive walkers. Excess nesting must be treated as literal text.
      const pattern = open.repeat(4900) + "a" + close.repeat(4900);
      assert.equal(braces.stringify(braces.parse(pattern)), pattern);
      assert.doesNotThrow(() => braces.compile(pattern));
      assert.deepEqual(braces.expand(pattern), [pattern]);
      // A caller cannot accidentally disable the safety cap.
      assert.doesNotThrow(() => braces.compile(pattern, { maxDepth: Infinity }));
    });
  }
}
