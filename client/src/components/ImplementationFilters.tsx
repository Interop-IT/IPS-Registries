import { FilterPanel, type FilterPanelDimension } from "./FilterPanel";

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

type DimensionKey = "jurisdictions" | "approaches";

/**
 * IPS Implementation Registry filter bar. A thin adapter that maps the screen's
 * two filter dimensions (jurisdiction, approach) and global search onto the
 * shared {@link FilterPanel}.
 *
 * @param filters - Current filter selections and search query.
 * @param onChange - Callback invoked with the next filter state.
 * @param availableOptions - Cascading options available for each dimension.
 */
export function ImplementationFilters({
  filters,
  onChange,
  availableOptions,
}: ImplementationFiltersProps) {
  const update = (key: DimensionKey, value: string[]) => {
    onChange({ ...filters, [key]: value });
  };

  const dimensions: FilterPanelDimension<DimensionKey>[] = [
    {
      key: "jurisdictions",
      selectLabel: "Jurisdiction",
      badgeLabel: "Jurisdiction",
      placeholder: "All jurisdictions",
      options: availableOptions.jurisdictions,
      selected: filters.jurisdictions,
      onChange: (v) => update("jurisdictions", v),
    },
    {
      key: "approaches",
      selectLabel: "Implementation Approach",
      badgeLabel: "Approach",
      placeholder: "All approaches",
      options: availableOptions.approaches,
      selected: filters.approaches,
      onChange: (v) => update("approaches", v),
    },
  ];

  return (
    <FilterPanel
      title="Filter Implementations"
      drawerDescription="Narrow results by jurisdiction or approach"
      searchPlaceholder="Search by jurisdiction, project name, approach, or any field..."
      searchValue={filters.searchQuery}
      onSearchChange={(v) => onChange({ ...filters, searchQuery: v })}
      dimensions={dimensions}
      desktopGridClass="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid"
      onResetAll={() =>
        onChange({ jurisdictions: [], approaches: [], searchQuery: "" })
      }
      onRemoveFilter={(key, value) =>
        update(key, filters[key].filter((v) => v !== value))
      }
      idScope="impl-"
    />
  );
}
