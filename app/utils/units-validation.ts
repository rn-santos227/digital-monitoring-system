import { validateField } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'
import type { CreateBattalionPayload, CreateCompanyPayload } from '~/types/domain/units'

interface ValidationResult<TPayload> {
  errors: Record<string, string>
  payload: TPayload | null
}

export const validateCreateBattalionForm = (input: {
  code: string
  name: string
  isActive: boolean
}): ValidationResult<CreateBattalionPayload> => {
  const codeValidation = validateField({
    field: 'code',
    label: 'Battalion code',
    value: input.code,
    required: true,
    maxLength: 60,
    pattern: REGEX_PATTERNS.alphaNumericSpace,
    patternMessage: 'Battalion code allows letters, numbers, spaces, periods, underscores, and hyphens only.',
  })

  const nameValidation = validateField({
    field: 'name',
    label: 'Battalion name',
    value: input.name,
    required: true,
    maxLength: 120,
    pattern: REGEX_PATTERNS.alphaNumericSpace,
    patternMessage: 'Battalion name allows letters, numbers, spaces, periods, underscores, and hyphens only.',
  })

  const errors: Record<string, string> = {
    ...(codeValidation.error ? { code: codeValidation.error } : {}),
    ...(nameValidation.error ? { name: nameValidation.error } : {}),
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null }
  }

  return {
    errors,
    payload: {
      code: codeValidation.value,
      name: nameValidation.value,
      isActive: input.isActive,
    },
  }
}

export const validateCreateCompanyForm = (input: {
  battalionId: string
  code: string
  name: string
  isActive: boolean
}): ValidationResult<CreateCompanyPayload> => {
  const battalionIdValidation = validateField({
    field: 'battalionId',
    label: 'Battalion id',
    value: input.battalionId,
    required: false,
    maxLength: 64,
    pattern: REGEX_PATTERNS.uuid,
    patternMessage: 'Battalion id must be a valid UUID.',
  })

  const codeValidation = validateField({
    field: 'code',
    label: 'Company code',
    value: input.code,
    required: true,
    maxLength: 60,
    pattern: REGEX_PATTERNS.alphaNumericSpace,
    patternMessage: 'Company code allows letters, numbers, spaces, periods, underscores, and hyphens only.',
  })

  const nameValidation = validateField({
    field: 'name',
    label: 'Company name',
    value: input.name,
    required: true,
    maxLength: 120,
    pattern: REGEX_PATTERNS.alphaNumericSpace,
    patternMessage: 'Company name allows letters, numbers, spaces, periods, underscores, and hyphens only.',
  })

  const errors: Record<string, string> = {
    ...(battalionIdValidation.error ? { battalionId: battalionIdValidation.error } : {}),
    ...(codeValidation.error ? { code: codeValidation.error } : {}),
    ...(nameValidation.error ? { name: nameValidation.error } : {}),
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null }
  }

  return {
    errors,
    payload: {
      battalionId: battalionIdValidation.value || null,
      code: codeValidation.value,
      name: nameValidation.value,
      isActive: input.isActive,
    },
  }
}
