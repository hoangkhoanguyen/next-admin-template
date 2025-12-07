import { useState } from "react";
import { FilterItem } from "./FilterManager";

export interface UseFiltersOptions {
  initialFilters?: FilterItem[];
}

export function useFilters(options?: UseFiltersOptions) {
  const [filters, setFilters] = useState<FilterItem[]>(
    options?.initialFilters || []
  );

  const addFilter = (filter: FilterItem) => {
    setFilters((prev) => {
      // Replace if key exists
      const filtered = prev.filter((f) => f.key !== filter.key);
      return [...filtered, filter];
    });
  };

  const setMultipleFilters = (newFilters: FilterItem[]) => {
    setFilters(newFilters);
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  return {
    filters,
    setFilters,
    addFilter,
    setMultipleFilters,
    removeFilter,
    clearFilters,
  };
}
