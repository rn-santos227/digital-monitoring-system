const BOOLEAN_TRUE_VALUES = new Set(['1', 'true', 'yes'])
const BOOLEAN_FALSE_VALUES = new Set(['0', 'false', 'no'])

export const parseBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (BOOLEAN_TRUE_VALUES.has(normalized)) {
    return true
  }

  if (BOOLEAN_FALSE_VALUES.has(normalized)) {
    return false
  }

  return fallback
}

