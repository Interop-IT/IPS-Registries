import { useState } from "react";
import type { IpsImplementation } from "@shared/schema";
import { distinctContactCount } from "@shared/schema";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Users } from "lucide-react";
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

type SortKey = keyof IpsImplementation;
type SortOrder = "asc" | "desc" | null;

interface Props {
  results: IpsImplementation[];
}

function LinkCell({ url, testId }: { url?: string; testId: string }) {
  if (!url) return <span className="text-muted-foreground">-</span>;
  const trimmed = url.trim();
  const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
      data-testid={testId}
    >
      <span className="max-w-[260px] truncate">{trimmed}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

export function ImplementationsTable({ results }: Props) {
  const [sortKey, setSortKey] = useState<SortKey | null>("jurisdiction");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selected, setSelected] = useState<IpsImplementation | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") {
        setSortKey(null);
        setSortOrder(null);
      } else setSortOrder("asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = [...results].sort((a, b) => {
    if (!sortKey || !sortOrder) return 0;
    const aVal = (a[sortKey] || "") as string;
    const bVal = (b[sortKey] || "") as string;
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortOrder === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const SortBtn = ({ column, label, testId }: { column: SortKey; label: string; testId: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(column)}
      className="h-auto p-0 font-semibold hover:bg-transparent"
      data-testid={testId}
    >
      {label}
      <SortIcon column={column} />
    </Button>
  );

  return (
    <>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortBtn column="jurisdiction" label="Jurisdiction" testId="button-sort-jurisdiction" />
              </TableHead>
              <TableHead>
                <SortBtn column="projectName" label="Project / Implementation" testId="button-sort-project" />
              </TableHead>
              <TableHead>IPS Info Website</TableHead>
              <TableHead>
                <SortBtn column="approach" label="Approach" testId="button-sort-approach" />
              </TableHead>
              <TableHead>Data Domains</TableHead>
              <TableHead className="text-right">Contacts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
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
                    <TableCell>
                      <LinkCell url={row.dataDomainsLink} testId={`link-domains-${index}`} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelected(row)}
                        disabled={contactCount === 0}
                        data-testid={`button-view-contacts-${index}`}
                        className="gap-2"
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
