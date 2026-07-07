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
