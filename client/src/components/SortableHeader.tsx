import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortOrder } from "@/hooks/useSortable";

interface SortableHeaderProps<T> {
  column: keyof T;
  label: string;
  testId: string;
  sortKey: keyof T | null;
  sortOrder: SortOrder;
  onSort: (key: keyof T) => void;
}

// Shared sortable column header button + sort-direction icon used by both tables.
export function SortableHeader<T>({
  column,
  label,
  testId,
  sortKey,
  sortOrder,
  onSort,
}: SortableHeaderProps<T>) {
  const isActive = sortKey === column;

  const icon = !isActive ? (
    <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
  ) : sortOrder === "asc" ? (
    <ArrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
  );

  // Expose the current sort state to assistive tech instead of relying on the
  // icon alone. aria-sort needs a columnheader role, so describe the state via
  // an accessible label on the sortable control itself.
  const sortState = !isActive
    ? "not sorted"
    : sortOrder === "asc"
      ? "sorted ascending"
      : "sorted descending";

  return (
    <Button
      variant="ghost"
      onClick={() => onSort(column)}
      className="h-auto p-0 font-semibold hover:bg-transparent"
      aria-label={`${label}, ${sortState}. Activate to change sorting.`}
      data-testid={testId}
    >
      {label}
      {icon}
    </Button>
  );
}
