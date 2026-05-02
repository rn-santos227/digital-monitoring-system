import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateDeploymentRequest } from '../../shared/requests'
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
import { parseCreateDeploymentPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<CreateDeploymentRecordResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentManage)
  const body = await readBody<CreateDeploymentRequest>(event)
  const supabase = getServiceSupabaseClient()

  try {
    const payload = parseCreateDeploymentPayload(body)
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

    const { createdId } = await executeWithRollback({
      operation: async () => {
        const { data: createdRow, error: insertError } = await supabase
          .from('deployments')
          .insert(insertPayload)
          .select('id')
          .maybeSingle<{ id: string }>()

        if (insertError || !createdRow?.id) {
          throw createError({
            statusCode: 500,
            statusMessage: `Failed to create deployment: ${insertError?.message ?? 'Missing id.'}`,
          })
        }

        if (payload.supervisor_id && deployedServiceStatusId) {
          const { error: updateSupervisorError } = await supabase
            .from('personnel')
            .update({ service_status_id: deployedServiceStatusId })
            .eq('id', payload.supervisor_id)

          if (updateSupervisorError) {
            throw createError({
              statusCode: 500,
              statusMessage: `Failed to update supervisor service status: ${updateSupervisorError.message}`,
            })
          }
        }

        return { createdId: createdRow.id }
      },
      rollback: async () => {
        const rollbackErrors: string[] = []
        const { error: rollbackDeploymentError } = await supabase
          .from('deployment')
          .delete()
          .eq('record_no', insertPayload.record_no)

        if (rollbackDeploymentError) {
          rollbackErrors.push(`deployment rollback failed: ${rollbackDeploymentError.message}`)
        }

        if (payload.supervisor_id) {
          const { error: rollbackSupervisorError } = await supabase
            .from('personnel')
            .update({ service_status_id: previousSupervisorServiceStatusId })
            .eq('id', payload.supervisor_id)

          if (rollbackSupervisorError) {
            rollbackErrors.push(`supervisor service status rollback failed: ${rollbackSupervisorError.message}`)
          }
        }

        if (rollbackErrors.length > 0) {
          throw createError({ statusCode: 500, statusMessage: rollbackErrors.join('; ') })
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Deployment create rollback error:', rollbackError)
      },
    })

    const { data: newRow } = await supabase
      .from('deployments')
      .select(DEPLOYMENT_DETAIL_SELECT_COLUMNS)
      .eq('id', createdId)
      .maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentCreate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: newRow
        ? ({ ...mapDeploymentDetailListItem(newRow) } as Record<string, unknown>)
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
