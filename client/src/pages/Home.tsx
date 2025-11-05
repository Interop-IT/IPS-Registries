import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FilterSection, type FilterState } from "@/components/FilterSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Footer } from "@/components/Footer";
import type { VendorResult } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    profiles: [],
    actors: [],
    years: [],
    events: [],
  });

  // Fetch vendor results from API
  const { data: vendorResults, isLoading, error } = useQuery<VendorResult[]>({
    queryKey: ['/api/vendor-results'],
  });

  // Get available options from all data
  const availableOptions = useMemo(() => {
    if (!vendorResults) {
      return {
        companies: [],
        profiles: [],
        actors: [],
        years: [],
        events: [],
      };
    }

    const getUniqueValues = (key: keyof VendorResult): string[] => {
      const values = vendorResults.map(r => r[key]).filter(Boolean);
      return Array.from(new Set(values)).sort();
    };

    return {
      companies: getUniqueValues('company'),
      profiles: getUniqueValues('profile'),
      actors: getUniqueValues('actor'),
      years: getUniqueValues('year'),
      events: getUniqueValues('event'),
    };
  }, [vendorResults]);

  // Filter results based on selected filters
  const filteredResults = useMemo(() => {
    if (!vendorResults) return [];

    return vendorResults.filter(result => {
      if (filters.companies.length > 0 && !filters.companies.includes(result.company)) {
        return false;
      }
      if (filters.profiles.length > 0 && !filters.profiles.includes(result.profile)) {
        return false;
      }
      if (filters.actors.length > 0 && !filters.actors.includes(result.actor)) {
        return false;
      }
      if (filters.years.length > 0 && !filters.years.includes(result.year)) {
        return false;
      }
      if (filters.events.length > 0 && !filters.events.includes(result.event)) {
        return false;
      }
      return true;
    });
  }, [filters, vendorResults]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!vendorResults || vendorResults.length === 0) {
      return {
        totalVendors: 0,
        totalResults: 0,
        latestEvent: "N/A",
      };
    }

    const uniqueVendors = new Set(vendorResults.map(r => r.company));
    const events = vendorResults.map(r => r.event).filter(Boolean);
    const latestEvent = events.length > 0 ? events[0] : "N/A";
    
    return {
      totalVendors: uniqueVendors.size,
      totalResults: vendorResults.length,
      latestEvent,
    };
  }, [vendorResults]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Loading vendor testing results...</p>
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
        <HeroSection
          totalVendors={stats.totalVendors}
          totalResults={stats.totalResults}
          latestEvent={stats.latestEvent}
        />
        <FilterSection
          filters={filters}
          onChange={setFilters}
          availableOptions={availableOptions}
        />
        <ResultsSection results={filteredResults} />
      </main>
      <Footer />
    </div>
  );
}
