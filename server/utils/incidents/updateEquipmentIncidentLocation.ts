import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentLocationRequest } from '../../shared/requests'
import { buildEquipmentIncidentLocationUpdates } from '../../shared/validation'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'

interface UpdateEquipmentIncidentLocationOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: UpdateEquipmentIncidentLocationRequest
}

export const updateEquipmentIncidentLocation = async ({
  event,
  supabase,
  actorId,
  id,
  body,
}: UpdateEquipmentIncidentLocationOptions): Promise<void> => {
  await updateEquipmentIncidentSection({
    event,
    supabase,
    actorId,
    id,
    body: body as Record<string, unknown>,
    updates: buildEquipmentIncidentLocationUpdates(body),
    endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsLocationUpdate,
    successMessage: 'Equipment incident location updated successfully.',
    rollbackErrorMessage: 'Equipment incident location update rollback error:',
  })
}
