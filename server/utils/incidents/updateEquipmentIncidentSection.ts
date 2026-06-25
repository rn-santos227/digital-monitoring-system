import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_OUTCOMES,
} from '../../shared/constants'
import type {
  EquipmentIncidentCreate,
  EquipmentIncidentUpdate,
} from '../../shared/models'
import { mapEquipmentIncidentListItem } from '../../shared/utils'
import { recordManagementAuditLog } from '../audit/recordManagementAuditLog'
import { executeWithRollback } from '../db/executeWithRollback'
import { assertIncidentReferencesExist } from './assertIncidentReferencesExist'
import { getEquipmentIncidentById } from './getEquipmentIncidentById'
import { updateEquipmentIncidentById } from './updateEquipmentIncidentById'

interface UpdateEquipmentIncidentSectionOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: Record<string, unknown>
  updates: EquipmentIncidentUpdate
  endpoint: string
  successMessage: string
  rollbackErrorMessage: string
}

const buildEquipmentIncidentRollbackPayload = (
  row: EquipmentIncidentCreate,
): EquipmentIncidentCreate => ({
  incident_no: row.incident_no,
  equipment_asset_id: row.equipment_asset_id,
  personnel_id: row.personnel_id,
  deployment_id: row.deployment_id,
  incident_type_id: row.incident_type_id,
  incident_date: row.incident_date,
  location: row.location,
  location_latitude: row.location_latitude,
  location_longitude: row.location_longitude,
  description: row.description,
  investigation_status_id: row.investigation_status_id,
  resolution: row.resolution,
  remarks: row.remarks,
})

export const updateEquipmentIncidentSection = async ({
  event,
  supabase,
  actorId,
  id,
  body,
  updates,
  endpoint,
  successMessage,
  rollbackErrorMessage,
}: UpdateEquipmentIncidentSectionOptions): Promise<void> => {
  let oldData: Record<string, unknown> | undefined

  try {
    if (Object.keys(updates).length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
    }

    const existingRow = await getEquipmentIncidentById(supabase, id)

    if (!existingRow) {
      throw createError({ statusCode: 404, statusMessage: 'Equipment incident not found.' })
    }

  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actorId,
      action: AUDIT_LOG_ACTIONS.equipmentIncidentUpdate,
      tableName: 'equipment_incidents',
      endpoint,
      recordId: id,
      requestData: body,
      oldData,
      statusCode: (error as { statusCode?: number }).statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
}
