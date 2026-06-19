export const REGEX_PATTERNS = Object.freeze({
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  isoDate: /^\d{4}-\d{2}-\d{2}$/,
  whitespace: /\s+/g,
  unsafeFileNameCharacters: /[^a-z0-9._-]/g,
  nonDigit: /[^0-9]/g,
})

export const UUID_PATTERN = REGEX_PATTERNS.uuid
export const EMAIL_PATTERN = REGEX_PATTERNS.email
export const ISO_DATE_PATTERN = REGEX_PATTERNS.isoDate

export const isValidEmail = (value: string): boolean => {
  return EMAIL_PATTERN.test(value.trim().toLowerCase())
}

export const normalizeWhitespaceToken = (value: unknown, separator: string): string => {
  return String(value ?? '').trim().replace(REGEX_PATTERNS.whitespace, separator)
}

export const stripUnsafeFileNameCharacters = (value: string): string => {
  return value.replace(REGEX_PATTERNS.unsafeFileNameCharacters, '')
}

