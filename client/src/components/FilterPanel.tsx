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

export interface FilterPanelDimension<K extends string = string> {
  // Filter state key, used to build remove-filter callbacks
  key: K;
  // Label shown above the multi-select control
  selectLabel: string;
  // Label prefix shown in active-filter badges
  badgeLabel: string;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}

interface FilterPanelProps<K extends string = string> {
  // Heading text, shared by the section title and the mobile drawer title
  title: string;
  drawerDescription: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  dimensions: FilterPanelDimension<K>[];
  // Tailwind classes for the desktop multi-select grid (column count varies)
  desktopGridClass: string;
  onResetAll: () => void;
  onRemoveFilter: (key: K, value: string) => void;
  // Scope inserted into data-testids ("" for results, "impl-" for implementations)
  idScope: string;
}

/**
 * Unified filter panel (search box + multi-select filters + active-filter
 * badges, with a mobile drawer) shared by the Vendor Results and IPS
 * Implementation Registry screens. Each screen supplies its own dimensions,
 * labels, grid layout, and test-id scope via props.
 *
 * @param title - Heading shown in the section and mobile drawer.
 * @param drawerDescription - Description text in the mobile drawer.
 * @param searchPlaceholder - Placeholder for the global search input.
 * @param searchValue - Current global search text.
 * @param onSearchChange - Callback for search input changes.
 * @param dimensions - The multi-select filter dimensions to render.
 * @param desktopGridClass - Tailwind classes for the desktop filter grid.
 * @param onResetAll - Clears all filters and the search query.
 * @param onRemoveFilter - Removes a single selected value from a dimension.
 * @param idScope - Prefix inserted into data-testids to keep both screens unique.
 */
export function FilterPanel<K extends string = string>({
  title,
  drawerDescription,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  dimensions,
  desktopGridClass,
  onResetAll,
  onRemoveFilter,
  idScope,
}: Readonly<FilterPanelProps<K>>) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalActive =
    dimensions.reduce((sum, d) => sum + d.selected.length, 0) +
    (searchValue ? 1 : 0);

  const filterControls = (
    <>
      {dimensions.map((d) => (
        <MultiSelectFilter
          key={d.key}
          label={d.selectLabel}
          options={d.options}
          selected={d.selected}
          onChange={d.onChange}
          placeholder={d.placeholder}
        />
      ))}
    </>
  );

  return (
    <section className="border-b bg-card py-4 md:py-6">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <h3 className="text-base font-semibold md:text-lg">{title}</h3>
            {totalActive > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetAll}
                data-testid={`button-${idScope}reset-filters`}
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
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                data-testid={`input-${idScope}search-all`}
              />
            </div>
          </div>

          {/* Desktop Filters */}
          <div className={desktopGridClass}>{filterControls}</div>

          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full gap-2 min-h-[44px]"
                  data-testid={`button-${idScope}open-filters`}
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
                  <DrawerTitle>{title}</DrawerTitle>
                  <DrawerDescription>{drawerDescription}</DrawerDescription>
                </DrawerHeader>
                <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4">{filterControls}</div>
                </div>
                <DrawerFooter className="flex flex-row gap-2">
                  {totalActive > 0 && (
                    <Button
                      variant="outline"
                      onClick={onResetAll}
                      className="flex-1 min-h-[44px]"
                      data-testid={`button-${idScope}reset-filters-drawer`}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  )}
                  <DrawerClose asChild>
                    <Button
                      className="flex-1 min-h-[44px]"
                      data-testid={`button-${idScope}close-filters`}
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
              {dimensions.map((d) =>
                d.selected.map((item) => (
                  <Badge
                    key={`${d.key}-${item}`}
                    variant="secondary"
                    className="gap-1"
                    data-testid={`badge-${idScope}filter-${item}`}
                  >
                    <span className="text-xs text-muted-foreground">
                      {d.badgeLabel}:
                    </span>
                    <span className="max-w-[150px] truncate">{item}</span>
                    <button
                      onClick={() => onRemoveFilter(d.key, item)}
                      className="ml-1 rounded-sm hover-elevate"
                      aria-label={`Remove ${d.badgeLabel} filter: ${item}`}
                      data-testid={`button-${idScope}remove-filter-${item}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
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
