import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateDeploymentRecordRequest } from '../../shared/requests'
import type { CreateDeploymentRecordResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  DEPLOYMENT_DETAIL_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import {
  assertPersonnelExists,
  buildDeploymentRecordNo,
  mapDeploymentDetailListItem,
  resolvePersonnelServiceStatusId,
} from '../../shared/utils'
import { parseCreateDeploymentRecordPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<CreateDeploymentRecordResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentManage)
  const body = await readBody<CreateDeploymentRecordRequest>(event)
  const supabase = getServiceSupabaseClient()

  try {
    const payload = parseCreateDeploymentRecordPayload(body)

    await assertPersonnelExists({
      supabase,
      personnelId: payload.personnel_id,
      idSelectColumns: ID_ONLY_SELECT_COLUMNS,
    })

    if (payload.supervisor_id) {
      await assertPersonnelExists({
        supabase,
        personnelId: payload.supervisor_id,
        idSelectColumns: ID_ONLY_SELECT_COLUMNS,
      })
    }

    const insertPayload = {
      ...payload,
      record_no: buildDeploymentRecordNo(),
    }

    const deployedServiceStatusId = payload.supervisor_id
      ? await resolvePersonnelServiceStatusId(supabase, 'Deployed')
      : null

    let previousSupervisorServiceStatusId: string | null = null
    if (payload.supervisor_id) {
      const { data: previousSupervisorState, error: previousSupervisorStateError } = await supabase
        .from('personnel')
        .select('service_status_id')
        .eq('id', payload.supervisor_id)
        .maybeSingle<{ service_status_id: string | null }>()

      if (previousSupervisorStateError) {
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to read supervisor service status: ${previousSupervisorStateError.message}`,
        })
      }

      previousSupervisorServiceStatusId = previousSupervisorState?.service_status_id ?? null
    }

    const { data: newRow } = await supabase
      .from('deployment')
      .select(DEPLOYMENT_DETAIL_SELECT_COLUMNS)
      .eq('id', createdRow.id)
      .maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentCreate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsCreate,
      recordId: createdRow.id,
      requestData: body as Record<string, unknown>,
      newData: newRow
        ? ({ ...mapDeploymentDetailListItem(newRow) } as Record<string, unknown>)
        : insertPayload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment record created successfully.',
    })

    return { ok: true, id: createdRow.id }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentCreate,
      tableName: 'deployment',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsCreate,
      requestData: body as Record<string, unknown>,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
