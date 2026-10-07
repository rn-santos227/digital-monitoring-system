import { defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateEquipmentIncidentEquipmentRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { INCIDENT_MUTATION_PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { updateEquipmentIncidentEquipment } from '../../../utils/incidents/updateEquipmentIncidentEquipment'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAnyPermission(event, INCIDENT_MUTATION_PERMISSION_CODES)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Incident id is required.')
  const body = await readBody<UpdateEquipmentIncidentEquipmentRequest>(event)
  const supabase = getServiceSupabaseClient()

  await updateEquipmentIncidentEquipment({
    event,
    supabase,
    actorId: actor.id,
    id,
    body,
  })

  return { ok: true }
})
