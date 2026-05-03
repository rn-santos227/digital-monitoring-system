const SEARCHABLE_PERSONNEL_FIELDS = [
  'personnel_code',
  'service_number',
  'full_name',
] as const

const escapePostgrestLikeTerm = (value: string): string => {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll(',', '\\,')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
}

export const buildPersonnelSuggestionFilters = (term: string): string[] => {
  const sanitizedTerm = escapePostgrestLikeTerm(term)
  return SEARCHABLE_PERSONNEL_FIELDS.map((field) => `${field}.ilike.%${sanitizedTerm}%`)
}
