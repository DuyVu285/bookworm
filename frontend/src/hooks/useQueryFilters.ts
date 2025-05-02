// hooks/useQueryFilters.ts
import { useSearchParams } from "react-router-dom";

export const FILTER_KEYS = {
  CATEGORY: "Category",
  AUTHOR: "Author",
  RATING: "Rating",
  PAGE: "page",
  LIMIT: "limit",
  SORT: "sort",
} as const;

export type FilterKey = keyof typeof FILTER_KEYS;

export function useQueryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string): string | undefined => {
    return searchParams.get(key) ?? undefined;
  };

  const getIntParam = (key: string): number | undefined => {
    const value = getParam(key);
    const parsed = parseInt(value || "");
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const updateParams = (
    updates: Record<string, string | undefined>,
    resetPageKey?: string
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset page on update
    if (resetPageKey && !(resetPageKey in updates)) {
      newParams.set(resetPageKey, "1");
    }

    setSearchParams(newParams);
  };

  return {
    getParam,
    getIntParam,
    updateParams,
    searchParams,
  };
}
