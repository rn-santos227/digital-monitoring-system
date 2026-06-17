import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  INCIDENT_MUTATION_PERMISSION_CODES,
} from '../../../shared/constants'
import { mapEquipmentIncidentListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEquipmentIncidentById } from '../../../utils/incidents/deleteEquipmentIncidentById'
import { getEquipmentIncidentById } from '../../../utils/incidents/getEquipmentIncidentById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAnyPermission(event, INCIDENT_MUTATION_PERMISSION_CODES)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Incident id is required.')
  const supabase = getServiceSupabaseClient()
  let oldData: Record<string, unknown> | undefined

  try {
    const existingRow = await getEquipmentIncidentById(supabase, id)

    if (!existingRow) {
      throw createError({ statusCode: 404, statusMessage: 'Equipment incident not found.' })
    }

    oldData = { ...mapEquipmentIncidentListItem(existingRow) }
    await deleteEquipmentIncidentById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIncidentDelete,
      tableName: 'equipment_incidents',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsDelete,
      recordId: id,
      oldData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment incident deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIncidentDelete,
      tableName: 'equipment_incidents',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsDelete,
      recordId: id,
      oldData,
      statusCode: (error as { statusCode?: number }).statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
})
