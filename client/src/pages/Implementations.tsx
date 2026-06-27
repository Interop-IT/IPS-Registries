import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ImplementationFilters,
  type ImplementationFilterState,
} from "@/components/ImplementationFilters";
import { ImplementationsTable } from "@/components/ImplementationsTable";
import { ImplementationsCards } from "@/components/ImplementationsCards";
import type { IpsImplementation } from "@shared/schema";
import { Loader2, Table as TableIcon, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useCascadingFilters,
  type CascadingDimension,
} from "@/hooks/useCascadingFilters";

export default function Implementations() {
  const [filters, setFilters] = useState<ImplementationFilterState>({
    jurisdictions: [],
    approaches: [],
    searchQuery: "",
  });
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [groupByContinent, setGroupByContinent] = useState(false);

  const { data, isLoading, error } = useQuery<IpsImplementation[]>({
    queryKey: ["/api/implementations"],
  });

  const dimensions = useMemo<CascadingDimension<IpsImplementation>[]>(
    () => [
      { key: "jurisdictions", field: "jurisdiction", selected: filters.jurisdictions },
      { key: "approaches", field: "approach", selected: filters.approaches },
    ],
    [filters],
  );

  const { availableOptions, filtered } = useCascadingFilters<IpsImplementation>({
    data,
    dimensions,
    searchQuery: filters.searchQuery,
    searchFields: [
      "jurisdiction",
      "projectName",
      "primaryContact",
      "contactEmail",
      "infoWebsite",
      "approach",
    ],
    searchMode: "joinedFields",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Loading IPS implementations...</p>
            <p className="mt-2 text-sm text-muted-foreground">Fetching data from Google Sheets</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive">Error Loading Data</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Failed to fetch IPS implementations"}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Please check the Google Sheets URL configuration and ensure the sheet is publicly
              accessible.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-card py-6 md:py-10">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <h2
                className="text-2xl font-bold md:text-3xl"
                style={{ color: "hsl(348, 83%, 47%)" }}
                data-testid="text-impl-title"
              >
                IPS Implementation Registry
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
                Explore jurisdictions implementing the International Patient Summary, organized by
                country and project. Tap "Contacts" on any entry to reveal the primary contacts and
                emails.
              </p>
            </div>
          </div>
        </section>

        <ImplementationFilters
          filters={filters}
          onChange={setFilters}
          availableOptions={{
            jurisdictions: availableOptions.jurisdictions ?? [],
            approaches: availableOptions.approaches ?? [],
          }}
        />

        <section className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" data-testid="text-impl-count">
                Showing {filtered.length} of {data?.length ?? 0} implementations
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {viewMode === "cards" && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="group-continent"
                      checked={groupByContinent}
                      onCheckedChange={setGroupByContinent}
                      data-testid="switch-group-continent"
                    />
                    <Label htmlFor="group-continent" className="text-sm cursor-pointer">
                      Group by Continent
                    </Label>
                  </div>
                )}
                <div className="flex gap-1 rounded-md border p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="gap-1.5 min-h-[44px] sm:min-h-0"
                    data-testid="button-view-table"
                  >
                    <TableIcon className="h-4 w-4" />
                    <span>List View</span>
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="gap-1.5 min-h-[44px] sm:min-h-0"
                    data-testid="button-view-cards"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Item View</span>
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === "table" ? (
              <ImplementationsTable results={filtered} />
            ) : (
              <ImplementationsCards
                results={filtered}
                groupByContinent={groupByContinent}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
