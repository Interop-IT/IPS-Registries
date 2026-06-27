import { useMemo, useState } from "react";

export type SortOrder = "asc" | "desc" | null;

/**
 * Shared column-sort state used by both result tables. Clicking a column cycles
 * through ascending -> descending -> unsorted, and switching columns starts at
 * ascending. Sorting is a locale-aware string comparison of the selected field.
 *
 * @param results - The rows to sort.
 * @param initialKey - The column to sort by initially (null = unsorted).
 * @param initialOrder - The initial sort direction (null = unsorted).
 * @returns The current `sortKey`/`sortOrder`, a `handleSort` toggler, and the `sorted` rows.
 */
export function useSortable<T>(
  results: T[],
  initialKey: keyof T | null = null,
  initialOrder: SortOrder = null,
) {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortKey(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = useMemo(() => {
    const copy = [...results];
    if (!sortKey || !sortOrder) return copy;
    return copy.sort((a, b) => {
      const aVal = (a[sortKey] ?? "") as string;
      const bVal = (b[sortKey] ?? "") as string;
      const cmp = aVal.localeCompare(bVal, undefined, {
        sensitivity: "base",
        numeric: true,
      });
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [results, sortKey, sortOrder]);

  return { sortKey, sortOrder, handleSort, sorted };
}
