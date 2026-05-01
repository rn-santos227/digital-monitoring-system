import { createError, defineEventHandler, readBody } from 'h3'
import type { DeploymentRecordSourceRow } from '../../shared/models'
import type { CreateDeploymentRecordFromDeploymentRequest } from '../../shared/requests'
import type { CreateDeploymentRecordResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  DEPLOYMENT_RECORD_SELECT_COLUMNS,
  DEPLOYMENT_RECORD_SOURCE_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import {
  assertPersonnelExists,
  buildDeploymentRecordNo,
  mapDeploymentRecordListItem,
  resolvePersonnelServiceStatusId,
} from '../../shared/utils'
import { parseCreateDeploymentRecordFromDeploymentPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<CreateDeploymentRecordResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentManage)
  const body = await readBody<CreateDeploymentRecordFromDeploymentRequest>(event)
  const supabase = getServiceSupabaseClient()

  try {
    const payload = parseCreateDeploymentRecordFromDeploymentPayload(body)
    const { data: deployment, error: deploymentReadError } = await supabase
      .from('deployments')
      .select(DEPLOYMENT_RECORD_SOURCE_SELECT_COLUMNS)
      .eq('id', payload.deployment_id)
      .maybeSingle<DeploymentRecordSourceRow>()

    if (deploymentReadError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to read deployment source data: ${deploymentReadError.message}` })
    }

    if (!deployment) {
      throw createError({ statusCode: 404, statusMessage: 'Deployment not found.' })
    }

    await assertPersonnelExists({
      supabase,
      personnelId: payload.personnel_id,
      idSelectColumns: ID_ONLY_SELECT_COLUMNS,
    })

    if (deployment.supervisor_id) {
      await assertPersonnelExists({
        supabase,
        personnelId: deployment.supervisor_id,
        idSelectColumns: ID_ONLY_SELECT_COLUMNS,
      })
    }

    const insertPayload = {
      personnel_id: payload.personnel_id,
      deployment_id: deployment.id,
      deployment_area: deployment.deployment_area,
      deployment_area_latitude: deployment.deployment_area_latitude,
      deployment_area_longitude: deployment.deployment_area_longitude,
      assignment_role: deployment.assignment_role,
      operation_name: deployment.operation_name,
      start_date: deployment.start_date,
      end_date: deployment.end_date,
      status_id: deployment.status_id,
      location: deployment.location,
      supervisor_id: deployment.supervisor_id,
      remarks: payload.remarks ?? deployment.default_remarks ?? null,
      record_no: buildDeploymentRecordNo(),
    }

    const deployedServiceStatusId = await resolvePersonnelServiceStatusId(supabase, 'Deployed')
    const { data: previousPersonnelState, error: previousPersonnelStateError } = await supabase
      .from('personnel')
      .select('service_status_id')
      .eq('id', payload.personnel_id)
      .maybeSingle<{ service_status_id: string | null }>()

    if (previousPersonnelStateError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to read personnel service status: ${previousPersonnelStateError.message}`,
      })
    }

    const previousServiceStatusId = previousPersonnelState?.service_status_id ?? null

    const { createdId } = await executeWithRollback({
      operation: async () => {
        const { data: createdRow, error: insertError } = await supabase
          .from('deployment_records')
          .insert(insertPayload)
          .select('id')
          .maybeSingle<{ id: string }>()

        if (insertError || !createdRow?.id) {
          throw createError({
            statusCode: 500,
            statusMessage: `Failed to create deployment record: ${insertError?.message ?? 'Missing id.'}`,
          })
        }

        const { error: personnelUpdateError } = await supabase
          .from('personnel')
          .update({ service_status_id: deployedServiceStatusId })
          .eq('id', payload.personnel_id)

        if (personnelUpdateError) {
          throw createError({
            statusCode: 500,
            statusMessage: `Failed to update personnel service status: ${personnelUpdateError.message}`,
          })
        }

        return { createdId: createdRow.id }
      },
      rollback: async () => {
        const rollbackErrors: string[] = []
        const { error: rollbackRecordError } = await supabase
          .from('deployment_records')
          .delete()
          .eq('record_no', insertPayload.record_no)

        if (rollbackRecordError) {
          rollbackErrors.push(`deployment record rollback failed: ${rollbackRecordError.message}`)
        }

        const { error: rollbackPersonnelError } = await supabase
          .from('personnel')
          .update({ service_status_id: previousServiceStatusId })
          .eq('id', payload.personnel_id)

        if (rollbackPersonnelError) {
          rollbackErrors.push(`personnel service status rollback failed: ${rollbackPersonnelError.message}`)
        }

        if (rollbackErrors.length > 0) {
          throw createError({ statusCode: 500, statusMessage: rollbackErrors.join('; ') })
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Deployment record create rollback error:', rollbackError)
      },
    })

    const { data: newRow } = await supabase
      .from('deployment_records')
      .select(DEPLOYMENT_RECORD_SELECT_COLUMNS)
      .eq('id', createdId)
      .maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordCreate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: newRow
        ? ({ ...mapDeploymentRecordListItem(newRow) } as Record<string, unknown>)
        : insertPayload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment record created successfully.',
    })

    return { ok: true, id: createdId }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordCreate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentRecordsCreate,
      requestData: body as Record<string, unknown>,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
