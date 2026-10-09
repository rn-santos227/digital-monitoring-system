import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentPersonnelRequest } from '../../shared/requests'
import { buildEquipmentIncidentPersonnelUpdates } from '../../shared/validation'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'

interface UpdateEquipmentIncidentPersonnelOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: UpdateEquipmentIncidentPersonnelRequest
}

export const updateEquipmentIncidentPersonnel = async ({
  event,
  supabase,
  actorId,
  id,
  body,
}: UpdateEquipmentIncidentPersonnelOptions): Promise<void> => {
  await updateEquipmentIncidentSection({
    event,
    supabase,
    actorId,
    id,
    body: body as Record<string, unknown>,
    updates: buildEquipmentIncidentPersonnelUpdates(body),
    endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsPersonnelUpdate,
    successMessage: 'Equipment incident personnel updated successfully.',
    rollbackErrorMessage: 'Equipment incident personnel update rollback error:',
  })
}
