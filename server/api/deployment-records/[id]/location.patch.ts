import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateDeploymentRecordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, DEPLOYMENT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapDeploymentRecordListItem } from '../../../shared/utils'
import { buildDeploymentRecordUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getDeploymentRecordById } from '../../../utils/deployment-records/getDeploymentRecordById'
import { updateDeploymentRecordById } from '../../../utils/deployment-records/updateDeploymentRecordById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment record id is required.')
  const body = await readBody<UpdateDeploymentRecordRequest>(event)
  const updates = buildDeploymentRecordUpdates(body)

  const supabase = getServiceSupabaseClient()
  const existingRow = await getDeploymentRecordById(supabase, id)
  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })
  }

  const patchPayload = {
    deployment_area: updates.deployment_area === undefined ? existingRow.deployment_area : updates.deployment_area,
    deployment_area_latitude: updates.deployment_area_latitude === undefined ? existingRow.deployment_area_latitude : updates.deployment_area_latitude,
    deployment_area_longitude: updates.deployment_area_longitude === undefined ? existingRow.deployment_area_longitude : updates.deployment_area_longitude,
    location: updates.location === undefined ? existingRow.location : updates.location,
  }

  try {
    await updateDeploymentRecordById(supabase, id, patchPayload)
    const updatedRow = await getDeploymentRecordById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordUpdate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: { ...mapDeploymentRecordListItem(existingRow) } as Record<string, unknown>,
      newData: updatedRow ? ({ ...mapDeploymentRecordListItem(updatedRow) } as Record<string, unknown>) : patchPayload,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment record location updated successfully.',
    })
    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordUpdate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: { ...mapDeploymentRecordListItem(existingRow) } as Record<string, unknown>,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })
    throw error
  }
})
