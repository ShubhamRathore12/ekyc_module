import trimObject from "@utils/trimObject";

/**
 * Determines if filters are applied based on the provided filters and currentFilters.
 *
 * @param {Filters} actualFilters - The filters to compare against currentFilters.
 * @param {Filters} currentFilters - The current filters.
 * @return {{ filtersApplied: boolean, currentFiltersApplied: boolean }} - An object containing the boolean values for if filters and currentFilters are applied.
 */

export function checkFilters<Filters extends Record<string, any>>(
  actualFilters: Filters,
  currentFilters: Filters
) {
  const actualFiltersApplied =
    Object.keys(trimObject<Filters>(actualFilters)).filter(
      (key) => key !== "page_number" && key !== "no_of_records"
    ).length !== 0;
  const currentFiltersApplied =
    Object.keys(trimObject<Filters>(currentFilters)).filter(
      (key) => key !== "page_number" && key !== "no_of_records"
    ).length !== 0;
  return { actualFiltersApplied, currentFiltersApplied };
}
