import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { fetchVendorResults, fetchIpsImplementations } from "./googleSheets";

const DEFAULT_IPS_RETURN_URL =
  "https://international-patient-summary.net/content-all-ips/";

function resolveIpsReturnUrl(): string {
  const value = process.env.IPS_RETURN_URL;
  if (!value) return DEFAULT_IPS_RETURN_URL;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return value;
    }
  } catch {
    // fall through to default on invalid URL
  }
  return DEFAULT_IPS_RETURN_URL;
}

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter
// Allows up to `maxRequests` requests per `windowMs` per IP address.
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

function createRateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, RateLimitEntry>();

  // Periodically prune stale entries to avoid unbounded memory growth
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of Array.from(store.entries())) {
      if (now - entry.windowStart >= windowMs) {
        store.delete(key);
      }
    }
  }, windowMs).unref();

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";

    const now = Date.now();
    let entry = store.get(ip);

    if (!entry || now - entry.windowStart >= windowMs) {
      entry = { count: 1, windowStart: now };
      store.set(ip, entry);
    } else {
      entry.count += 1;
    }

    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000).toString());
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    next();
  };
}

// 60 requests per minute per IP for the public sheet-backed endpoints
const apiRateLimit = createRateLimiter(60, 60_000);

export async function registerRoutes(app: Express): Promise<Server> {
  // Runtime-configurable client config. Read env vars at request time so the
  // values can be changed without a rebuild (only a server restart).
  app.get("/api/config", (_req, res) => {
    res.json({
      ipsReturnUrl: resolveIpsReturnUrl(),
    });
  });

  // API route to get vendor results from Google Sheets
  app.get("/api/vendor-results", apiRateLimit, async (req, res) => {
    try {
      const results = await fetchVendorResults();
      res.json(results);
    } catch (error) {
      console.error("Error fetching vendor results:", error);
      res.status(500).json({ error: "Failed to fetch vendor results" });
    }
  });

  // API route to get IPS Implementation Registry entries from Google Sheets
  app.get("/api/implementations", apiRateLimit, async (req, res) => {
    try {
      const results = await fetchIpsImplementations();
      res.json(results);
    } catch (error) {
      console.error("Error fetching IPS implementations:", error);
      res.status(500).json({ error: "Failed to fetch IPS implementations" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
