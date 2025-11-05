import type { VendorResult } from "@shared/schema";
import { ResultsTable } from "./ResultsTable";
import { ResultsCards } from "./ResultsCards";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

interface ResultsSectionProps {
  results: VendorResult[];
}

export function ResultsSection({ results }: ResultsSectionProps) {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <section className="py-8">
      <div className="container px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Results
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                Showing {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            
            <div className="flex gap-1 rounded-lg border p-1">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                data-testid="button-view-table"
              >
                <Table className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                data-testid="button-view-cards"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "table" ? (
            <ResultsTable results={results} />
          ) : (
            <ResultsCards results={results} />
          )}
        </div>
      </div>
    </section>
  );
}
