import type { VendorResult } from "@shared/schema";
import { ResultsTable } from "./ResultsTable";
import { ResultsCards } from "./ResultsCards";
import { ViewModeToggle } from "./ViewModeToggle";
import { useState } from "react";
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
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [groupByCompany, setGroupByCompany] = useState(false);

  return (
    <section className="py-6 md:py-8">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
            <div>
              <h3 className="text-lg font-semibold md:text-xl">
                Results
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                Showing {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <ViewModeToggle
                viewMode={viewMode}
                onChange={setViewMode}
                tableLabel="Table"
                cardsLabel="Cards"
                labelClassName="sm:hidden"
                activeVariant="secondary"
                containerClassName="flex gap-1 rounded-lg border p-1"
                buttonClassName="flex-1 gap-2 min-h-[44px] sm:flex-none sm:min-h-0"
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
