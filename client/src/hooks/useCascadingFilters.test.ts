import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCascadingFilters, type CascadingDimension } from "./useCascadingFilters";
import type { VendorResult, IpsImplementation } from "@shared/schema";

const vendors: VendorResult[] = [
  {
    company: "Acme Health",
    profile: "IPS",
    actor: "Content Creator",
    year: "2024",
    event: "IHE NA Connectathon",
    website: "https://acme.example",
    product: "Acme Summary",
    primaryContact: "Alice Smith",
    contactInfo: "alice@acme.example",
  },
  {
    company: "Acme Health",
    profile: "XDS",
    actor: "Content Consumer",
    year: "2023",
    event: "IHE EU Connectathon",
    product: "Acme Exchange",
    primaryContact: "Bob Jones",
    contactInfo: "bob@acme.example",
  },
  {
    company: "Beta Medical",
    profile: "IPS",
    actor: "Content Consumer",
    year: "2024",
    event: "IHE EU Connectathon",
    product: "Beta Viewer",
    primaryContact: "Carol White",
    contactInfo: "carol@beta.example",
  },
];

// Vendor Results screen configuration (mirrors Home.tsx).
function vendorDimensions(
  selected: Partial<Record<string, string[]>> = {},
): CascadingDimension<VendorResult>[] {
  return [
    { key: "companies", field: "company", selected: selected.companies ?? [] },
    { key: "profiles", field: "profile", selected: selected.profiles ?? [] },
    { key: "actors", field: "actor", selected: selected.actors ?? [] },
    { key: "years", field: "year", selected: selected.years ?? [] },
    { key: "events", field: "event", selected: selected.events ?? [] },
  ];
}

const VENDOR_SEARCH_FIELDS: (keyof VendorResult)[] = [
  "company",
  "profile",
  "actor",
  "year",
  "event",
  "website",
  "product",
  "primaryContact",
  "contactInfo",
];

describe("useCascadingFilters - Vendor Results (anyField search)", () => {
  it("returns all rows and full option sets when nothing is selected", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<VendorResult>({
        data: vendors,
        dimensions: vendorDimensions(),
        searchQuery: "",
        searchFields: VENDOR_SEARCH_FIELDS,
      }),
    );

    expect(result.current.filtered).toHaveLength(3);
    expect(result.current.availableOptions.companies).toEqual([
      "Acme Health",
      "Beta Medical",
    ]);
    expect(result.current.availableOptions.profiles).toEqual(["IPS", "XDS"]);
    expect(result.current.availableOptions.years).toEqual(["2023", "2024"]);
  });

  it("narrows other dimensions' options when a dimension is selected (cascading)", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<VendorResult>({
        data: vendors,
        dimensions: vendorDimensions({ companies: ["Acme Health"] }),
        searchQuery: "",
        searchFields: VENDOR_SEARCH_FIELDS,
      }),
    );

    // Only Acme rows remain.
    expect(result.current.filtered).toHaveLength(2);
    // Profiles available given Acme is selected: IPS + XDS (no Beta-only values).
    expect(result.current.availableOptions.profiles).toEqual(["IPS", "XDS"]);
    // Years available for Acme: 2023 and 2024.
    expect(result.current.availableOptions.years).toEqual(["2023", "2024"]);
    // A selected dimension still shows ALL of its own options (not narrowed by itself).
    expect(result.current.availableOptions.companies).toEqual([
      "Acme Health",
      "Beta Medical",
    ]);
  });

  it("cascades across multiple active dimensions", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<VendorResult>({
        data: vendors,
        dimensions: vendorDimensions({ years: ["2024"] }),
        searchQuery: "",
        searchFields: VENDOR_SEARCH_FIELDS,
      }),
    );

    // 2024 rows: Acme/IPS and Beta/IPS.
    expect(result.current.filtered).toHaveLength(2);
    // Profiles available in 2024: only IPS (XDS was 2023).
    expect(result.current.availableOptions.profiles).toEqual(["IPS"]);
    // Companies available in 2024: both Acme and Beta.
    expect(result.current.availableOptions.companies).toEqual([
      "Acme Health",
      "Beta Medical",
    ]);
  });

  it("anyField search matches a substring within a single field", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<VendorResult>({
        data: vendors,
        dimensions: vendorDimensions(),
        searchQuery: "carol",
        searchFields: VENDOR_SEARCH_FIELDS,
      }),
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].company).toBe("Beta Medical");
  });

  it("anyField search does NOT match a phrase spanning two separate fields", () => {
    // "Acme Health" (company) + "IPS" (profile) -> "acme ips" should not match
    // in anyField mode because no single field contains that substring.
    const { result } = renderHook(() =>
      useCascadingFilters<VendorResult>({
        data: vendors,
        dimensions: vendorDimensions(),
        searchQuery: "acme ips",
        searchFields: VENDOR_SEARCH_FIELDS,
      }),
    );

    expect(result.current.filtered).toHaveLength(0);
  });

  it("search restricts cascading options too", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<VendorResult>({
        data: vendors,
        dimensions: vendorDimensions(),
        searchQuery: "beta",
        searchFields: VENDOR_SEARCH_FIELDS,
      }),
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.availableOptions.companies).toEqual(["Beta Medical"]);
    expect(result.current.availableOptions.profiles).toEqual(["IPS"]);
  });
});

