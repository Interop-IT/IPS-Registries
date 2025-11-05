import { useState } from "react";
import type { VendorResult } from "@shared/schema";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = keyof VendorResult;
type SortOrder = "asc" | "desc" | null;

interface ResultsTableProps {
  results: VendorResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSort = (key: SortKey) => {
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

  const sortedResults = [...results].sort((a, b) => {
    if (!sortKey || !sortOrder) return 0;
    
    const aVal = a[sortKey] || '';
    const bVal = b[sortKey] || '';
    
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortOrder === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("company")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-company"
              >
                Company
                <SortIcon column="company" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("profile")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-profile"
              >
                IHE Profile
                <SortIcon column="profile" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("actor")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-actor"
              >
                Actor
                <SortIcon column="actor" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("year")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-year"
              >
                Year
                <SortIcon column="year" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("event")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-event"
              >
                Event
                <SortIcon column="event" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("product")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-product"
              >
                Product
                <SortIcon column="product" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("website")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-website"
              >
                Website
                <SortIcon column="website" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("primaryContact")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-primaryContact"
              >
                Primary Contact
                <SortIcon column="primaryContact" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("contactInfo")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
                data-testid="button-sort-contactInfo"
              >
                Contact Info
                <SortIcon column="contactInfo" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center">
                <p className="text-muted-foreground">No results found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </TableCell>
            </TableRow>
          ) : (
            sortedResults.map((result, index) => (
              <TableRow
                key={`${result.company}-${result.actor}-${result.year}-${index}`}
                data-testid={`row-result-${index}`}
              >
                <TableCell className="font-medium" data-testid={`text-company-${index}`}>
                  {result.company}
                </TableCell>
                <TableCell data-testid={`text-profile-${index}`}>{result.profile}</TableCell>
                <TableCell data-testid={`text-actor-${index}`}>{result.actor}</TableCell>
                <TableCell data-testid={`text-year-${index}`}>{result.year}</TableCell>
                <TableCell data-testid={`text-event-${index}`}>{result.event}</TableCell>
                <TableCell data-testid={`text-product-${index}`}>
                  {result.product || '-'}
                </TableCell>
                <TableCell data-testid={`text-website-${index}`}>
                  {result.website ? (
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      data-testid={`link-website-${index}`}
                    >
                      Link
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    '-'
                  )}
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
