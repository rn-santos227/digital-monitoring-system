import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { UpdateDeploymentRecordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  ID_ONLY_SELECT_COLUMNS,
  DEPLOYMENT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import { assertPersonnelExists, mapDeploymentRecordListItem } from '../../../shared/utils'
import { buildDeploymentRecordUpdates, requireRouteId, validateDeploymentDateRange } from '../../../shared/validation'
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

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getDeploymentRecordById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })
  }

  const effectiveStartDate = updates.start_date ?? existingRow.start_date
  const effectiveEndDate = updates.end_date === undefined ? existingRow.end_date : updates.end_date
  validateDeploymentDateRange(effectiveStartDate, effectiveEndDate)

  const effectivePersonnelId = updates.personnel_id ?? existingRow.personnel_id
  await assertPersonnelExists({ supabase, personnelId: effectivePersonnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })

  const effectiveSupervisorId = updates.supervisor_id === undefined ? existingRow.supervisor_id : updates.supervisor_id
  if (effectiveSupervisorId) {
    await assertPersonnelExists({ supabase, personnelId: effectiveSupervisorId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
  }

  const patchPayload = {
    personnel_id: effectivePersonnelId,
    deployment_id: existingRow.deployment_id,
    deployment_area: updates.deployment_area ?? existingRow.deployment_area,
    deployment_area_latitude: updates.deployment_area_latitude === undefined ? existingRow.deployment_area_latitude : updates.deployment_area_latitude,
    deployment_area_longitude: updates.deployment_area_longitude === undefined ? existingRow.deployment_area_longitude : updates.deployment_area_longitude,
    assignment_role: updates.assignment_role === undefined ? existingRow.assignment_role : updates.assignment_role,
    operation_name: updates.operation_name === undefined ? existingRow.operation_name : updates.operation_name,
    start_date: effectiveStartDate,
    end_date: effectiveEndDate,
    status_id: updates.status_id ?? existingRow.status_id,
    location: updates.location === undefined ? existingRow.location : updates.location,
    supervisor_id: effectiveSupervisorId,
    remarks: updates.remarks === undefined ? existingRow.remarks : updates.remarks,
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
      message: 'Deployment record updated successfully.',
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
