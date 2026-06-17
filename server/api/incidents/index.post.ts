import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEquipmentIncidentRequest } from '../../shared/requests'
import type { CreateEquipmentIncidentResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  INCIDENT_MUTATION_PERMISSION_CODES,
} from '../../shared/constants'
import { mapEquipmentIncidentListItem } from '../../shared/utils'
import { parseCreateEquipmentIncidentPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { assertIncidentReferencesExist } from '../../utils/incidents/assertIncidentReferencesExist'
import { createEquipmentIncident } from '../../utils/incidents/createEquipmentIncident'
import { deleteEquipmentIncidentById } from '../../utils/incidents/deleteEquipmentIncidentById'
import { getEquipmentIncidentById } from '../../utils/incidents/getEquipmentIncidentById'

export default defineEventHandler(async (event): Promise<CreateEquipmentIncidentResponse> => {
  const actor = await requireAnyPermission(event, INCIDENT_MUTATION_PERMISSION_CODES)
  const body = await readBody<CreateEquipmentIncidentRequest>(event)
  const supabase = getServiceSupabaseClient()
  let createdId: string | null = null

  try {
    const payload = parseCreateEquipmentIncidentPayload(body)
    await assertIncidentReferencesExist(supabase, payload)

    createdId = await executeWithRollback({
      operation: async () => {
        const id = await createEquipmentIncident(supabase, payload)
        createdId = id
        return id
      },
      rollback: async () => {
        if (createdId) {
          await deleteEquipmentIncidentById(supabase, createdId)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Equipment incident create rollback error:', rollbackError)
      },
    })

    const createdRow = await getEquipmentIncidentById(supabase, createdId)

    if (!createdRow) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load created equipment incident.',
      })
    }

    const item = mapEquipmentIncidentListItem(createdRow)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIncidentCreate,
      tableName: 'equipment_incidents',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: { ...item },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment incident created successfully.',
    })

    return { ok: true, id: createdId, item }
  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIncidentCreate,
      tableName: 'equipment_incidents',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsCreate,
      recordId: createdId ?? undefined,
      requestData: body as Record<string, unknown>,
      statusCode: (error as { statusCode?: number }).statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
})
