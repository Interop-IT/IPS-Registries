import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchVendorResults } from "./googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get vendor results from Google Sheets
  app.get("/api/vendor-results", async (req, res) => {
    try {
      const results = await fetchVendorResults();
      res.json(results);
    } catch (error) {
      console.error("Error fetching vendor results:", error);
      res.status(500).json({ 
        error: "Failed to fetch vendor results",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
