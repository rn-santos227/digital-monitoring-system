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

