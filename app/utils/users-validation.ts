import type { CreateAccountTypePayload, CreateUserProfilePayload } from '~/types/domain/users'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export interface UserProfileFormState {
  email: string
  fullName: string
  avatarUrl: string
  password: string
  confirmPassword: string
  accountTypeIds: string[]
}

export interface AccountTypeFormState {
  code: string
  name: string
  description: string
  isSystem: boolean
}

export interface FormValidationResult<TPayload> {
  payload: TPayload | null
  errors: Record<string, string>
}

const PASSWORD_MIN_LENGTH = 8

export const validateUserProfileForm = (form: UserProfileFormState): FormValidationResult<CreateUserProfilePayload> => {
  const normalizedEmail = form.email.trim().toLowerCase()
  const fieldValidation = validateFields([
    {
      field: 'email',
      label: 'Email',
      value: normalizedEmail,
      required: true,
      pattern: REGEX_PATTERNS.email,
      patternMessage: 'Please provide a valid email address.',
    },
    {
      field: 'fullName',
      label: 'Full name',
      value: form.fullName,
      required: true,
    },
    {
      field: 'password',
      label: 'Password',
      value: form.password,
      required: true,
      minLength: PASSWORD_MIN_LENGTH,
    },
  ] as const)

  const errors: Record<string, string> = { ...fieldValidation.errors }
  const fullName = fieldValidation.values.fullName ?? ''
  const password = fieldValidation.values.password ?? ''
  const avatarUrl = form.avatarUrl.trim()

  if (form.confirmPassword.trim() !== password) {
    errors.confirmPassword = 'Password confirmation does not match.'
  }

  if (form.accountTypeIds.length === 0) {
    errors.accountTypeIds = 'Select at least one account type.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      payload: null,
      errors,
    }
  }

  return {
    payload: {
      email: normalizedEmail,
      fullName,
      password,
      avatarUrl: avatarUrl || null,
      accountTypeIds: form.accountTypeIds,
    },
    errors,
  }
}

export const validateAccountTypeForm = (form: AccountTypeFormState): FormValidationResult<CreateAccountTypePayload> => {
  const normalizedCode = form.code.trim().toLowerCase()
  const fieldValidation = validateFields([
    {
      field: 'code',
      label: 'Code',
      value: normalizedCode,
      required: true,
      pattern: REGEX_PATTERNS.alphaNumericSpace,
      patternMessage: 'Code may only include letters, numbers, spaces, dots, underscores, and hyphens.',
    },
    {
      field: 'name',
      label: 'Name',
      value: form.name,
      required: true,
    },
  ] as const)
  const errors: Record<string, string> = { ...fieldValidation.errors }
  const name = fieldValidation.values.name ?? ''
  const description = form.description.trim()

  if (Object.keys(errors).length > 0) {
    return {
      payload: null,
      errors,
    }
  }

  return {
    payload: {
      code: normalizedCode,
      name,
      description: description || null,
      isSystem: form.isSystem,
    },
    errors,
  }
}
