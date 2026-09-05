import { PERSONNEL_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'

export const buildPersonnelSearchFilters = (term: string, fields?: string): PersonnelSearchFilter[] => {
  const rawFields = typeof fields === 'string' ? fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof PERSONNEL_SEARCHABLE_FIELD_COLUMNS => (
        field in PERSONNEL_SEARCHABLE_FIELD_COLUMNS
      ))
    : Object.keys(PERSONNEL_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof PERSONNEL_SEARCHABLE_FIELD_COLUMNS>

  const normalizedTerm = term
    .trim()
    .replace(/[(),]/g, ' ')
    .slice(0, 120)

  return selectedFields.map(field => ({
    column: PERSONNEL_SEARCHABLE_FIELD_COLUMNS[field],
    operator: 'ilike',
    value: `%${normalizedTerm}%`,
  }))
}
