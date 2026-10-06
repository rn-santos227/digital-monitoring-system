import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateDeploymentRequest } from '../../shared/requests'
import type { CreateDeploymentRecordResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  ID_ONLY_SELECT_COLUMNS,
  DEPLOYMENT_PERMISSION_GROUPS,
} from '../../shared/constants'
import {
  assertPersonnelExists,
  mapDeploymentDetailListItem,
  resolveDeploymentStatusId,
  resolvePersonnelServiceStatusId,
} from '../../shared/utils'
import { parseCreateDeploymentPayload } from '../../shared/validation'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { deleteDeploymentRecordByRecordNo } from '../../utils/deployment-records/deleteDeploymentRecordByRecordNo'
import { ensureDeploymentPersonnelAssignment } from '../../utils/deployment-records/ensureDeploymentPersonnelAssignment'
import { createDeployment } from '../../utils/deployments/createDeployment'
import { deleteDeploymentById } from '../../utils/deployments/deleteDeploymentById'
import { getDeploymentById } from '../../utils/deployments/getDeploymentById'
import { getPersonnelServiceStatusById } from '../../utils/deployments/getPersonnelServiceStatusById'
import { updateEffectiveSupervisorStatus } from '../../utils/deployments/updateEffectiveSupervisorStatus'
import { updatePersonnelServiceStatusById } from '../../utils/deployments/updatePersonnelServiceStatusById'

export default defineEventHandler(async (event): Promise<CreateDeploymentRecordResponse> => {
  const actor = await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  const body = await readBody<CreateDeploymentRequest>(event)
  const supabase = getServiceSupabaseClient()

  try {
    const payload = parseCreateDeploymentPayload(body)
    payload.status_id = await resolveDeploymentStatusId(supabase, payload.status_id)

    if (payload.supervisor_id) {
      await assertPersonnelExists({
        supabase,
        personnelId: payload.supervisor_id,
        idSelectColumns: ID_ONLY_SELECT_COLUMNS,
      })
    }

    const insertPayload = {
      ...payload,
    }

    const deployedServiceStatusId = payload.supervisor_id
      ? await resolvePersonnelServiceStatusId(supabase, 'Deployed')
      : null

    let previousSupervisorServiceStatusId: string | null = null
    if (payload.supervisor_id) {
      previousSupervisorServiceStatusId = await getPersonnelServiceStatusById(
        supabase,
        payload.supervisor_id,
        'Failed to read supervisor service status',
      )
    }

    let createdDeploymentId: string | null = null
    let createdSupervisorRecordNo: string | null = null
    const { createdId } = await executeWithRollback({
      operation: async () => {
        const createdId = await createDeployment(supabase, insertPayload)
        if (payload.supervisor_id) {
          const { createdRecordNo } = await ensureDeploymentPersonnelAssignment({
            supabase,
            deployment: { ...insertPayload, id: createdId },
            personnelId: payload.supervisor_id,
          })
          createdSupervisorRecordNo = createdRecordNo
        }
        await updateEffectiveSupervisorStatus(supabase, {
          effectiveSupervisorId: payload.supervisor_id,
          deployedServiceStatusId,
        })

        createdDeploymentId = createdId
        return { createdId }
      },
      rollback: async () => {
        const rollbackErrors: string[] = []
        if (createdDeploymentId) {
          await deleteDeploymentById(supabase, createdDeploymentId)
        }

        if (createdSupervisorRecordNo) {
          await deleteDeploymentRecordByRecordNo(supabase, createdSupervisorRecordNo)
        }

        if (payload.supervisor_id) {
          await updatePersonnelServiceStatusById(
            supabase,
            payload.supervisor_id,
            previousSupervisorServiceStatusId,
            'supervisor service status rollback failed',
          )
        }

        if (rollbackErrors.length > 0) {
          throw createError({ statusCode: 500, statusMessage: rollbackErrors.join('; ') })
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Deployment create rollback error:', rollbackError)
      },
    })

    const newRow = await getDeploymentById(supabase, createdId)
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

    if (!newRow) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created deployment record.' })
    }

    return {
      ok: true,
      id: createdId,
      item: mapDeploymentDetailListItem(newRow),
    }
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
