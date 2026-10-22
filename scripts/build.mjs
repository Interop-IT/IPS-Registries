import { build } from "esbuild";

await build({
  entryPoints: ["server/index.ts"],
  platform: "node",
  packages: "external",
  bundle: true,
  format: "esm",
  outdir: "dist",
  // Remove the development-only import graph, not just its execution branch.
  define: { "process.env.NODE_ENV": '"production"' },
});
