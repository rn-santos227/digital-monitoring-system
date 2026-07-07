import type {
  ProfileDetailsPayload,
  ProfileEmailPayload,
  ProfileOtherDetailsPayload,
  ProfilePasswordPayload,
} from '~/types/domain/profile'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

interface FormValidationResult<TPayload> {
  payload: TPayload | null
  errors: Record<string, string>
}

const PASSWORD_MIN_LENGTH = 8

export const validateProfileDetailsForm = (form: { fullName: string }): FormValidationResult<ProfileDetailsPayload> => {
  const fieldValidation = validateFields([
    { field: 'fullName', label: 'Full name', value: form.fullName, required: true },
  ] as const)
  const fullName = fieldValidation.values.fullName ?? ''

  return Object.keys(fieldValidation.errors).length > 0
    ? { payload: null, errors: { ...fieldValidation.errors } }
    : { payload: { fullName }, errors: {} }
}

export const validateProfileEmailForm = (form: { email: string }): FormValidationResult<ProfileEmailPayload> => {
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
  ] as const)
  const email = fieldValidation.values.email ?? ''

  return Object.keys(fieldValidation.errors).length > 0
    ? { payload: null, errors: { ...fieldValidation.errors } }
    : { payload: { email }, errors: {} }
}

export const validateProfileOtherDetailsForm = (form: { avatarUrl: string }): FormValidationResult<ProfileOtherDetailsPayload> => ({
  payload: { avatarUrl: form.avatarUrl.trim() || null },
  errors: {},
})

export const validateProfilePasswordForm = (
  form: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  },
): FormValidationResult<ProfilePasswordPayload> => {
  const fieldValidation = validateFields([
    { field: 'currentPassword', label: 'Current password', value: form.currentPassword, required: true },
    { field: 'newPassword', label: 'New password', value: form.newPassword, required: true, minLength: PASSWORD_MIN_LENGTH },
  ] as const)
  const errors: Record<string, string> = { ...fieldValidation.errors }
  const currentPassword = fieldValidation.values.currentPassword ?? ''
  const newPassword = fieldValidation.values.newPassword ?? ''

  if (form.confirmPassword.trim() !== newPassword) {
    errors.confirmPassword = 'Password confirmation does not match.'
  }

  return Object.keys(errors).length > 0
    ? { payload: null, errors }
    : { payload: { currentPassword, newPassword }, errors }
}
