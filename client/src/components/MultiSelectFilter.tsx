import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const clearAll = () => {
    onChange([]);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            data-testid={`button-filter-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="truncate">
              {selected.length > 0
                ? `${selected.length} selected`
                : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="flex flex-col">
            <div className="border-b p-2">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
                data-testid={`input-search-${label.toLowerCase().replace(/\s+/g, '-')}`}
              />
            </div>
            <div className="max-h-64 overflow-auto p-2">
              {filteredOptions.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No results found
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover-elevate active-elevate-2",
                        selected.includes(option) && "bg-accent"
                      )}
                      onClick={() => toggleOption(option)}
                      data-testid={`option-${option}`}
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border",
                        selected.includes(option) && "border-primary bg-primary text-primary-foreground"
                      )}>
                        {selected.includes(option) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="flex-1 truncate">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selected.length > 0 && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="w-full"
                  data-testid={`button-clear-${label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
