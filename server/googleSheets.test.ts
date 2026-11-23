// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

const csv = [
  "Company*,Product Name,Primary Contact*,Contact Email*,Primary Link*,Production / Development*,Validation Event*,Year*,Actor*",
  "Example Vendor,Example Product,Example Person,person@example.test,https://example.test,Production,Example Event,2026,Content Creator",
  "No Event,,,,,Development,,,",
].join("\n");

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("vendor sheet importer", () => {
  it.each([
    "https://docs.google.com/spreadsheets/d/example/edit?gid=931424222",
    "https://docs.google.com/spreadsheets/d/example/edit#gid=931424222",
  ])("reads the specified tab and retains entries without validation details", async (url) => {
    vi.stubEnv("VENDOR_RESULTS_SHEETS_URL", url);
    const fetchMock = vi.fn().mockResolvedValue(new Response(csv));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchVendorResults } = await import("./googleSheets");

    const results = await fetchVendorResults();
    expect(fetchMock.mock.calls[0][0]).toContain("gid=931424222");
    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({
      company: "Example Vendor",
      product: "Example Product",
      primaryContact: "Example Person",
      contactInfo: "person@example.test",
      website: "https://example.test",
      status: "Production",
      event: "Example Event",
      year: "2026",
      actor: "Content Creator",
    });
    expect(results[1]).toMatchObject({ company: "No Event", status: "Development", event: "", actor: "", year: "" });
  });

  it("does not fall back to a different tab when the specified tab fails", async () => {
    vi.stubEnv("VENDOR_RESULTS_SHEETS_URL", "https://docs.google.com/spreadsheets/d/example/edit?gid=42");
    const fetchMock = vi.fn().mockImplementation(async () => new Response("Not found", { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchVendorResults } = await import("./googleSheets");
    await expect(fetchVendorResults()).rejects.toThrow("HTTP 404");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([url]) => url.includes("gid=42"))).toBe(true);
  });

  it("rejects an invalid tab id instead of silently reading the default tab", async () => {
    vi.stubEnv("VENDOR_RESULTS_SHEETS_URL", "https://docs.google.com/spreadsheets/d/example/edit?gid=bad");
    const { fetchVendorResults } = await import("./googleSheets");
    await expect(fetchVendorResults()).rejects.toThrow("Invalid vendor sheet gid");
  });

  it("reports a missing company column instead of returning an empty registry", async () => {
    vi.stubEnv("VENDOR_RESULTS_SHEETS_URL", "example");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Unexpected Header\nvalue")));
    const { fetchVendorResults } = await import("./googleSheets");
    await expect(fetchVendorResults()).rejects.toThrow("missing a Company column");
  });
});
