import { useMemo } from "react";

export interface CascadingDimension<T> {
  // Key used in the filter state / available-options record (e.g. "companies")
  key: string;
  // Row field this dimension filters on (e.g. "company")
  field: keyof T;
  // Currently selected values for this dimension
  selected: string[];
}

// "anyField": query must be a substring of a single field (default).
// "joinedFields": fields are concatenated with spaces, then matched — allows a
// query to span across adjacent fields (used by the Implementation Registry).
type SearchMode = "anyField" | "joinedFields";

interface UseCascadingFiltersParams<T> {
  data: T[] | undefined;
  dimensions: CascadingDimension<T>[];
  searchQuery: string;
  searchFields: (keyof T)[];
  searchMode?: SearchMode;
}

interface UseCascadingFiltersResult<T> {
  // Cascading options per dimension key: the values still available given all
  // OTHER active dimensions plus the global search.
  availableOptions: Record<string, string[]>;
  // Rows matching all active dimensions plus the global search.
  filtered: T[];
}

/**
 * Shared cascading-filter + global-search logic used by both the Vendor Results
 * and IPS Implementation Registry screens. Each filter dimension exposes only
 * the options that still exist after applying every OTHER active filter plus the
 * global search, and the returned `filtered` rows respect all dimensions and the
 * search query together.
 *
 * @param data - The full result set to filter (undefined while loading).
 * @param dimensions - The filter dimensions, each with its field and selection.
 * @param searchQuery - The current global search text.
 * @param searchFields - Fields the global search matches against.
 * @param searchMode - "anyField" matches within a single field; "joinedFields"
 *   concatenates fields so a query can span across them.
 * @returns `availableOptions` (per-dimension cascading options) and `filtered` rows.
 */
export function useCascadingFilters<T>({
  data,
  dimensions,
  searchQuery,
  searchFields,
  searchMode = "anyField",
}: UseCascadingFiltersParams<T>): UseCascadingFiltersResult<T> {
  const selectedKey = JSON.stringify(dimensions.map((d) => [d.key, d.selected]));
  const fieldKey = dimensions.map((d) => String(d.field)).join(",");
  const searchFieldKey = searchFields.map(String).join(",");

  return useMemo(() => {
    const emptyOptions: Record<string, string[]> = {};
    dimensions.forEach((d) => {
      emptyOptions[d.key] = [];
    });

    if (!data) {
      return { availableOptions: emptyOptions, filtered: [] as T[] };
    }

    const q = searchQuery.toLowerCase();

    const matchesSearch = (row: T) => {
      if (!q) return true;
      if (searchMode === "joinedFields") {
        const haystack = searchFields
          .map((f) => row[f])
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }
      return searchFields.some((f) =>
        String(row[f] ?? "")
          .toLowerCase()
          .includes(q),
      );
    };

    const matchesDimension = (row: T, dim: CascadingDimension<T>) =>
      dim.selected.length === 0 ||
      dim.selected.includes(String(row[dim.field] ?? ""));

    const filtered = data.filter(
      (row) =>
        dimensions.every((d) => matchesDimension(row, d)) && matchesSearch(row),
    );

    const availableOptions: Record<string, string[]> = {};
    for (const dim of dimensions) {
      const rows = data.filter(
        (row) =>
          dimensions.every((d) =>
            d.key === dim.key ? true : matchesDimension(row, d),
          ) && matchesSearch(row),
      );
      const values = rows
        .map((r) => String(r[dim.field] ?? ""))
        .filter((v) => v.length > 0);
      availableOptions[dim.key] = Array.from(new Set(values)).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }),
      );
    }

    return { availableOptions, filtered };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedKey, fieldKey, searchFieldKey, searchQuery, searchMode]);
}
