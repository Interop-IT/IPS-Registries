import type { VendorResult } from "@shared/schema";

// Extract sheet ID from Google Sheets URL
function extractSheetId(url: string): string {
  // Try standard /d/ format first
  let match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return match[1];
  }
  
  // Try alternative format with spreadsheets/d/
  match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return match[1];
  }
  
  // If the URL itself looks like just an ID, return it
  if (/^[a-zA-Z0-9-_]+$/.test(url.trim())) {
    return url.trim();
  }
  
  throw new Error(`Invalid Google Sheets URL: ${url}`);
}

// Fetch data from Google Sheets using public CSV export
export async function fetchVendorResults(): Promise<VendorResult[]> {
  const sheetsUrl = process.env.GOOGLE_SHEETS_URL;
  
  if (!sheetsUrl) {
    throw new Error("GOOGLE_SHEETS_URL environment variable is not set");
  }

  try {
    const sheetId = extractSheetId(sheetsUrl);
    
    // Try different methods to access the sheet
    const urls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    ];
    
    let lastError: Error | null = null;
    
    for (const csvUrl of urls) {
      try {
        const response = await fetch(csvUrl, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; IPSRegistry/1.0)'
          }
        });
        
        const csvText = await response.text();
        
        // Check if we got an HTML error page instead of CSV
        if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<HTML>')) {
          lastError = new Error('Sheet is not publicly accessible or does not exist');
          continue;
        }
        
        if (!response.ok) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          continue;
        }
        
        const results = parseCSV(csvText);
        
        if (results.length > 0) {
          console.log(`Successfully fetched ${results.length} results from Google Sheets`);
          return results;
        }
        
        lastError = new Error('Sheet appears to be empty');
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        continue;
      }
    }
    
    throw lastError || new Error('Failed to fetch sheet data from all attempted URLs');
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
}

// Parse CSV data into VendorResult objects
function parseCSV(csvText: string): VendorResult[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }
  
  // First line is the header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  // Map column names (case-insensitive)
  const columnMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const normalized = header.toLowerCase();
    columnMap[normalized] = index;
  });
  
  // Parse data rows
  const results: VendorResult[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Split by comma, handling quoted values
    const values = parseCSVLine(line);
    
    // Map to VendorResult
    const result: VendorResult = {
      company: getValue(values, columnMap, ['company', 'vendor', 'organization']) || '',
      profile: getValue(values, columnMap, ['profile', 'ihe profile', 'iheprofile']) || '',
      actor: getValue(values, columnMap, ['actor']) || '',
      year: getValue(values, columnMap, ['year']) || '',
      event: getValue(values, columnMap, ['event', 'connectathon', 'location']) || '',
    };
    
    // Only add if we have at least company and profile
    if (result.company && result.profile) {
      results.push(result);
    }
  }
  
  return results;
}

// Parse a CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  
  return values;
}

// Get value from CSV row by trying multiple possible column names
function getValue(values: string[], columnMap: Record<string, number>, possibleNames: string[]): string | undefined {
  for (const name of possibleNames) {
    const index = columnMap[name.toLowerCase()];
    if (index !== undefined && values[index]) {
      return values[index].replace(/^"|"$/g, '').trim();
    }
  }
  return undefined;
}
