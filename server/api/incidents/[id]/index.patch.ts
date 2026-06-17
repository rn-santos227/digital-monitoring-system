import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateEquipmentIncidentRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import type { EquipmentIncidentCreate } from '../../../shared/models'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  INCIDENT_MUTATION_PERMISSION_CODES,
} from '../../../shared/constants'
import { mapEquipmentIncidentListItem } from '../../../shared/utils'
import {
  buildEquipmentIncidentUpdates,
  requireRouteId,
} from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { assertIncidentReferencesExist } from '../../../utils/incidents/assertIncidentReferencesExist'
import { getEquipmentIncidentById } from '../../../utils/incidents/getEquipmentIncidentById'
import { updateEquipmentIncidentById } from '../../../utils/incidents/updateEquipmentIncidentById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAnyPermission(event, INCIDENT_MUTATION_PERMISSION_CODES)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Incident id is required.')
  const body = await readBody<UpdateEquipmentIncidentRequest>(event)
  const supabase = getServiceSupabaseClient()
  let oldData: Record<string, unknown> | undefined

  try {
    const updates = buildEquipmentIncidentUpdates(body)

    if (Object.keys(updates).length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
    }

    const existingRow = await getEquipmentIncidentById(supabase, id)

    if (!existingRow) {
      throw createError({ statusCode: 404, statusMessage: 'Equipment incident not found.' })
    }

    oldData = { ...mapEquipmentIncidentListItem(existingRow) }
    await assertIncidentReferencesExist(supabase, updates)

    const rollbackPayload: EquipmentIncidentCreate = {
      incident_no: existingRow.incident_no,
      equipment_asset_id: existingRow.equipment_asset_id,
      personnel_id: existingRow.personnel_id,
      deployment_id: existingRow.deployment_id,
      incident_type_id: existingRow.incident_type_id,
      incident_date: existingRow.incident_date,
      location: existingRow.location,
      location_latitude: existingRow.location_latitude,
      location_longitude: existingRow.location_longitude,
      description: existingRow.description,
      investigation_status_id: existingRow.investigation_status_id,
      resolution: existingRow.resolution,
      remarks: existingRow.remarks,
    }

  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIncidentUpdate,
      tableName: 'equipment_incidents',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData,
      statusCode: (error as { statusCode?: number }).statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
})
