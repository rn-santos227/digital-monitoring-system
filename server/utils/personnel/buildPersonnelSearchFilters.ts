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

export const buildPersonnelSearchFilters = (term: string, fields?: string) => {
  const rawFields = typeof fields === 'string' ? fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_PERSONNEL_FIELDS => field in SEARCHABLE_PERSONNEL_FIELDS)
    : Object.keys(SEARCHABLE_PERSONNEL_FIELDS) as Array<keyof typeof SEARCHABLE_PERSONNEL_FIELDS>

  return selectedFields.map(field => `${SEARCHABLE_PERSONNEL_FIELDS[field]}.ilike.%${term}%`)
}
