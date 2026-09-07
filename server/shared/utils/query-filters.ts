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
  let query = sourceQuery as unknown as AdvancedSearchQuery
  const expressionFor = (filter: PersonnelSearchFilter) => `${filter.column}.${filter.operator}."${filter.value.replace(/["\\]/g, '')}"`

  if (match === 'any') {
    return query.or(filters.map(expressionFor).join(',')) as unknown as TQuery
  }

  const groups = new Map<string, PersonnelSearchFilter[]>()
  filters.forEach((filter) => {
    const groupKey = filter.conditionGroup ?? `${filter.column}:${filter.operator}:${filter.value}`
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), filter])
  })

  groups.forEach((group) => {
    const first = group[0]
    if (group.length === 1 && first) {
      query = query.filter(first.column, first.operator, first.value)
      return
    }
    query = query.or(group.map(expressionFor).join(','))
  })

  return query as unknown as TQuery
}
