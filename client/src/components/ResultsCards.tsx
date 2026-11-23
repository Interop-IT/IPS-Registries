import type { VendorResult } from "@shared/schema";
import { VendorWebsiteLink } from "./VendorWebsiteLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Globe } from "lucide-react";

interface ResultsCardsProps {
  results: VendorResult[];
  groupByCompany?: boolean;
}

function VendorCard({ result, index, grouped }: { result: VendorResult; index: number; grouped: boolean }) {
  const fields = [
    ["Product Name", result.product],
    ["Primary Contact", result.primaryContact],
    ["Contact Email", result.contactInfo],
    ["Production / Development", result.status],
    ["Validation Event", result.event],
    ["Year", result.year],
    ["Actor", result.actor],
  ];

  return (
    <Card className="hover-elevate" data-testid={`card-result-${index}`}>
      {!grouped && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-start gap-2 text-base">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {result.website ? (
              <VendorWebsiteLink href={result.website} className="text-primary hover:underline">
                {result.company}
              </VendorWebsiteLink>
            ) : result.company}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={`space-y-2 ${grouped ? "pt-6" : ""}`}>
        {fields.map(([label, value]) => value && (
          <div className="flex items-start gap-2 text-sm" key={label}>
            <span className="shrink-0 text-muted-foreground">{label}:</span>
            <span className="min-w-0 break-words font-medium">{value}</span>
          </div>
        ))}
        {result.website && (
          <div className="flex items-start gap-2 text-sm">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Primary Link:</span>
            <VendorWebsiteLink href={result.website} className="min-w-0 break-all text-primary hover:underline">
              {result.website}
            </VendorWebsiteLink>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Displays vendor sheet entries as cards, optionally grouped by company. */
export function ResultsCards({ results, groupByCompany = false }: ResultsCardsProps) {
  if (results.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <div className="text-center">
          <p className="text-muted-foreground">No vendors found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  const grid = (items: VendorResult[], grouped: boolean) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((result, index) => (
        <VendorCard key={`${result.company}-${index}`} result={result} index={index} grouped={grouped} />
      ))}
    </div>
  );

  if (!groupByCompany) return grid(results, false);

  const groups = new Map<string, VendorResult[]>();
  for (const result of results) {
    const group = groups.get(result.company) ?? [];
    group.push(result);
    groups.set(result.company, group);
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([company, items]) => (
        <div key={company} className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-2">
            <Building2 className="h-5 w-5 text-primary" />
            {items[0].website ? (
              <VendorWebsiteLink href={items[0].website} className="text-lg font-semibold text-primary hover:underline">
                {company}
              </VendorWebsiteLink>
            ) : <h3 className="text-lg font-semibold">{company}</h3>}
            <span className="text-sm text-muted-foreground">
              ({items.length} {items.length === 1 ? "entry" : "entries"})
            </span>
          </div>
          {grid(items, true)}
        </div>
      ))}
    </div>
  );
}
