import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  DEPLOYMENT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import type { UpdateDeploymentLocationRequest } from '../../../shared/requests'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getDeploymentById } from '../../../utils/deployments/getDeploymentById'
import { updateDeploymentById } from '../../../utils/deployments/updateDeploymentById'

export default defineEventHandler(async (event) => {
  const actor = await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment id is required.')
  const body = await readBody<UpdateDeploymentLocationRequest>(event)

  const deploymentArea = body.deploymentArea ?? body.deployment_area
  const deploymentAreaLatitude = body.deploymentAreaLatitude ?? body.deployment_area_latitude
  const deploymentAreaLongitude = body.deploymentAreaLongitude ?? body.deployment_area_longitude

  if (deploymentAreaLatitude !== undefined && deploymentAreaLatitude !== null && (deploymentAreaLatitude < -90 || deploymentAreaLatitude > 90)) {
    throw createError({ statusCode: 400, statusMessage: 'Latitude must be between -90 and 90.' })
  }

  if (deploymentAreaLongitude !== undefined && deploymentAreaLongitude !== null && (deploymentAreaLongitude < -180 || deploymentAreaLongitude > 180)) {
    throw createError({ statusCode: 400, statusMessage: 'Longitude must be between -180 and 180.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getDeploymentById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Deployment not found.' })

  const updates = {
    deployment_area: deploymentArea ?? existingRow.deployment_area,
    deployment_area_latitude: deploymentAreaLatitude === undefined ? existingRow.deployment_area_latitude : deploymentAreaLatitude,
    deployment_area_longitude: deploymentAreaLongitude === undefined ? existingRow.deployment_area_longitude : deploymentAreaLongitude,
    location: body.location === undefined ? existingRow.location : body.location,
  }

  try {
    await updateDeploymentById(supabase, id, updates, 'location')

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
      message: 'Deployment location updated successfully.',
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
