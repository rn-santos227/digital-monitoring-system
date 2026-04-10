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
