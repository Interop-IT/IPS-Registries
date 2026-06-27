import type { VendorResult } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSortable } from "@/hooks/useSortable";
import { SortableHeader } from "./SortableHeader";

interface ResultsTableProps {
  results: VendorResult[];
}

/**
 * Table view of vendor testing results with sortable columns. Sorting is driven
 * by the shared {@link useSortable} hook and {@link SortableHeader} control.
 *
 * @param results - The vendor results to display.
 */
export function ResultsTable({ results }: ResultsTableProps) {
  const { sortKey, sortOrder, handleSort, sorted } = useSortable<VendorResult>(results);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                column="company"
                label="Company"
                testId="button-sort-company"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="profile"
                label="IHE Profile"
                testId="button-sort-profile"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="actor"
                label="Actor"
                testId="button-sort-actor"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="year"
                label="Year"
                testId="button-sort-year"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="event"
                label="Event"
                testId="button-sort-event"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="product"
                label="Product"
                testId="button-sort-product"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="primaryContact"
                label="Primary Contact"
                testId="button-sort-primaryContact"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="contactInfo"
                label="Contact Info"
                testId="button-sort-contactInfo"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <p className="text-muted-foreground">No results found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((result, index) => (
              <TableRow
                key={`${result.company}-${result.actor}-${result.year}-${index}`}
                data-testid={`row-result-${index}`}
              >
                <TableCell className="font-medium" data-testid={`text-company-${index}`}>
                  {result.website ? (
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      data-testid={`link-company-${index}`}
                    >
                      {result.company}
                    </a>
                  ) : (
                    result.company
                  )}
                </TableCell>
                <TableCell data-testid={`text-profile-${index}`}>{result.profile}</TableCell>
                <TableCell data-testid={`text-actor-${index}`}>{result.actor}</TableCell>
                <TableCell data-testid={`text-year-${index}`}>{result.year}</TableCell>
                <TableCell data-testid={`text-event-${index}`}>{result.event}</TableCell>
                <TableCell data-testid={`text-product-${index}`}>
                  {result.product || '-'}
                </TableCell>
                <TableCell data-testid={`text-primaryContact-${index}`}>
                  {result.primaryContact || '-'}
                </TableCell>
                <TableCell data-testid={`text-contactInfo-${index}`}>
                  {result.contactInfo || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
