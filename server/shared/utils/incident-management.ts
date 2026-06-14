import type {
  EquipmentIncidentListItem,
  EquipmentIncidentRow,
  IncidentPersonnelReference,
} from '../models'

const toSingleReference = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const formatPersonnelName = (personnel: IncidentPersonnelReference | null): string | null => {
  if (!personnel) {
    return null
  }

  const givenNames = [personnel.first_name, personnel.middle_name]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')

  return [personnel.last_name, givenNames]
    .filter(part => part.trim().length > 0)
    .join(', ')
}

