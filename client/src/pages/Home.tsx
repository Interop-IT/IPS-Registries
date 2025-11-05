import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FilterSection, type FilterState } from "@/components/FilterSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Footer } from "@/components/Footer";
import { mockVendorResults, getUniqueValues } from "@/lib/mockData";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    profiles: [],
    actors: [],
    years: [],
    events: [],
  });

  // Get available options from all data
  const availableOptions = useMemo(() => ({
    companies: getUniqueValues(mockVendorResults, 'company'),
    profiles: getUniqueValues(mockVendorResults, 'profile'),
    actors: getUniqueValues(mockVendorResults, 'actor'),
    years: getUniqueValues(mockVendorResults, 'year'),
    events: getUniqueValues(mockVendorResults, 'event'),
  }), []);

  // Filter results based on selected filters
  const filteredResults = useMemo(() => {
    return mockVendorResults.filter(result => {
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
  }, [filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const uniqueVendors = new Set(mockVendorResults.map(r => r.company));
    const events = mockVendorResults.map(r => r.event);
    const latestEvent = events.length > 0 ? events[0] : "N/A";
    
    return {
      totalVendors: uniqueVendors.size,
      totalResults: mockVendorResults.length,
      latestEvent,
    };
  }, []);

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
