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
  } catch (error: unknown) {

  }
})
