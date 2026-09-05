import type { PersonnelAdvancedSearchConditionRequest, PersonnelSearchOperator } from '../../shared/requests'

const SEARCHABLE_PERSONNEL_FIELDS = {
  personnelCode: 'personnel_code',
  serviceNumber: 'service_number',
  lastName: 'last_name',
  firstName: 'first_name',
  email: 'email',
  rankName: 'rank_name',
} as const

export interface PersonnelSearchFilter {
  column: string
  operator: 'eq' | 'neq' | 'ilike'
  value: string
}

const OPERATOR_VALUE_BUILDERS: Record<PersonnelSearchOperator, (value: string) => string> = {
  contains: value => `%${value}%`,
  equals: value => value,
  notEquals: value => value,
  startsWith: value => `${value}%`,
  endsWith: value => `%${value}`,
}

const normalizeSearchValue = (value: string): string => value
  .trim()
  .replace(/[(),]/g, ' ')
  .slice(0, 120)

export const buildPersonnelSearchFilters = (term: string, fields?: string): PersonnelSearchFilter[] => {
  const rawFields = typeof fields === 'string' ? fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_PERSONNEL_FIELDS => field in SEARCHABLE_PERSONNEL_FIELDS)
    : Object.keys(SEARCHABLE_PERSONNEL_FIELDS) as Array<keyof typeof SEARCHABLE_PERSONNEL_FIELDS>

  const normalizedTerm = normalizeSearchValue(term)
  return selectedFields.map(field => ({
    column: SEARCHABLE_PERSONNEL_FIELDS[field],
    operator: 'ilike',
    value: `%${normalizedTerm}%`,
  }))
}
