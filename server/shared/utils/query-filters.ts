import type { PersonnelSearchFilter } from '../models'

interface AdvancedSearchQuery {
  or: (expression: string) => AdvancedSearchQuery
  filter: (column: string, operator: string, value: string) => AdvancedSearchQuery
}

export function applyNullableFilter<TQuery extends { eq: (column: string, value: string) => TQuery; is: (column: string, value: null) => TQuery }>(
  query: TQuery,
  column: string,
  value: string | null,
) {
  if (value) {
    return query.eq(column, value)
  }

  return query.is(column, null)
}

export const applyPersonnelSearchFilters = <TQuery>(
  sourceQuery: TQuery,
  filters: readonly PersonnelSearchFilter[],
  match: 'any' | 'all',
): TQuery => {

}
