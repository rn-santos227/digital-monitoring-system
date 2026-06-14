export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const isValidEmail = (value: string): boolean => {
  return EMAIL_PATTERN.test(value.trim().toLowerCase())
}