const implementations: IpsImplementation[] = [
  {
    jurisdiction: "Germany",
    projectName: "National Summary",
    primaryContact: "Hans Mueller",
    contactEmail: "hans@de.example",
    infoWebsite: "https://de.example",
    approach: "FHIR R4",
  },
  {
    jurisdiction: "France",
    projectName: "Dossier Patient",
    primaryContact: "Marie Curie",
    contactEmail: "marie@fr.example",
    infoWebsite: "https://fr.example",
    approach: "CDA",
  },
  {
    jurisdiction: "Germany",
    projectName: "Regional Pilot",
    primaryContact: "Greta Berg",
    contactEmail: "greta@de.example",
    infoWebsite: "https://de2.example",
    approach: "FHIR R4",
  },
];

function implDimensions(
  selected: Partial<Record<string, string[]>> = {},
): CascadingDimension<IpsImplementation>[] {
  return [
    { key: "jurisdictions", field: "jurisdiction", selected: selected.jurisdictions ?? [] },
    { key: "approaches", field: "approach", selected: selected.approaches ?? [] },
  ];
}

const IMPL_SEARCH_FIELDS: (keyof IpsImplementation)[] = [
  "jurisdiction",
  "projectName",
  "primaryContact",
  "contactEmail",
  "infoWebsite",
  "approach",
];

describe("useCascadingFilters - Implementation Registry (joinedFields search)", () => {
  it("narrows approach options when a jurisdiction is selected (cascading)", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<IpsImplementation>({
        data: implementations,
        dimensions: implDimensions({ jurisdictions: ["France"] }),
        searchQuery: "",
        searchFields: IMPL_SEARCH_FIELDS,
        searchMode: "joinedFields",
      }),
    );

    expect(result.current.filtered).toHaveLength(1);
    // France only uses CDA.
    expect(result.current.availableOptions.approaches).toEqual(["CDA"]);
    // The selected dimension keeps all its own options.
    expect(result.current.availableOptions.jurisdictions).toEqual([
      "France",
      "Germany",
    ]);
  });

  it("joinedFields search matches a phrase spanning two adjacent fields", () => {
    // "Germany" (jurisdiction) + "National Summary" (projectName) are joined with
    // a space, so the cross-field phrase "germany national" matches one row.
    const { result } = renderHook(() =>
      useCascadingFilters<IpsImplementation>({
        data: implementations,
        dimensions: implDimensions(),
        searchQuery: "germany national",
        searchFields: IMPL_SEARCH_FIELDS,
        searchMode: "joinedFields",
      }),
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].projectName).toBe("National Summary");
  });

  it("the same cross-field phrase does NOT match in anyField mode", () => {
    // Guards the per-screen difference: the Vendor Results semantics (anyField)
    // must NOT match a phrase that spans two fields.
    const { result } = renderHook(() =>
      useCascadingFilters<IpsImplementation>({
        data: implementations,
        dimensions: implDimensions(),
        searchQuery: "germany national",
        searchFields: IMPL_SEARCH_FIELDS,
        searchMode: "anyField",
      }),
    );

    expect(result.current.filtered).toHaveLength(0);
  });

  it("joinedFields search still matches a single-field substring", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<IpsImplementation>({
        data: implementations,
        dimensions: implDimensions(),
        searchQuery: "curie",
        searchFields: IMPL_SEARCH_FIELDS,
        searchMode: "joinedFields",
      }),
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].jurisdiction).toBe("France");
  });

  it("returns empty results and empty options when data is undefined", () => {
    const { result } = renderHook(() =>
      useCascadingFilters<IpsImplementation>({
        data: undefined,
        dimensions: implDimensions(),
        searchQuery: "",
        searchFields: IMPL_SEARCH_FIELDS,
        searchMode: "joinedFields",
      }),
    );

    expect(result.current.filtered).toEqual([]);
    expect(result.current.availableOptions.jurisdictions).toEqual([]);
    expect(result.current.availableOptions.approaches).toEqual([]);
  });
});
