import {
  vendorResultSchema,
  ipsImplementationSchema,
  type VendorResult,
  type IpsImplementation,
} from "@shared/schema";

/**
 * Extracts the spreadsheet ID from a Google Sheets URL, or accepts a bare ID.
 *
 * @param url - A full Sheets URL or a raw sheet ID.
 * @returns The extracted sheet ID.
 * @throws If the value is not a recognizable URL or ID.
 */
function extractSheetId(url: string): string {
  let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]+$/.test(url.trim())) return url.trim();
  throw new Error(`Invalid Google Sheets URL: ${url}`);
}

/**
 * Parses a CSV document into rows of string cells, correctly handling quoted
 * fields that contain commas, escaped quotes, and embedded newlines.
 *
 * @param csvText - The raw CSV text.
 * @returns A 2D array of rows and cell values.
 */
function parseCSVDocument(csvText: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];

    if (inQuotes) {
      if (ch === '"') {
        if (csvText[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(current);
      current = "";
    } else if (ch === "\n" || ch === "\r") {
      // CRLF: skip the \n after \r
      if (ch === "\r" && csvText[i + 1] === "\n") i++;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += ch;
    }
  }

  // Flush last field/row
  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

// Outbound fetch timeout in milliseconds (15 seconds per attempt)
const FETCH_TIMEOUT_MS = 15_000;

// Cache TTL: 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchSheetCsv(sheetsUrl: string, envVarName: string): Promise<string[][]> {
  if (!sheetsUrl) {
    throw new Error(`${envVarName} environment variable is not set`);
  }

  const sheetId = extractSheetId(sheetsUrl);
  const urls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
  ];

  let lastError: Error | null = null;

  for (const csvUrl of urls) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(csvUrl, {
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; IPSRegistry/1.0)" },
      });
      const csvText = await response.text();
      if (csvText.includes("<!DOCTYPE html>") || csvText.includes("<HTML>")) {
        lastError = new Error("Sheet is not publicly accessible or does not exist");
        continue;
      }
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        continue;
      }
      const rows = parseCSVDocument(csvText);
      if (rows.length > 0) return rows;
      lastError = new Error("Sheet appears to be empty");
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("Failed to fetch sheet data");
}

// ---------------------------------------------------------------------------
// Generic cache + request-coalescing wrapper
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

/**
 * Wraps a fetcher with in-memory TTL caching and request coalescing so repeated
 * or concurrent calls don't trigger redundant upstream Google Sheets fetches.
 *
 * @param fetcher - The underlying data fetcher to memoize.
 * @returns A cached fetch function sharing one in-flight request at a time.
 */
function makeSheetFetcher<T>(fetcher: () => Promise<T>): () => Promise<T> {
  let cache: CacheEntry<T> | null = null;
  let inFlight: Promise<T> | null = null;

  return async function cachedFetch(): Promise<T> {
    // Return cached data if still fresh
    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      return cache.data;
    }

    // Coalesce concurrent requests: if a fetch is already in flight, share it
    if (inFlight) {
      return inFlight;
    }

    inFlight = fetcher().then(
      (data) => {
        cache = { data, fetchedAt: Date.now() };
        inFlight = null;
        return data;
      },
      (err) => {
        inFlight = null;
        throw err;
      },
    );

    return inFlight;
  };
}

/**
 * Builds a lookup from normalized (lowercased, trimmed, trailing-* removed)
 * header name to its column index.
 *
 * @param headers - The header row cells.
 * @returns A map of normalized header name to column index.
 */
function buildColumnMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headers.forEach((h, i) => {
    map[h.toLowerCase().replace(/\*$/, "").trim()] = i;
  });
  return map;
}

/**
 * Returns the first non-empty cell value matching any of the candidate column
 * names, allowing flexible/aliased header names across sheets.
 *
 * @param values - The row's cell values.
 * @param columnMap - Map of normalized header name to column index.
 * @param possibleNames - Candidate column names to try, in priority order.
 * @returns The trimmed value, or `undefined` if none matched.
 */
function getValue(
  values: string[],
  columnMap: Record<string, number>,
  possibleNames: string[],
): string | undefined {
  for (const name of possibleNames) {
    const idx = columnMap[name.toLowerCase()];
    if (idx !== undefined && values[idx] !== undefined && values[idx].trim() !== "") {
      return values[idx].trim();
    }
  }
  return undefined;
}

// ---------- Vendor Results (existing experience) ----------

