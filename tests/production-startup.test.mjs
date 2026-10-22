import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, readFile, writeFile, cp, rm, access } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
let fixture;

before(async () => {
  fixture = await mkdtemp(path.join(os.tmpdir(), "ips-production-"));
  // Copy only runtime dependencies from the installed lockfile. No symlinks back
  // to the development tree: Vite/tsx really are unavailable in this fixture.
  const lock = JSON.parse(await readFile(path.join(root, "package-lock.json"), "utf8"));
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (!location.startsWith("node_modules/") || entry.dev) continue;
    try {
      await cp(path.join(root, location), path.join(fixture, location), { recursive: true });
    } catch (error) {
      if (!entry.optional || error.code !== "ENOENT") throw error;
    }
  }
  for (const location of ["dist", "scripts/start.mjs", "package.json"]) {
    await mkdir(path.dirname(path.join(fixture, location)), { recursive: true });
    await cp(path.join(root, location), path.join(fixture, location), { recursive: true });
  }
});

after(async () => {
  if (fixture) await rm(fixture, { recursive: true, force: true });
});

async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function withServer(extraEnv, callback) {
  const port = await freePort();
  // Synthetic config only. Never inherit the workspace's sheet URLs or secrets.
  const child = spawn(process.execPath, ["scripts/start.mjs"], {
    cwd: fixture,
    env: { NODE_ENV: "development", PORT: String(port), ...extraEnv },
    stdio: "ignore",
  });
  const exited = once(child, "exit");
  child.on("error", () => {});
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (child.exitCode !== null) break;
      try {
        if ((await fetch(`${base}/api/config`)).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    assert.ok(ready, "production server must start without devDependencies");
    await callback(base);
  } finally {
    child.kill();
    await exited;
  }
}

test("production starts without a .env file or development tooling", async () => {
  await assert.rejects(access(path.join(fixture, "node_modules/vite")));
  await assert.rejects(access(path.join(fixture, "node_modules/tsx")));
  await withServer({}, async (base) => {
    const html = await (await fetch(`${base}/`)).text();
    assert.match(html, /IPS Registries/);
    assert.match(html, /href="\/favicon.jpg"/);
    assert.doesNotMatch(html, /\/@vite\/client|\/src\/main.tsx/);
    const favicon = await fetch(`${base}/favicon.jpg`);
    assert.equal(favicon.status, 200);
    assert.match(favicon.headers.get("content-type"), /image\/jpeg/);
    const css = html.match(/href="([^"]+\.css)"/)?.[1];
    assert.ok(css, "compiled stylesheet is linked");
    assert.equal((await fetch(`${base}${css}`)).status, 200);
    assert.equal((await fetch(`${base}/results`)).status, 200);
    for (const endpoint of ["/api/implementations", "/api/vendor-results"]) {
      const response = await fetch(`${base}${endpoint}`);
      assert.equal(response.status, 500, "missing sheets must not look like empty data");
      assert.match((await response.json()).error, /Failed to fetch/);
    }
  });
});

test("production loads optional .env and preserves explicit environment precedence", async () => {
  const fromFile = "https://example.org/from-file";
  await writeFile(path.join(fixture, ".env"), [
    `IPS_RETURN_URL=${fromFile}`,
    "PORT=1",
    "NODE_ENV=development",
  ].join("\n"));
  try {
    await withServer({}, async (base) => {
      assert.equal((await (await fetch(`${base}/api/config`)).json()).ipsReturnUrl, fromFile);
    });
    await withServer({ IPS_RETURN_URL: "https://example.org/from-environment" }, async (base) => {
      assert.equal((await (await fetch(`${base}/api/config`)).json()).ipsReturnUrl,
        "https://example.org/from-environment");
    });
  } finally {
    await rm(path.join(fixture, ".env"));
  }
});
