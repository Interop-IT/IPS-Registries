import { useState } from "react";
import type { IpsImplementation } from "@shared/schema";
import { distinctContactCount } from "@shared/schema";
import { ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactPanel } from "./ContactPanel";
import { useSortable } from "@/hooks/useSortable";
import { SortableHeader } from "./SortableHeader";

interface Props {
  results: IpsImplementation[];
}

function LinkCell({ url, testId }: { url?: string; testId: string }) {
  if (!url) return <span className="text-muted-foreground">-</span>;
  const trimmed = url.trim();
  const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const stripped = trimmed.replace(/^https?:\/\//i, "");
  const label = stripped.length > 20 ? stripped.slice(0, 20) + "…" : stripped;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
      data-testid={testId}
    >
      <span>{label}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

export function ImplementationsTable({ results }: Props) {
  const { sortKey, sortOrder, handleSort, sorted } = useSortable<IpsImplementation>(
    results,
    "jurisdiction",
    "asc",
  );
  const [selected, setSelected] = useState<IpsImplementation | null>(null);

  return (
    <>
      <div className="rounded-lg border overflow-x-auto">
        <Table className="zebra-table">
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  column="jurisdiction"
                  label="Jurisdiction"
                  testId="button-sort-jurisdiction"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  column="projectName"
                  label="Project / Implementation"
                  testId="button-sort-project"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>IPS Info Website</TableHead>
              <TableHead>
                <SortableHeader
                  column="approach"
                  label="Approach"
                  testId="button-sort-approach"
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="text-right">Contacts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <p className="text-muted-foreground">No implementations found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row, index) => {
                const contactCount = distinctContactCount(
                  row.primaryContact,
                  row.contactEmail,
                );
                return (
                  <TableRow key={`${row.jurisdiction}-${index}`} data-testid={`row-impl-${index}`}>
                    <TableCell className="font-medium" data-testid={`text-jurisdiction-${index}`}>
                      {row.jurisdiction}
                    </TableCell>
                    <TableCell data-testid={`text-project-${index}`}>
                      {row.projectName || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <LinkCell url={row.infoWebsite} testId={`link-info-${index}`} />
                    </TableCell>
                    <TableCell data-testid={`text-approach-${index}`}>
                      {row.approach || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelected(row)}
                        disabled={contactCount === 0}
                        data-testid={`button-view-contacts-${index}`}
                        className="gap-2 min-h-11 sm:min-h-9"
                      >
                        <Users className="h-4 w-4" />
                        Contacts{contactCount > 0 ? ` (${contactCount})` : ""}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent data-testid="dialog-contacts">
          <DialogHeader>
            <DialogTitle>
              {selected?.jurisdiction} — Contacts
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <ContactPanel
              primaryContact={selected.primaryContact}
              contactEmail={selected.contactEmail}
              projectName={selected.projectName}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
