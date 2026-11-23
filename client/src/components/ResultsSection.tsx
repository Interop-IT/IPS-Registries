import type { VendorResult } from "@shared/schema";
import { ResultsTable } from "./ResultsTable";
import { ResultsCards } from "./ResultsCards";
import { ViewModeToggle } from "./ViewModeToggle";
import { useState } from "react";
import { isMobileViewport } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface ResultsSectionProps {
  results: VendorResult[];
}

/**
 * Vendor Results section that toggles between table and card views and offers a
 * group-by-company option for the card view.
 *
 * @param results - The vendor results to display.
 */
export function ResultsSection({ results }: ResultsSectionProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">(
    () => isMobileViewport() ? "cards" : "table",
  );
  const [groupByCompany, setGroupByCompany] = useState(false);

  return (
    <section className="py-6 md:py-8">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[96rem] pl-[max(0px,calc((100%-80rem)/2))]">
          <div className="mb-4 flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
            <div>
              <h3 className="text-lg font-semibold md:text-xl">
                Vendors
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                Showing {results.length} {results.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
            
            <div className="mb-4 flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <ViewModeToggle
                viewMode={viewMode}
                onChange={setViewMode}
                tableLabel="List View"
                cardsLabel="Item View"
                activeVariant="default"
                containerClassName="flex gap-1 rounded-md border p-1"
                buttonClassName="flex-1 gap-1.5 min-h-[44px] sm:flex-none sm:min-h-0"
                groupingControl={
                  viewMode === "cards" ? (
                    <Button
                      variant={groupByCompany ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setGroupByCompany(!groupByCompany)}
                      data-testid="button-group-by-company"
                      className="w-full gap-2 min-h-[44px] sm:w-auto sm:min-h-0"
                    >
                      <Users className="h-4 w-4" />
                      <span className="sm:hidden">Group by Company</span>
                      <span className="hidden sm:inline">Group by Company</span>
                    </Button>
                  ) : null
                }
              />
            </div>
          </div>

          {viewMode === "table" ? (
            <ResultsTable results={results} />
          ) : (
            <ResultsCards results={results} groupByCompany={groupByCompany} />
          )}
        </div>
      </div>
    </section>
  );
}
