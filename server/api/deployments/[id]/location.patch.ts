import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

interface UpdateDeploymentLocationBody {
  deployment_area?: string
  deployment_area_latitude?: number | null
  deployment_area_longitude?: number | null
  location?: string | null
}

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.deploymentUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment id is required.')
  const body = await readBody<UpdateDeploymentLocationBody>(event)

  if (body.deployment_area_latitude !== undefined && body.deployment_area_latitude !== null && (body.deployment_area_latitude < -90 || body.deployment_area_latitude > 90)) {
    throw createError({ statusCode: 400, statusMessage: 'Latitude must be between -90 and 90.' })
  }

  if (body.deployment_area_longitude !== undefined && body.deployment_area_longitude !== null && (body.deployment_area_longitude < -180 || body.deployment_area_longitude > 180)) {
    throw createError({ statusCode: 400, statusMessage: 'Longitude must be between -180 and 180.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: existingRow, error: existingError } = await supabase
    .from('deployment')
    .select('id,deployment_area,deployment_area_latitude,deployment_area_longitude,location')
    .eq('id', id)
    .maybeSingle()

  if (existingError) throw createError({ statusCode: 500, statusMessage: `Failed to read deployment: ${existingError.message}` })
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Deployment not found.' })

  const updates = {
    deployment_area: body.deployment_area ?? existingRow.deployment_area,
    deployment_area_latitude: body.deployment_area_latitude === undefined ? existingRow.deployment_area_latitude : body.deployment_area_latitude,
    deployment_area_longitude: body.deployment_area_longitude === undefined ? existingRow.deployment_area_longitude : body.deployment_area_longitude,
    location: body.location === undefined ? existingRow.location : body.location,
  }

  try {
    const { error } = await supabase.from('deployment').update(updates).eq('id', id)
    if (error) throw createError({ statusCode: 500, statusMessage: `Failed to update deployment location: ${error.message}` })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.deploymentUpdate,
      tableName: 'deployment',
      endpoint: AUDIT_LOG_ENDPOINTS.deploymentsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as Record<string, unknown>,
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
      oldData: existingRow as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })
    throw error
  }
})
