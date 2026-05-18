import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { CreateDeploymentRecordFromDeploymentRequest } from '../../../shared/requests'
import type { CreateDeploymentRecordResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, DEPLOYMENT_PERMISSION_GROUPS, ID_ONLY_SELECT_COLUMNS } from '../../../shared/constants'
import { PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE, PERSONNEL_ROUTE_PARAM_KEY, withPersonnelId, assertPersonnelExists, mapDeploymentRecordListItem, resolvePersonnelServiceStatusId } from '../../../shared/utils'
import { parseCreateDeploymentRecordFromDeploymentPayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { createDeploymentRecord } from '../../../utils/deployment-records/createDeploymentRecord'
import { deleteDeploymentRecordByRecordNo } from '../../../utils/deployment-records/deleteDeploymentRecordByRecordNo'
import { getDeploymentRecordById } from '../../../utils/deployment-records/getDeploymentRecordById'
import { getDeploymentSourceById } from '../../../utils/deployment-records/getDeploymentSourceById'
import { getPersonnelServiceStatusById } from '../../../utils/deployments/getPersonnelServiceStatusById'
import { getNextDeploymentRecordNo } from '../../../utils/deployment-records/getNextDeploymentRecordNo'
import { updatePersonnelServiceStatusById } from '../../../utils/deployments/updatePersonnelServiceStatusById'

export default defineEventHandler(async (event): Promise<CreateDeploymentRecordResponse> => {
  const actor = await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  const personnelId = requireRouteId(getRouterParam(event, PERSONNEL_ROUTE_PARAM_KEY), PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE)
  const body = await readBody<CreateDeploymentRecordFromDeploymentRequest>(event)
  const supabase = getServiceSupabaseClient()
  const requestData = withPersonnelId(body, personnelId)

  try {
    const payload = parseCreateDeploymentRecordFromDeploymentPayload(withPersonnelId(body, personnelId))
    const deployment = await getDeploymentSourceById(supabase, payload.deployment_id)
    if (!deployment) {
      throw createError({ statusCode: 404, statusMessage: 'Deployment not found.' })
    }

    await assertPersonnelExists({ supabase, personnelId: payload.personnel_id, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
    if (deployment.supervisor_id) {
      await assertPersonnelExists({ supabase, personnelId: deployment.supervisor_id, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
    }

    const insertPayload = {
      personnel_id: payload.personnel_id,
      deployment_id: deployment.id,
      deployment_area: payload.deployment_area ?? deployment.deployment_area,
      deployment_area_latitude: deployment.deployment_area_latitude,
      deployment_area_longitude: deployment.deployment_area_longitude,
      assignment_role: payload.assignment_role ?? deployment.assignment_role,
      operation_name: deployment.operation_name,
      start_date: payload.start_date ?? deployment.start_date,
      end_date: payload.end_date === null ? null : (payload.end_date ?? deployment.end_date),
      status_id: deployment.status_id,
      location: deployment.location,
      supervisor_id: deployment.supervisor_id,
      remarks: payload.remarks ?? deployment.default_remarks ?? null,
      record_no: await getNextDeploymentRecordNo(supabase),
    }

    const deployedServiceStatusId = await resolvePersonnelServiceStatusId(supabase, 'Deployed')
    const previousServiceStatusId = await getPersonnelServiceStatusById(supabase, payload.personnel_id, 'Failed to read personnel service status')

    const { createdId } = await executeWithRollback({
      operation: async () => {
        const createdId = await createDeploymentRecord(supabase, insertPayload)
        await updatePersonnelServiceStatusById(supabase, payload.personnel_id, deployedServiceStatusId, 'Failed to update personnel service status')
        return { createdId }
      },
      rollback: async () => {
        await deleteDeploymentRecordByRecordNo(supabase, insertPayload.record_no)
        await updatePersonnelServiceStatusById(supabase, payload.personnel_id, previousServiceStatusId, 'personnel service status rollback failed')
      },
      onRollbackError: (rollbackError) => {
        console.error('Deployment record assign rollback error:', rollbackError)
      },
    })

    const newRow = await getDeploymentRecordById(supabase, createdId)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordCreate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelAssignDeploymentRecord,
      recordId: createdId,
      requestData,
      newData: newRow ? ({ ...mapDeploymentRecordListItem(newRow) } as Record<string, unknown>) : insertPayload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Deployment record assigned successfully.',
    })

    if (!newRow) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created deployment record.' })
    }

    return { ok: true, id: createdId, item: mapDeploymentRecordListItem(newRow) }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentRecordCreate,
      tableName: 'deployment_records',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelAssignDeploymentRecord,
      requestData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
