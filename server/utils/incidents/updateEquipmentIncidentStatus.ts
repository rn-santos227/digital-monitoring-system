import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentStatusRequest } from '../../shared/requests'
import { buildEquipmentIncidentStatusUpdates } from '../../shared/validations'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'

interface UpdateEquipmentIncidentStatusOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: UpdateEquipmentIncidentStatusRequest
}

export const updateEquipmentIncidentStatus = async ({
  event,
  supabase,
  actorId,
  id,
  body,
}: UpdateEquipmentIncidentStatusOptions): Promise<void> => {
  await updateEquipmentIncidentSection({
    event,
    supabase,
    actorId,
    id,
    body: body as Record<string, unknown>,
    updates: buildEquipmentIncidentStatusUpdates(body),
    endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsStatusUpdate,
    successMessage: 'Equipment incident status updated successfully.',
    rollbackErrorMessage: 'Equipment incident status update rollback error:',
  })
}
