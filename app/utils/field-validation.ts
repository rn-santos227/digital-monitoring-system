import { REGEX_PATTERNS } from '~/utils/regex'

export interface FieldValidationRule {
  field: string
  label: string
  value: string
  required?: boolean
  trim?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  patternMessage?: string
}

export interface FieldValidationResult {
  isValid: boolean
  value: string
  error: string
}

export type FieldValidationMap = Record<string, string>

const REQUIRED_MESSAGE_SUFFIX = ' is required.'

export const validateField = (rule: FieldValidationRule): FieldValidationResult => {
  const shouldTrim = rule.trim ?? true
  const normalizedValue = shouldTrim ? rule.value.trim() : rule.value

  if (rule.required && !normalizedValue) {
    return {
      isValid: false,
      value: normalizedValue,
      error: `${rule.label}${REQUIRED_MESSAGE_SUFFIX}`,
    }
  }

  if (!normalizedValue) {
    return {
      isValid: true,
      value: normalizedValue,
      error: '',
    }
  }

  if (rule.minLength && normalizedValue.length < rule.minLength) {
    return {
      isValid: false,
      value: normalizedValue,
      error: `${rule.label} must be at least ${rule.minLength} characters.`,
    }
  }

  if (rule.maxLength && normalizedValue.length > rule.maxLength) {
    return {
      isValid: false,
      value: normalizedValue,
      error: `${rule.label} must not exceed ${rule.maxLength} characters.`,
    }
  }

  if (rule.pattern && !rule.pattern.test(normalizedValue)) {
    return {
      isValid: false,
      value: normalizedValue,
      error: rule.patternMessage ?? `${rule.label} is invalid.`,
    }
  }

  return {
    isValid: true,
    value: normalizedValue,
    error: '',
  }
}
