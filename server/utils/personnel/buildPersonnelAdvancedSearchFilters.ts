import { PERSONNEL_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import type { PersonnelAdvancedSearchConditionRequest, PersonnelSearchOperator } from '../../shared/requests'

const OPERATOR_VALUE_BUILDERS: Record<PersonnelSearchOperator, (value: string) => string> = {
  contains: value => `%${value}%`,
  equals: value => value,
  notEquals: value => value,
  startsWith: value => `${value}%`,
  endsWith: value => `%${value}`,
  between: value => value,
}

export const buildPersonnelAdvancedSearchFilters = (
  conditions: readonly PersonnelAdvancedSearchConditionRequest[],
  searchableFields: Readonly<Record<string, string>> = PERSONNEL_SEARCHABLE_FIELD_COLUMNS,
): PersonnelSearchFilter[] => conditions.flatMap((condition, conditionIndex) => {
  const field = condition.field ?? ''
  const operator = condition.operator ?? 'contains'
  const values = (condition.value ?? '')
    .split(',')
    .map(value => value.replace(/[()]/g, ' ').trim().slice(0, 120))
    .filter(Boolean)

  const column = searchableFields[field]
  if (!column || !(operator in OPERATOR_VALUE_BUILDERS) || !values.length) {
    return []
  }

  if (operator === 'between') {

  }

  return values.map(value => ({
    column,
    operator: operator === 'equals' ? 'eq' : operator === 'notEquals' ? 'neq' : 'ilike',
    value: OPERATOR_VALUE_BUILDERS[operator](value),
    conditionGroup: `condition-${conditionIndex}`,
  }))
})
