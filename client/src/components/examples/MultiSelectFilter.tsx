import { useState } from 'react';
import { MultiSelectFilter } from '../MultiSelectFilter';

export default function MultiSelectFilterExample() {
  const [selected, setSelected] = useState<string[]>([]);
  
  const options = [
    "Epic Systems Corporation",
    "Siemens Healthineers AG",
    "Altera Digital Health",
    "Centers for Disease Control and Prevention"
  ];

  return (
    <div className="w-[300px] p-8">
      <MultiSelectFilter
        label="Company"
        options={options}
        selected={selected}
        onChange={setSelected}
        placeholder="Select companies"
      />
    </div>
  );
}