async function _fetchVendorResults(): Promise<VendorResult[]> {
  // Prefer dedicated vendor-results URL; fall back to GOOGLE_SHEETS_URL for backward compat
  const sheetsUrl =
    process.env.VENDOR_RESULTS_SHEETS_URL || process.env.GOOGLE_SHEETS_URL || "";
  const rows = await fetchSheetCsv(sheetsUrl, "VENDOR_RESULTS_SHEETS_URL");

  if (rows.length === 0) return [];
  const headers = rows[0];
  const columnMap = buildColumnMap(headers);

  const results: VendorResult[] = [];
  let skipped = 0;
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i];
    if (!values.some((v) => v && v.trim())) continue;

    const result: VendorResult = {
      company: getValue(values, columnMap, ["company", "vendor", "organization"]) || "",
      profile:
        getValue(values, columnMap, ["ips profile", "profile", "ihe profile", "iheprofile"]) || "",
      actor: getValue(values, columnMap, ["actor"]) || "",
      year: getValue(values, columnMap, ["year"]) || "",
      event: getValue(values, columnMap, ["event", "connectathon", "location"]) || "",
      website: getValue(values, columnMap, [
        "link to company website",
        "website",
        "company website",
        "url",
        "link",
      ]),
      product: getValue(values, columnMap, ["product", "product name"]),
      primaryContact: getValue(values, columnMap, [
        "primary contact",
        "contact",
        "primary_contact",
        "primarycontact",
      ]),
      contactInfo: getValue(values, columnMap, [
        "contact info",
        "contact_info",
        "contactinfo",
        "email",
        "phone",
      ]),
    };
    if (!result.company) continue;
    const parsed = vendorResultSchema.safeParse(result);
    if (!parsed.success) {
      skipped++;
      continue;
    }
    results.push(parsed.data);
  }

  if (skipped > 0) {
    console.warn(`Skipped ${skipped} invalid vendor result row(s) that failed schema validation`);
  }
  console.log(`Successfully fetched ${results.length} vendor results`);
  return results;
}

export const fetchVendorResults = makeSheetFetcher(_fetchVendorResults);

// ---------- IPS Implementation Registry (new) ----------

const IMPLEMENTATION_HEADER_KEYS = [
  "jurisdiction",
  "country",
  "country/jurisdiction",
];

/**
 * Locates the header row in an implementations sheet by scanning the first few
 * rows for a recognized first-column header key, defaulting to row 0.
 *
 * @param rows - The parsed sheet rows.
 * @returns The index of the detected header row.
 */
function findHeaderRowIndex(rows: string[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const first = (rows[i][0] || "").toLowerCase().replace(/\*$/, "").trim();
    if (IMPLEMENTATION_HEADER_KEYS.includes(first)) return i;
  }
  return 0;
}

async function _fetchIpsImplementations(): Promise<IpsImplementation[]> {
  const sheetsUrl =
    process.env.IPS_IMPLEMENTATIONS_SHEETS_URL || process.env.GOOGLE_SHEETS_URL || "";
  const rows = await fetchSheetCsv(sheetsUrl, "IPS_IMPLEMENTATIONS_SHEETS_URL");

  if (rows.length === 0) return [];
  const headerIdx = findHeaderRowIndex(rows);
  const headers = rows[headerIdx];
  const columnMap = buildColumnMap(headers);

  const results: IpsImplementation[] = [];
  let skipped = 0;
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const values = rows[i];
    if (!values.some((v) => v && v.trim())) continue;

    const implementation: IpsImplementation = {
      jurisdiction:
        getValue(values, columnMap, ["jurisdiction", "country", "country/jurisdiction"]) || "",
      projectName: getValue(values, columnMap, [
        "project/implementation name",
        "project name",
        "implementation name",
        "project",
      ]),
      primaryContact: getValue(values, columnMap, [
        "primary contact",
        "contact",
        "primary_contact",
      ]),
      contactEmail: getValue(values, columnMap, [
        "contact email",
        "email",
        "contact_email",
      ]),
      infoWebsite: getValue(values, columnMap, [
        "link to ips info website",
        "ips info website",
        "info website",
        "website",
        "link",
      ]),
      approach: getValue(values, columnMap, [
        "ips implementation approach",
        "implementation approach",
        "approach",
      ]),
    };

    if (!implementation.jurisdiction) continue;
    const parsed = ipsImplementationSchema.safeParse(implementation);
    if (!parsed.success) {
      skipped++;
      continue;
    }
    results.push(parsed.data);
  }

  if (skipped > 0) {
    console.warn(`Skipped ${skipped} invalid IPS implementation row(s) that failed schema validation`);
  }
  console.log(`Successfully fetched ${results.length} IPS implementations`);
  return results;
}

export const fetchIpsImplementations = makeSheetFetcher(_fetchIpsImplementations);
