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

export interface ImplementationFilterState {
  jurisdictions: string[];
  approaches: string[];
  searchQuery: string;
}

interface ImplementationFiltersProps {
  filters: ImplementationFilterState;
  onChange: (filters: ImplementationFilterState) => void;
  availableOptions: {
    jurisdictions: string[];
    approaches: string[];
  };
}

export function ImplementationFilters({
  filters,
  onChange,
  availableOptions,
}: ImplementationFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = (key: keyof ImplementationFilterState, value: string[] | string) => {
    onChange({ ...filters, [key]: value });
  };

  const resetAll = () => {
    onChange({ jurisdictions: [], approaches: [], searchQuery: "" });
  };

  const removeFilter = (key: "jurisdictions" | "approaches", value: string) => {
    onChange({ ...filters, [key]: filters[key].filter((v) => v !== value) });
  };

  const totalActive =
    filters.jurisdictions.length +
    filters.approaches.length +
    (filters.searchQuery ? 1 : 0);

  const filterControls = (
    <>
      <MultiSelectFilter
        label="Jurisdiction"
        options={availableOptions.jurisdictions}
        selected={filters.jurisdictions}
        onChange={(v) => update("jurisdictions", v)}
        placeholder="All jurisdictions"
      />
      <MultiSelectFilter
        label="Implementation Approach"
        options={availableOptions.approaches}
        selected={filters.approaches}
        onChange={(v) => update("approaches", v)}
        placeholder="All approaches"
      />
    </>
  );

  const allBadges = [
    { key: "jurisdictions" as const, label: "Jurisdiction", items: filters.jurisdictions },
    { key: "approaches" as const, label: "Approach", items: filters.approaches },
  ];

  return (
    <section className="border-b bg-card py-4 md:py-6">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h3 className="text-base font-semibold md:text-lg">Filter Implementations</h3>
            {totalActive > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                data-testid="button-impl-reset-filters"
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
                placeholder="Search by jurisdiction, project name, approach, or any field..."
                value={filters.searchQuery}
                onChange={(e) => update("searchQuery", e.target.value)}
                className="pl-9"
                data-testid="input-impl-search-all"
              />
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid">
            {filterControls}
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full gap-2 min-h-[44px]"
                  data-testid="button-impl-open-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>
                    Filters
                    {totalActive > 0 && ` (${totalActive})`}
                  </span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Implementations</DrawerTitle>
                  <DrawerDescription>
                    Narrow results by jurisdiction or approach
                  </DrawerDescription>
                </DrawerHeader>
                <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4">{filterControls}</div>
                </div>
                <DrawerFooter className="flex flex-row gap-2">
                  {totalActive > 0 && (
                    <Button
                      variant="outline"
                      onClick={resetAll}
                      className="flex-1 min-h-[44px]"
                      data-testid="button-impl-reset-filters-drawer"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                  <DrawerClose asChild>
                    <Button
                      className="flex-1 min-h-[44px]"
                      data-testid="button-impl-close-filters"
                    >
                      Done
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {totalActive > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
              {allBadges.map(({ key, label, items }) =>
                items.map((item) => (
                  <Badge
                    key={`${key}-${item}`}
                    variant="secondary"
                    className="gap-1"
                    data-testid={`badge-impl-filter-${item}`}
                  >
                    <span className="text-xs text-muted-foreground">{label}:</span>
                    <span className="max-w-[150px] truncate">{item}</span>
                    <button
                      onClick={() => removeFilter(key, item)}
                      className="ml-1 rounded-sm hover-elevate"
                      data-testid={`button-impl-remove-filter-${item}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
