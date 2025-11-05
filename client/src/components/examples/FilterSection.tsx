import { useState } from 'react';
import { FilterSection, type FilterState } from '../FilterSection';

export default function FilterSectionExample() {
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    profiles: [],
    actors: [],
    years: [],
    events: [],
  });

  const availableOptions = {
    companies: ["Epic Systems", "Siemens", "Altera Digital Health"],
    profiles: ["International Patient Summary"],
    actors: ["Content Consumer", "Content Creator"],
    years: ["2025", "2024", "2023"],
    events: ["North America 2025", "Europe 2024"],
  };

  return (
    <FilterSection
      filters={filters}
      onChange={setFilters}
      availableOptions={availableOptions}
    />
  );
}
