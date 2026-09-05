import { PERSONNEL_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import type { PersonnelAdvancedSearchConditionRequest, PersonnelSearchOperator } from '../../shared/requests'

const OPERATOR_VALUE_BUILDERS: Record<PersonnelSearchOperator, (value: string) => string> = {
  contains: value => `%${value}%`,
  equals: value => value,
  notEquals: value => value,
  startsWith: value => `${value}%`,
  endsWith: value => `%${value}`,
}

export const buildPersonnelAdvancedSearchFilters = (
  conditions: readonly PersonnelAdvancedSearchConditionRequest[],
): PersonnelSearchFilter[] => conditions.flatMap((condition) => {
  const field = condition.field ?? ''
  const operator = condition.operator ?? 'contains'
  const value = (condition.value ?? '')
    .trim()
    .replace(/[(),]/g, ' ')
    .slice(0, 120)

  if (!(field in PERSONNEL_SEARCHABLE_FIELD_COLUMNS) || !(operator in OPERATOR_VALUE_BUILDERS) || !value) {
    return []
  }

  const typedField = field as keyof typeof PERSONNEL_SEARCHABLE_FIELD_COLUMNS
  return [{
    column: PERSONNEL_SEARCHABLE_FIELD_COLUMNS[typedField],
    operator: operator === 'equals' ? 'eq' : operator === 'notEquals' ? 'neq' : 'ilike',
    value: OPERATOR_VALUE_BUILDERS[operator](value),
  }]
})
