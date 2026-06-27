import { FilterPanel, type FilterPanelDimension } from "./FilterPanel";

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

type DimensionKey = "companies" | "profiles" | "actors" | "years" | "events";

/**
 * Vendor Results filter bar. A thin adapter that maps the screen's five filter
 * dimensions (company, profile, actor, year, event) and global search onto the
 * shared {@link FilterPanel}.
 *
 * @param filters - Current filter selections and search query.
 * @param onChange - Callback invoked with the next filter state.
 * @param availableOptions - Cascading options available for each dimension.
 */
export function FilterSection({ filters, onChange, availableOptions }: FilterSectionProps) {
  const update = (key: DimensionKey, value: string[]) => {
    onChange({ ...filters, [key]: value });
  };

  const dimensions: FilterPanelDimension<DimensionKey>[] = [
    {
      key: "companies",
      selectLabel: "Company",
      badgeLabel: "Company",
      placeholder: "All companies",
      options: availableOptions.companies,
      selected: filters.companies,
      onChange: (v) => update("companies", v),
    },
    {
      key: "profiles",
      selectLabel: "IHE Profile",
      badgeLabel: "Profile",
      placeholder: "All profiles",
      options: availableOptions.profiles,
      selected: filters.profiles,
      onChange: (v) => update("profiles", v),
    },
    {
      key: "actors",
      selectLabel: "Actor",
      badgeLabel: "Actor",
      placeholder: "All actors",
      options: availableOptions.actors,
      selected: filters.actors,
      onChange: (v) => update("actors", v),
    },
    {
      key: "years",
      selectLabel: "Year",
      badgeLabel: "Year",
      placeholder: "All years",
      options: availableOptions.years,
      selected: filters.years,
      onChange: (v) => update("years", v),
    },
    {
      key: "events",
      selectLabel: "Event",
      badgeLabel: "Event",
      placeholder: "All events",
      options: availableOptions.events,
      selected: filters.events,
      onChange: (v) => update("events", v),
    },
  ];

  return (
    <FilterPanel
      title="Filter Results"
      drawerDescription="Select one or more filters to narrow down results"
      searchPlaceholder="Search by company, product, contact, or any field..."
      searchValue={filters.searchQuery}
      onSearchChange={(v) => onChange({ ...filters, searchQuery: v })}
      dimensions={dimensions}
      desktopGridClass="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-5"
      onResetAll={() =>
        onChange({
          companies: [],
          profiles: [],
          actors: [],
          years: [],
          events: [],
          searchQuery: "",
        })
      }
      onRemoveFilter={(key, value) =>
        update(key, filters[key].filter((v) => v !== value))
      }
      idScope=""
    />
  );
}
