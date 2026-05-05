import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  DEPLOYMENT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import { mapDeploymentDetailListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteDeploymentById } from '../../../utils/deployments/deleteDeploymentById'
import { getDeploymentById } from '../../../utils/deployments/getDeploymentById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment id is required.')
  const supabase = getServiceSupabaseClient()
  const existingRow = await getDeploymentById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })
  }

  try {
    await deleteDeploymentById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentDelete,
      tableName: 'deployments',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsDelete,
      recordId: id,
      oldData: { ...mapDeploymentDetailListItem(existingRow) } as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentDelete,
      tableName: 'deployments',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsDelete,
      recordId: id,
      oldData: { ...mapDeploymentDetailListItem(existingRow) } as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
