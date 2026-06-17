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
    })
  } catch (error: unknown) {

  }
})
