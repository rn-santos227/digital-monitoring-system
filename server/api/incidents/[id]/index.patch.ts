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
})
