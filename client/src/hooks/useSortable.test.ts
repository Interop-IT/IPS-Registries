import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSortable } from "./useSortable";
import type { VendorResult, IpsImplementation } from "@shared/schema";

const vendors: VendorResult[] = [
  { company: "Charlie Co", profile: "IPS", actor: "A", year: "2024", event: "E" },
  { company: "Alpha Co", profile: "IPS", actor: "A", year: "2022", event: "E" },
  { company: "Bravo Co", profile: "IPS", actor: "A", year: "2023", event: "E" },
];

describe("useSortable - Vendor Results default (unsorted)", () => {
  it("starts unsorted and preserves the original row order", () => {
    const { result } = renderHook(() => useSortable<VendorResult>(vendors));

    expect(result.current.sortKey).toBeNull();
    expect(result.current.sortOrder).toBeNull();
    expect(result.current.sorted.map((r) => r.company)).toEqual([
      "Charlie Co",
      "Alpha Co",
      "Bravo Co",
    ]);
  });

  it("cycles a column through asc -> desc -> unsorted", () => {
    const { result } = renderHook(() => useSortable<VendorResult>(vendors));

    // First click: ascending.
    act(() => result.current.handleSort("company"));
    expect(result.current.sortKey).toBe("company");
    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.sorted.map((r) => r.company)).toEqual([
      "Alpha Co",
      "Bravo Co",
      "Charlie Co",
    ]);

    // Second click: descending.
    act(() => result.current.handleSort("company"));
    expect(result.current.sortOrder).toBe("desc");
    expect(result.current.sorted.map((r) => r.company)).toEqual([
      "Charlie Co",
      "Bravo Co",
      "Alpha Co",
    ]);

    // Third click: back to unsorted (original order restored).
    act(() => result.current.handleSort("company"));
    expect(result.current.sortKey).toBeNull();
    expect(result.current.sortOrder).toBeNull();
    expect(result.current.sorted.map((r) => r.company)).toEqual([
      "Charlie Co",
      "Alpha Co",
      "Bravo Co",
    ]);
  });

  it("switching to a different column starts at ascending", () => {
    const { result } = renderHook(() => useSortable<VendorResult>(vendors));

    act(() => result.current.handleSort("company"));
    act(() => result.current.handleSort("company")); // company desc
    expect(result.current.sortOrder).toBe("desc");

    // Switch column -> resets to ascending on the new key.
    act(() => result.current.handleSort("year"));
    expect(result.current.sortKey).toBe("year");
    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.sorted.map((r) => r.year)).toEqual([
      "2022",
      "2023",
      "2024",
    ]);
  });
});

const implementations: IpsImplementation[] = [
  { jurisdiction: "Germany", approach: "FHIR R4" },
  { jurisdiction: "Australia", approach: "CDA" },
  { jurisdiction: "Canada", approach: "FHIR R4" },
];

describe("useSortable - Implementation Registry default (jurisdiction asc)", () => {
  it("defaults to jurisdiction ascending", () => {
    const { result } = renderHook(() =>
      useSortable<IpsImplementation>(implementations, "jurisdiction", "asc"),
    );

    expect(result.current.sortKey).toBe("jurisdiction");
    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.sorted.map((r) => r.jurisdiction)).toEqual([
      "Australia",
      "Canada",
      "Germany",
    ]);
  });

  it("cycles the default column desc -> unsorted, restoring source order", () => {
    const { result } = renderHook(() =>
      useSortable<IpsImplementation>(implementations, "jurisdiction", "asc"),
    );

    // From asc, one click -> descending.
    act(() => result.current.handleSort("jurisdiction"));
    expect(result.current.sortOrder).toBe("desc");
    expect(result.current.sorted.map((r) => r.jurisdiction)).toEqual([
      "Germany",
      "Canada",
      "Australia",
    ]);

    // Next click -> unsorted (original source order).
    act(() => result.current.handleSort("jurisdiction"));
    expect(result.current.sortKey).toBeNull();
    expect(result.current.sortOrder).toBeNull();
    expect(result.current.sorted.map((r) => r.jurisdiction)).toEqual([
      "Germany",
      "Australia",
      "Canada",
    ]);
  });
});
