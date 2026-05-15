import { DATE_FORMAT_VALUES, type DateFormat } from '~/types/enums'

const DATE_FORMAT_ALIASES: Readonly<Record<string, DateFormat>> = Object.freeze({
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'yyyy-MM-DD': 'yyyy-MM-dd',
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'DD-MM-YYYY': 'dd-MM-yyyy',
})

export const DEFAULT_DATE_FORMAT: DateFormat = 'yyyy-MM-dd'

export const normalizeDateFormat = (value: string | null | undefined): DateFormat => {
  if (!value) {
    return DEFAULT_DATE_FORMAT
  }

  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return DEFAULT_DATE_FORMAT
  }

  const matchedValue = DATE_FORMAT_VALUES.find((format) => format === trimmedValue)
  if (matchedValue) {
    return matchedValue
  }

  return DATE_FORMAT_ALIASES[trimmedValue] ?? DEFAULT_DATE_FORMAT
}
