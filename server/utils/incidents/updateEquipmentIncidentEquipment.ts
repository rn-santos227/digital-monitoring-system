import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentEquipmentRequest } from '../../shared/requests'
import { buildEquipmentIncidentEquipmentUpdates } from '../../shared/validations'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'

interface UpdateEquipmentIncidentEquipmentOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: UpdateEquipmentIncidentEquipmentRequest
}

export const updateEquipmentIncidentEquipment = async ({
  event,
  supabase,
  actorId,
  id,
  body,
}: UpdateEquipmentIncidentEquipmentOptions): Promise<void> => {
  await updateEquipmentIncidentSection({
    event,
    supabase,
    actorId,
    id,
    body: body as Record<string, unknown>,
    updates: buildEquipmentIncidentEquipmentUpdates(body),
    endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsEquipmentUpdate,
    successMessage: 'Equipment incident equipment updated successfully.',
    rollbackErrorMessage: 'Equipment incident equipment update rollback error:',
  })
}
