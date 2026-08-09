import type { DeploymentBulkUpdateValues } from '~/types/domain/deployment'

export type DeploymentBulkUpdateFieldKey = keyof DeploymentBulkUpdateValues
export interface DeploymentBulkUpdateValidationResult {
  error: string
  payload: DeploymentBulkUpdateValues | null
}
