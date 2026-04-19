import type { PersonnelSearchQuery } from '~/types/domain/personnel'

export const PERSONNEL_SEARCHABLE_FIELDS: readonly NonNullable<PersonnelSearchQuery['fields']>[] = [
  'personnelCode',
  'serviceNumber',
  'lastName',
  'firstName',
  'rankName',
]
