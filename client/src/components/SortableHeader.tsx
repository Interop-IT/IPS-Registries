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

/**
 * Shared sortable column-header control used by both result tables. Renders a
 * button with the column label and a sort-direction icon, and exposes the
 * current sort state to assistive tech via an accessible label.
 *
 * @param column - The field this header sorts.
 * @param label - The visible column label.
 * @param testId - data-testid for the control.
 * @param sortKey - The currently active sort column (null = unsorted).
 * @param sortOrder - The current sort direction.
 * @param onSort - Callback invoked with the column when the header is activated.
 */
export function SortableHeader<T>({
  column,
  label,
  testId,
  sortKey,
  sortOrder,
  onSort,
}: Readonly<SortableHeaderProps<T>>) {
  const isActive = sortKey === column;

  let icon = <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />;
  if (isActive) {
    icon =
      sortOrder === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
      );
  }

  // Expose the current sort state to assistive tech instead of relying on the
  // icon alone. aria-sort needs a columnheader role, so describe the state via
  // an accessible label on the sortable control itself.
  let sortState = "not sorted";
  if (isActive) {
    sortState = sortOrder === "asc" ? "sorted ascending" : "sorted descending";
  }

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
