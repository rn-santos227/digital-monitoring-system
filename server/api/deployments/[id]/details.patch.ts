import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { assertPersonnelExists, resolveDeploymentStatusId, resolvePersonnelServiceStatusId } from '../../../shared/utils'
import type { UpdateDeploymentRequest } from '../../../shared/requests'
import { buildDeploymentUpdates, requireRouteId, validateDeploymentDateRange } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { deleteDeploymentRecordByRecordNo } from '../../../utils/deployment-records/deleteDeploymentRecordByRecordNo'
import { ensureDeploymentPersonnelAssignment } from '../../../utils/deployment-records/ensureDeploymentPersonnelAssignment'
import { getDeploymentById } from '../../../utils/deployments/getDeploymentById'
import { getPersonnelServiceStatusById } from '../../../utils/deployments/getPersonnelServiceStatusById'
import { updateDeploymentById } from '../../../utils/deployments/updateDeploymentById'
import { updateEffectiveSupervisorStatus } from '../../../utils/deployments/updateEffectiveSupervisorStatus'
import { updatePersonnelServiceStatusById } from '../../../utils/deployments/updatePersonnelServiceStatusById'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment id is required.')
  const body = await readBody<UpdateDeploymentRequest>(event)
  const supabase = getServiceSupabaseClient()

  const existingRow = await getDeploymentById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Deployment not found.' })

  const parsedUpdates = buildDeploymentUpdates(body)
  const effectiveStartDate = parsedUpdates.start_date ?? existingRow.start_date
  const effectiveEndDate = parsedUpdates.end_date === undefined ? existingRow.end_date : parsedUpdates.end_date
  validateDeploymentDateRange(effectiveStartDate, effectiveEndDate)

  const effectiveSupervisorId = parsedUpdates.supervisor_id === undefined ? existingRow.supervisor_id : parsedUpdates.supervisor_id
  if (effectiveSupervisorId) {
    await assertPersonnelExists({ supabase, personnelId: effectiveSupervisorId, idSelectColumns: 'id' })
  }

  const updates = {
    assignment_role: parsedUpdates.assignment_role === undefined ? existingRow.assignment_role : parsedUpdates.assignment_role,
    operation_name: parsedUpdates.operation_name === undefined ? existingRow.operation_name : parsedUpdates.operation_name,
    start_date: effectiveStartDate,
    end_date: effectiveEndDate,
    status_id: parsedUpdates.status_id ?? existingRow.status_id,
    supervisor_id: effectiveSupervisorId,
    default_remarks: parsedUpdates.default_remarks === undefined ? existingRow.default_remarks : parsedUpdates.default_remarks,
  }

  updates.status_id = await resolveDeploymentStatusId(supabase, updates.status_id)

  const deployedServiceStatusId = effectiveSupervisorId
    ? await resolvePersonnelServiceStatusId(supabase, 'Deployed')
    : null

  let previousSupervisorServiceStatusId: string | null = null
  if (effectiveSupervisorId) {
    previousSupervisorServiceStatusId = await getPersonnelServiceStatusById(
      supabase,
      effectiveSupervisorId,
      'Failed to read supervisor service status',
    )
  }

  let createdSupervisorRecordNo: string | null = null

  try {
    await executeWithRollback({
      operation: async () => {
        await updateDeploymentById(supabase, id, updates, 'details')

        if (effectiveSupervisorId) {
          const { createdRecordNo } = await ensureDeploymentPersonnelAssignment({
            supabase,
            deployment: {
              ...updates,
              id,
              deployment_area: existingRow.deployment_area,
              deployment_area_latitude: existingRow.deployment_area_latitude,
              deployment_area_longitude: existingRow.deployment_area_longitude,
              location: existingRow.location,
            },
            personnelId: effectiveSupervisorId,
          })
          createdSupervisorRecordNo = createdRecordNo
        }

        await updateEffectiveSupervisorStatus(supabase, {
          effectiveSupervisorId,
          deployedServiceStatusId,
        })
      },
      rollback: async () => {
        const rollbackErrors: string[] = []
        const { error: rollbackDeploymentError } = await supabase
          .from('deployments')
          .update({
            assignment_role: existingRow.assignment_role,
            operation_name: existingRow.operation_name,
            start_date: existingRow.start_date,
            end_date: existingRow.end_date,
            status_id: existingRow.status_id,
            supervisor_id: existingRow.supervisor_id,
            default_remarks: existingRow.default_remarks,
          })
          .eq('id', id)

        if (rollbackDeploymentError) {
          rollbackErrors.push(`deployment rollback failed: ${rollbackDeploymentError.message}`)
        }

        if (effectiveSupervisorId) {
          await updatePersonnelServiceStatusById(
            supabase,
            effectiveSupervisorId,
            previousSupervisorServiceStatusId,
            'supervisor service status rollback failed',
          )
        }

        if (rollbackErrors.length > 0) {
          throw createError({ statusCode: 500, statusMessage: rollbackErrors.join('; ') })
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Deployment details update rollback error:', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentUpdate,
      tableName: 'deployment',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as unknown as Record<string, unknown>,
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
      tableName: 'deployment',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as unknown as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })
    throw error
  }
})
