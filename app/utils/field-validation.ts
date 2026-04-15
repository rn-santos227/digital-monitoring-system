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

export const validateFields = (rules: readonly FieldValidationRule[]) => {
  const errors: FieldValidationMap = {}
  const values: Record<string, string> = {}

  rules.forEach((rule) => {
    const result = validateField(rule)
    values[rule.field] = result.value

    if (result.error) {
      errors[rule.field] = result.error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    values,
    errors,
  }
}

export const validateEmailField = (field: string, label: string, value: string) => {
  return validateField({
    field,
    label,
    value,
    required: true,
    pattern: REGEX_PATTERNS.email,
    patternMessage: `${label} must be a valid email address.`,
  })
}

export const validateDateRangeFields = (startDate: string, endDate: string): FieldValidationMap => {
  const errors: FieldValidationMap = {}

  if (startDate && !REGEX_PATTERNS.isoDate.test(startDate)) {
    errors.startDate = 'Start date must use YYYY-MM-DD format.'
  }

  if (endDate && !REGEX_PATTERNS.isoDate.test(endDate)) {
    errors.endDate = 'End date must use YYYY-MM-DD format.'
  }

  if (!errors.startDate && !errors.endDate && startDate && endDate && startDate > endDate) {
    errors.endDate = 'End date must be on or after the start date.'
  }

  return errors
}
