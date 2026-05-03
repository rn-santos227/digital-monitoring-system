import type { ISODate } from '~/types/database.tables'

export function isEndDateOnOrAfterStartDate(startDate?: ISODate | null, endDate?: ISODate | null): boolean {
  if (!startDate || !endDate) return true
  return new Date(endDate).getTime() >= new Date(startDate).getTime()
}

export function isNonNegativeNumber(value?: number | null): boolean {
  if (value === null || value === undefined) return true
  return value >= 0
}

export function hasValueWhenRequired(
  isRequired: boolean,
  value?: string | null,
): boolean {
  if (!isRequired) return true
  return !!value && value.trim().length > 0
}
