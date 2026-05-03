import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { mapDeploymentRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteDeploymentRecordById } from '../../../utils/deployment-records/deleteDeploymentRecordById'
import { getDeploymentRecordById } from '../../../utils/deployment-records/getDeploymentRecordById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentManage)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment record id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getDeploymentRecordById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })
  }

  try {
    await deleteDeploymentRecordById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordDelete,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsDelete,
      recordId: id,
      oldData: { ...mapDeploymentRecordListItem(existingRow) } as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment record deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordDelete,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsDelete,
      recordId: id,
      oldData: { ...mapDeploymentRecordListItem(existingRow) } as Record<string, unknown>,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
