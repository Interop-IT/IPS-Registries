// @vitest-environment node
import express from "express";
import { request } from "node:http";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./googleSheets", () => ({
  fetchVendorResults: vi.fn(async () => []),
  fetchIpsImplementations: vi.fn(async () => []),
}));

describe("public API rate limiting", () => {
  let server: Server;
  let port: number;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    const { registerRoutes } = await import("./routes");
    const app = express();
    // Even a later Express proxy setting must not make raw headers trusted.
    app.set("trust proxy", true);
    server = await registerRoutes(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    port = (server.address() as AddressInfo).port;
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => error ? reject(error) : resolve()),
    );
  });

  function get(path: string, forwardedFor?: string, localAddress = "127.0.0.1") {
    return new Promise<{ status: number; retryAfter?: string; body: string }>((resolve, reject) => {
      const req = request({
        hostname: "127.0.0.1",
        port,
        path,
        localAddress,
        headers: forwardedFor === undefined ? {} : { "X-Forwarded-For": forwardedFor },
      }, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { body += chunk; });
        res.on("end", () => resolve({
          status: res.statusCode!,
          retryAfter: res.headers["retry-after"],
          body,
        }));
      });
      req.on("error", reject);
      req.end();
    });
  }

  it("shares the 60-request budget across routes despite rotating forwarded headers", async () => {
    const paths = ["/api/config", "/api/vendor-results", "/api/implementations"];
    for (let i = 0; i < 60; i++) {
      expect((await get(paths[i % paths.length], `198.51.100.${i}, 203.0.113.1`)).status).toBe(200);
    }

    const { fetchVendorResults, fetchIpsImplementations } = await import("./googleSheets");
    for (const path of paths) {
      const response = await get(path, "192.0.2.123");
      expect(response.status).toBe(429);
      expect(response.retryAfter).toBe("60");
      expect(JSON.parse(response.body)).toEqual({
        error: "Too many requests. Please try again later.",
      });
    }
    // Rejected calls never reach the sheet-backed handlers.
    expect(fetchVendorResults).toHaveBeenCalledTimes(20);
    expect(fetchIpsImplementations).toHaveBeenCalledTimes(20);
  });

  it("uses the same budget with missing, empty, or malformed forwarded headers", async () => {
    for (let i = 0; i < 60; i++) {
      expect((await get("/api/config")).status).toBe(200);
    }
    for (const header of [undefined, "", "not-an-ip", " , ", "198.51.100.1"]) {
      expect((await get("/api/config", header)).status).toBe(429);
    }
    // A genuinely different transport peer retains its own budget, even when
    // claiming the same forwarded address as the blocked peer.
    expect((await get("/api/config", "198.51.100.1", "127.0.0.2")).status).toBe(200);
  });

  it("allows requests again when the one-minute window expires", async () => {
    const now = Date.now();
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    for (let i = 0; i < 60; i++) {
      expect((await get("/api/config")).status).toBe(200);
    }
    expect((await get("/api/config")).status).toBe(429);
    clock.mockReturnValue(now + 60_000);
    expect((await get("/api/config")).status).toBe(200);
  });
});
