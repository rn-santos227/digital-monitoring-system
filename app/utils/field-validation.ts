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

