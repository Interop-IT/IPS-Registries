import type { VendorResult } from "@shared/schema";

// TODO: remove mock functionality - replace with real Google Sheets API data
export const mockVendorResults: VendorResult[] = [
  {
    company: "Altera Digital Health",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Altera Digital Health",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Centers for Disease Control and Prevention",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Centers for Disease Control and Prevention",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Epic Systems Corporation",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Founda Health",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Medical Informatics Engineering",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Siemens Healthineers AG",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Siemens Healthineers AG",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "UC Davis Health",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2025",
    event: "North America 2025"
  },
  {
    company: "Altera Digital Health",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2024",
    event: "North America 2024"
  },
  {
    company: "Epic Systems Corporation",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2024",
    event: "North America 2024"
  },
  {
    company: "Siemens Healthineers AG",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2024",
    event: "North America 2024"
  },
  {
    company: "Cerner Corporation",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2024",
    event: "Europe 2024"
  },
  {
    company: "InterSystems Corporation",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2024",
    event: "Europe 2024"
  },
  {
    company: "Philips Medical Systems",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2024",
    event: "Europe 2024"
  },
  {
    company: "Oracle",
    profile: "International Patient Summary",
    actor: "Content Creator",
    year: "2023",
    event: "North America 2023"
  },
  {
    company: "Microsoft Corporation",
    profile: "International Patient Summary",
    actor: "Content Consumer",
    year: "2023",
    event: "North America 2023"
  }
];

export function getUniqueValues(results: VendorResult[], key: keyof VendorResult): string[] {
  const values = results.map(r => r[key]);
  return Array.from(new Set(values)).sort();
}
