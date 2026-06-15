import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Runtime-configurable client config. Read env vars at request time so the
  // values can be changed without a rebuild (only a server restart).
  app.get("/api/config", (_req, res) => {
    res.json({
      ipsReturnUrl: resolveIpsReturnUrl(),
    });
  });

  // API route to get vendor results from Google Sheets
  app.get("/api/vendor-results", async (req, res) => {
    try {
      const results = await fetchVendorResults();
      res.json(results);
    } catch (error) {
      console.error("Error fetching vendor results:", error);
      res.status(500).json({
        error: "Failed to fetch vendor results",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API route to get IPS Implementation Registry entries from Google Sheets
  app.get("/api/implementations", async (req, res) => {
    try {
      const results = await fetchIpsImplementations();
      res.json(results);
    } catch (error) {
      console.error("Error fetching IPS implementations:", error);
      res.status(500).json({
        error: "Failed to fetch IPS implementations",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
