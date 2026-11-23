import type { VendorResult } from "@shared/schema";
import { VendorWebsiteLink } from "./VendorWebsiteLink";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSortable } from "@/hooks/useSortable";
import { SortableHeader } from "./SortableHeader";

interface ResultsTableProps {
  results: VendorResult[];
}

const columns: { key: keyof VendorResult; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "website", label: "Primary Link" },
  { key: "status", label: "Status" },
  { key: "event", label: "Validation Event" },
  { key: "year", label: "Year" },
  { key: "actor", label: "Actor" },
  { key: "product", label: "Product Name" },
  { key: "primaryContact", label: "Primary Contact" },
  { key: "contactInfo", label: "Contact Email" }
];

/** Displays the vendor sheet columns in a sortable table. */
export function ResultsTable({ results }: ResultsTableProps) {
  const { sortKey, sortOrder, handleSort, sorted } = useSortable<VendorResult>(results);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="zebra-table">
        <TableHeader>
          <TableRow>
            {columns.map(({ key, label }) => (
              <TableHead key={key} className={key === "company" ? "min-w-[160px]" : undefined}>
                <SortableHeader column={key} label={label} testId={`button-sort-${key}`}
                  sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <p className="text-muted-foreground">No vendors found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
              </TableCell>
            </TableRow>
          ) : sorted.map((result, index) => (
            <TableRow key={`${result.company}-${index}`} data-testid={`row-result-${index}`}>
              {columns.map(({ key }) => {
                const value = result[key];
                return (
                  <TableCell key={key} className={key === "company" ? "font-medium" : undefined}
                    data-testid={`text-${key}-${index}`}>
                    {key === "website" && value ? (
                      <VendorWebsiteLink href={value} fallback={value} className="text-primary hover:underline">
                        Link
                      </VendorWebsiteLink>
                    ) : value || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
