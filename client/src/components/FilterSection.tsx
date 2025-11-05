import { MultiSelectFilter } from "./MultiSelectFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, RotateCcw, Search } from "lucide-react";

export interface FilterState {
  companies: string[];
  profiles: string[];
  actors: string[];
  years: string[];
  events: string[];
  searchQuery: string;
}

interface FilterSectionProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableOptions: {
    companies: string[];
    profiles: string[];
    actors: string[];
    years: string[];
    events: string[];
  };
}

export function FilterSection({ filters, onChange, availableOptions }: FilterSectionProps) {
  const updateFilter = (key: keyof FilterState, value: string[]) => {
    onChange({ ...filters, [key]: value });
  };

  const resetAllFilters = () => {
    onChange({
      companies: [],
      profiles: [],
      actors: [],
      years: [],
      events: [],
      searchQuery: '',
    });
  };

  const updateSearchQuery = (value: string) => {
    onChange({ ...filters, searchQuery: value });
  };

  const removeFilter = (key: keyof FilterState, value: string) => {
    if (key === 'searchQuery') {
      onChange({ ...filters, searchQuery: '' });
    } else {
      const currentValue = filters[key];
      if (Array.isArray(currentValue)) {
        onChange({
          ...filters,
          [key]: currentValue.filter((item: string) => item !== value),
        });
      }
    }
  };

  const totalActiveFilters = Object.values(filters).reduce((sum, value) => {
    if (Array.isArray(value)) {
      return sum + value.length;
    }
    return sum;
  }, 0) + (filters.searchQuery ? 1 : 0);

  const allFilters = [
    { key: 'companies' as const, label: 'Company', items: filters.companies },
    { key: 'profiles' as const, label: 'Profile', items: filters.profiles },
    { key: 'actors' as const, label: 'Actor', items: filters.actors },
    { key: 'years' as const, label: 'Year', items: filters.years },
    { key: 'events' as const, label: 'Event', items: filters.events },
  ];

  return (
    <section className="border-b bg-card py-6">
      <div className="container px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filter Results</h3>
            {totalActiveFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                data-testid="button-reset-filters"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All
              </Button>
            )}
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by company, product, contact, or any field..."
                value={filters.searchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MultiSelectFilter
              label="Company"
              options={availableOptions.companies}
              selected={filters.companies}
              onChange={(value) => updateFilter('companies', value)}
              placeholder="All companies"
            />
            <MultiSelectFilter
              label="IHE Profile"
              options={availableOptions.profiles}
              selected={filters.profiles}
              onChange={(value) => updateFilter('profiles', value)}
              placeholder="All profiles"
            />
            <MultiSelectFilter
              label="Actor"
              options={availableOptions.actors}
              selected={filters.actors}
              onChange={(value) => updateFilter('actors', value)}
              placeholder="All actors"
            />
            <MultiSelectFilter
              label="Year"
              options={availableOptions.years}
              selected={filters.years}
              onChange={(value) => updateFilter('years', value)}
              placeholder="All years"
            />
            <MultiSelectFilter
              label="Event"
              options={availableOptions.events}
              selected={filters.events}
              onChange={(value) => updateFilter('events', value)}
              placeholder="All events"
            />
          </div>

          {totalActiveFilters > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {allFilters.map(({ key, label, items }) =>
                items.map(item => (
                  <Badge
                    key={`${key}-${item}`}
                    variant="secondary"
                    className="gap-1"
                    data-testid={`badge-filter-${item}`}
                  >
                    <span className="text-xs text-muted-foreground">{label}:</span>
                    <span>{item}</span>
                    <button
                      onClick={() => removeFilter(key, item)}
                      className="ml-1 rounded-sm hover-elevate"
                      data-testid={`button-remove-filter-${item}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
