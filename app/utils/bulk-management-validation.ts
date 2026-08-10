import type { DeploymentBulkUpdateValues } from '~/types/domain/deployment'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import type { RankBulkUpdateValues } from '~/types/domain/rank'

export type DeploymentBulkUpdateFieldKey = keyof DeploymentBulkUpdateValues

export interface DeploymentBulkUpdateValidationResult {
  error: string
  payload: DeploymentBulkUpdateValues | null
}

export interface BulkUpdateValidationResult<T> {
  error: string
  payload: T | null
}


interface ValidateDeploymentBulkUpdateOptions {
  fields: readonly DeploymentBulkUpdateFieldKey[]
  form: Readonly<Partial<Record<DeploymentBulkUpdateFieldKey, string>>>
  enabled: Readonly<Partial<Record<DeploymentBulkUpdateFieldKey, boolean>>>
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
