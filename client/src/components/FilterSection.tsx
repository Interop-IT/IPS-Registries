import { useState } from "react";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const filterControls = (
    <>
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
    </>
  );

  return (
    <section className="border-b bg-card py-4 md:py-6">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h3 className="text-base font-semibold md:text-lg">Filter Results</h3>
            {totalActiveFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                data-testid="button-reset-filters"
                className="min-h-[44px] sm:min-h-0"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Reset All</span>
                <span className="sm:hidden">Reset</span>
              </Button>
            )}
          </div>

          <div className="mb-3 md:mb-4">
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

          {/* Desktop Filters */}
          <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-5">
            {filterControls}
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 min-h-[44px]"
                  data-testid="button-open-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>
                    Filters
                    {totalActiveFilters > 0 && ` (${totalActiveFilters})`}
                  </span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Results</DrawerTitle>
                  <DrawerDescription>
                    Select one or more filters to narrow down results
                  </DrawerDescription>
                </DrawerHeader>
                <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4">
                    {filterControls}
                  </div>
                </div>
                <DrawerFooter className="flex flex-row gap-2">
                  {totalActiveFilters > 0 && (
                    <Button
                      variant="outline"
                      onClick={resetAllFilters}
                      className="flex-1 min-h-[44px]"
                      data-testid="button-reset-filters-drawer"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                  <DrawerClose asChild>
                    <Button className="flex-1 min-h-[44px]" data-testid="button-close-filters">
                      Done
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {totalActiveFilters > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
              {allFilters.map(({ key, label, items }) =>
                items.map(item => (
                  <Badge
                    key={`${key}-${item}`}
                    variant="secondary"
                    className="gap-1"
                    data-testid={`badge-filter-${item}`}
                  >
                    <span className="text-xs text-muted-foreground">{label}:</span>
                    <span className="max-w-[150px] truncate">{item}</span>
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
