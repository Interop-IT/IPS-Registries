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
  const icon =
    sortKey !== column ? (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    ) : sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );

  return (
    <Button
      variant="ghost"
      onClick={() => onSort(column)}
      className="h-auto p-0 font-semibold hover:bg-transparent"
      data-testid={testId}
    >
      {label}
      {icon}
    </Button>
  );
}
