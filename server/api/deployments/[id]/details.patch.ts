import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { assertPersonnelExists } from '../../../shared/utils'
import { requireRouteId, validateDeploymentDateRange } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

interface UpdateDeploymentDetailsBody {
  assignment_role?: string | null
  operation_name?: string | null
  start_date?: string
  end_date?: string | null
  status_id?: string
  supervisor_id?: string | null
  default_remarks?: string | null
  remarks?: string | null
}

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment record id is required.')
  const body = await readBody<UpdateDeploymentDetailsBody>(event)
  const supabase = getServiceSupabaseClient()

  const { data: existingRow, error: existingError } = await supabase
    .from('deployment_records')
    .select('id,start_date,end_date,supervisor_id,assignment_role,operation_name,status_id,remarks')
    .eq('id', id)
    .maybeSingle()

  if (existingError) throw createError({ statusCode: 500, statusMessage: `Failed to read deployment record: ${existingError.message}` })
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })

  const effectiveStartDate = body.start_date ?? existingRow.start_date
  const effectiveEndDate = body.end_date === undefined ? existingRow.end_date : body.end_date
  validateDeploymentDateRange(effectiveStartDate, effectiveEndDate)

  const effectiveSupervisorId = body.supervisor_id === undefined ? existingRow.supervisor_id : body.supervisor_id
  if (effectiveSupervisorId) {
    await assertPersonnelExists({ supabase, personnelId: effectiveSupervisorId, idSelectColumns: 'id' })
  }

  const updates = {
    assignment_role: body.assignment_role ?? existingRow.assignment_role,
    operation_name: body.operation_name ?? existingRow.operation_name,
    start_date: effectiveStartDate,
    end_date: effectiveEndDate,
    status_id: body.status_id ?? existingRow.status_id,
    supervisor_id: effectiveSupervisorId,
    remarks: body.default_remarks ?? body.remarks ?? existingRow.remarks,
  }

  try {
    const { error } = await supabase.from('deployment_records').update(updates).eq('id', id)
    if (error) throw createError({ statusCode: 500, statusMessage: `Failed to update deployment details: ${error.message}` })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentUpdate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as Record<string, unknown>,
      newData: updates as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment details updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentUpdate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })
    throw error
  }
})
