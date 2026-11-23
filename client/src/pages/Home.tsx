import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { FilterSection, type FilterState } from "@/components/FilterSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Footer } from "@/components/Footer";
import type { VendorResult } from "@shared/schema";
import { Loader2 } from "lucide-react";
import {
  useCascadingFilters,
  type CascadingDimension,
} from "@/hooks/useCascadingFilters";

/**
 * Vendor Registry page (`/vendors`). Fetches vendor entries, applies the
 * cascading filters and global search, and renders the heading, filters, and the
 * table/card results section.
 */
export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    statuses: [],
    actors: [],
    years: [],
    events: [],
    searchQuery: '',
  });

  // Fetch vendor results from API
  const { data: vendorResults, isLoading, error } = useQuery<VendorResult[]>({
    queryKey: ['/api/vendor-results'],
  });

  // The actor filter uses fixed substring choices; other options cascade.
  const dimensions = useMemo<CascadingDimension<VendorResult>[]>(
    () => [
      { key: "companies", field: "company", selected: filters.companies },
      { key: "statuses", field: "status", selected: filters.statuses },
      { key: "actors", field: "actor", selected: filters.actors, match: "contains" },
      { key: "years", field: "year", selected: filters.years },
      { key: "events", field: "event", selected: filters.events },
    ],
    [filters],
  );

  const { availableOptions, filtered: filteredResults } = useCascadingFilters<VendorResult>({
    data: vendorResults,
    dimensions,
    searchQuery: filters.searchQuery,
    searchFields: [
      "company",
      "status",
      "actor",
      "year",
      "event",
      "website",
      "product",
      "primaryContact",
      "contactInfo",
    ],
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Loading vendor registry...</p>
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
              {error instanceof Error ? error.message : "Failed to fetch vendor results"}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Please check the Google Sheets URL configuration and ensure the sheet is publicly accessible.
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
              <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "hsl(348, 83%, 47%)" }}>
                IPS Vendor Registry
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
                Explore vendor products, implementation status, and validation events for the International Patient Summary.
              </p>
            </div>
          </div>
        </section>
        <FilterSection
          filters={filters}
          onChange={setFilters}
          availableOptions={{
            companies: availableOptions.companies ?? [],
            statuses: availableOptions.statuses ?? [],
            years: availableOptions.years ?? [],
            events: availableOptions.events ?? [],
          }}
        />
        <ResultsSection results={filteredResults} />
      </main>
      <Footer />
    </div>
  );
}
