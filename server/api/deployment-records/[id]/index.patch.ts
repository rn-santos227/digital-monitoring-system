import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateDeploymentRecordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  DEPLOYMENT_RECORD_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { assertPersonnelExists, mapDeploymentRecordListItem } from '../../../shared/utils'
import { buildDeploymentRecordUpdates, requireRouteId, validateDeploymentDateRange } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentManage)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment record id is required.')
  const body = await readBody<UpdateDeploymentRecordRequest>(event)
  const updates = buildDeploymentRecordUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: existingRow, error: existingError } = await supabase
    .from('deployment_records')
    .select(DEPLOYMENT_RECORD_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read deployment record: ${existingError.message}` })
  }

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
    const { error } = await supabase.from('deployment_records').update(patchPayload).eq('id', id)
    if (error) {
      throw createError({ statusCode: 500, statusMessage: `Failed to update deployment record: ${error.message}` })
    }

    const { data: updatedRow } = await supabase
      .from('deployment_records')
      .select(DEPLOYMENT_RECORD_SELECT_COLUMNS)
      .eq('id', id)
      .maybeSingle()

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
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordUpdate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: { ...mapDeploymentRecordListItem(existingRow) } as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
