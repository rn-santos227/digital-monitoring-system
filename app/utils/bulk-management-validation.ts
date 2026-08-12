import type { DeploymentBulkUpdateValues } from '~/types/domain/deployment'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import type { RankBulkUpdateValues } from '~/types/domain/rank'
import type {
  AccountTypeBulkUpdateValues,
  UserProfileBulkUpdateValues,
} from '~/types/domain/users'

export type DeploymentBulkUpdateFieldKey = keyof DeploymentBulkUpdateValues

export interface DeploymentBulkUpdateValidationResult {
  error: string
  payload: DeploymentBulkUpdateValues | null
}

export interface BulkUpdateValidationResult<T> {
  error: string
  payload: T | null
}

interface ValidatePersonnelBulkUpdateOptions {
  form: Readonly<Record<keyof PersonnelBulkUpdateValues, string>>
  enabled: Readonly<Record<keyof PersonnelBulkUpdateValues, boolean>>
}

interface ValidateDeploymentBulkUpdateOptions {
  fields: readonly DeploymentBulkUpdateFieldKey[]
  form: Readonly<Partial<Record<DeploymentBulkUpdateFieldKey, string>>>
  enabled: Readonly<Partial<Record<DeploymentBulkUpdateFieldKey, boolean>>>
}

interface ValidateUserProfileBulkUpdateOptions {
  enabled: Readonly<Record<keyof UserProfileBulkUpdateValues, boolean>>
  avatarUrl: string
  isActive: boolean
}

interface ValidateAccountTypeBulkUpdateOptions {
  enabled: Readonly<Record<keyof AccountTypeBulkUpdateValues, boolean>>
  description: string
  isSystem: boolean
}

export const validateDeploymentBulkUpdate = ({
  fields,
  form,
  enabled,
}: ValidateDeploymentBulkUpdateOptions): DeploymentBulkUpdateValidationResult => {
  const selectedFields = fields.filter((field) => enabled[field] ?? false)

  if (selectedFields.length === 0) {
    return {
      error: 'Select at least one field to update.',
      payload: null,
    }
  }

  const deploymentArea = form.deployment_area?.trim() ?? ''
  const startDate = form.start_date?.trim() ?? ''
  const endDate = form.end_date?.trim() ?? ''

  if (enabled.deployment_area && !deploymentArea) {
    return {
      error: 'Deployment area cannot be empty.',
      payload: null,
    }
  }

  if (enabled.start_date && !startDate) {
    return {
      error: 'Start date cannot be empty.',
      payload: null,
    }
  }

  if (enabled.start_date && enabled.end_date && endDate && endDate < startDate) {
    return {
      error: 'End date cannot be earlier than start date.',
      payload: null,
    }
  }

  const payload: DeploymentBulkUpdateValues = {}

  selectedFields.forEach((field) => {
    const value = form[field]?.trim() ?? ''

    if (field === 'deployment_area') {
      payload.deployment_area = value
      return
    }

    if (field === 'start_date') {
      payload.start_date = value
      return
    }

    if (field === 'assignment_role') payload.assignment_role = value || null
    if (field === 'operation_name') payload.operation_name = value || null
    if (field === 'end_date') payload.end_date = value || null
    if (field === 'location') payload.location = value || null
    if (field === 'remarks') payload.remarks = value || null
    if (field === 'default_remarks') payload.default_remarks = value || null
  })

  return {
    error: '',
    payload,
  }
}

export const validatePersonnelBulkUpdate = ({
  form,
  enabled,
}: ValidatePersonnelBulkUpdateOptions): BulkUpdateValidationResult<PersonnelBulkUpdateValues> => {
  const fields = Object.keys(enabled) as Array<keyof PersonnelBulkUpdateValues>
  const selectedFields = fields.filter((field) => enabled[field])
  if (selectedFields.length === 0) {
    return { error: 'Select at least one field to update.', payload: null }
  }

  const requiredFields: ReadonlyArray<keyof PersonnelBulkUpdateValues> = ['rank_id']
  const emptyRequiredField = requiredFields.find(
    (field) => enabled[field] && !form[field].trim(),
  )
  if (emptyRequiredField) {
    return { error: 'Rank cannot be empty.', payload: null }
  }

  const payload: PersonnelBulkUpdateValues = {}
  selectedFields.forEach((field) => {
    const value = form[field].trim()
    if (field === 'rank_id') payload.rank_id = value
    if (field === 'company_id') payload.company_id = value || null
    if (field === 'battalion_id') payload.battalion_id = value || null
    if (field === 'position') payload.position = value || null
  })

  return { error: '', payload }
}

export const validateRankBulkUpdate = (
  value: string,
): BulkUpdateValidationResult<RankBulkUpdateValues> => {
  const normalizedValue = value.trim()
  if (!normalizedValue) {
    return { error: 'Sort order is required.', payload: null }
  }

  const sortOrder = Number(normalizedValue)
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    return { error: 'Sort order must be a non-negative whole number.', payload: null }
  }

  return { error: '', payload: { sort_order: sortOrder } }
}

export const validateUserProfileBulkUpdate = ({
  enabled,
  avatarUrl,
  isActive,
}: ValidateUserProfileBulkUpdateOptions): BulkUpdateValidationResult<UserProfileBulkUpdateValues> => {
  if (!enabled.avatar_url && !enabled.is_active) {
    return { error: 'Select at least one field to update.', payload: null }
  }

  const normalizedAvatarUrl = avatarUrl.trim()
  if (enabled.avatar_url && normalizedAvatarUrl) {
    try {
      new URL(normalizedAvatarUrl)
    } catch {
      return { error: 'Avatar URL must be a valid URL.', payload: null }
    }
  }

  const payload: UserProfileBulkUpdateValues = {}
  if (enabled.avatar_url) payload.avatar_url = normalizedAvatarUrl || null
  if (enabled.is_active) payload.is_active = isActive

  return { error: '', payload }
}

export const validateAccountTypeBulkUpdate = ({
  enabled,
  description,
  isSystem,
}: ValidateAccountTypeBulkUpdateOptions): BulkUpdateValidationResult<AccountTypeBulkUpdateValues> => {

}
