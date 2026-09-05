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
