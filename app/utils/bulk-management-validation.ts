import type { DeploymentBulkUpdateValues } from '~/types/domain/deployment'

export type DeploymentBulkUpdateFieldKey = keyof DeploymentBulkUpdateValues

export interface DeploymentBulkUpdateValidationResult {
  error: string
  payload: DeploymentBulkUpdateValues | null
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

  })

  return {
    error: '',
    payload,
  }
}
