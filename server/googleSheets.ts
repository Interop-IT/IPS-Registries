import type { VendorResult, IpsImplementation } from "@shared/schema";

// Extract sheet ID from Google Sheets URL
function extractSheetId(url: string): string {
  let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]+$/.test(url.trim())) return url.trim();
  throw new Error(`Invalid Google Sheets URL: ${url}`);
}

// Robust CSV parser that handles quoted multiline fields
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
    try {
      const response = await fetch(csvUrl, {
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
    }
  }

  throw lastError || new Error("Failed to fetch sheet data");
}

function buildColumnMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headers.forEach((h, i) => {
    map[h.toLowerCase().replace(/\*$/, "").trim()] = i;
  });
  return map;
}

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

export async function fetchVendorResults(): Promise<VendorResult[]> {
  // Prefer dedicated vendor-results URL; fall back to GOOGLE_SHEETS_URL for backward compat
  const sheetsUrl =
    process.env.VENDOR_RESULTS_SHEETS_URL || process.env.GOOGLE_SHEETS_URL || "";
  const rows = await fetchSheetCsv(sheetsUrl, "VENDOR_RESULTS_SHEETS_URL");

  if (rows.length === 0) return [];
  const headers = rows[0];
  const columnMap = buildColumnMap(headers);

  const results: VendorResult[] = [];
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
    if (result.company) results.push(result);
  }

  console.log(`Successfully fetched ${results.length} vendor results`);
  return results;
}

// ---------- IPS Implementation Registry (new) ----------

const IMPLEMENTATION_HEADER_KEYS = [
  "jurisdiction",
  "country",
  "country/jurisdiction",
];

function findHeaderRowIndex(rows: string[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const first = (rows[i][0] || "").toLowerCase().replace(/\*$/, "").trim();
    if (IMPLEMENTATION_HEADER_KEYS.includes(first)) return i;
  }
  return 0;
}

export async function fetchIpsImplementations(): Promise<IpsImplementation[]> {
  const sheetsUrl =
    process.env.IPS_IMPLEMENTATIONS_SHEETS_URL || process.env.GOOGLE_SHEETS_URL || "";
  const rows = await fetchSheetCsv(sheetsUrl, "IPS_IMPLEMENTATIONS_SHEETS_URL");

  if (rows.length === 0) return [];
  const headerIdx = findHeaderRowIndex(rows);
  const headers = rows[headerIdx];
  const columnMap = buildColumnMap(headers);

  const results: IpsImplementation[] = [];
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
      dataDomainsLink: getValue(values, columnMap, [
        "link to data domains supported",
        "data domains",
        "data domains supported",
        "domains",
      ]),
    };

    if (implementation.jurisdiction) results.push(implementation);
  }

  console.log(`Successfully fetched ${results.length} IPS implementations`);
  return results;
}
