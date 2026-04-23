export const REGEX_PATTERNS = Object.freeze({
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  alphaNumericSpace: /^[A-Za-z0-9\s._-]+$/,
  isoDate: /^\d{4}-\d{2}-\d{2}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
})
