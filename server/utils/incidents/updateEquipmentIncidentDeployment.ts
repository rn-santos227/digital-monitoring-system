import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentDeploymentRequest } from '../../shared/requests'
import { buildEquipmentIncidentDeploymentUpdates } from '../../shared/validation'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'

interface UpdateEquipmentIncidentDeploymentOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: UpdateEquipmentIncidentDeploymentRequest
}

export const updateEquipmentIncidentDeployment = async ({
  event,
  supabase,
  actorId,
  id,
  body,
}: UpdateEquipmentIncidentDeploymentOptions): Promise<void> => {
  await updateEquipmentIncidentSection({
    event,
    supabase,
    actorId,
    id,
    body: body as Record<string, unknown>,
    updates: buildEquipmentIncidentDeploymentUpdates(body),
    endpoint: AUDIT_LOG_ENDPOINTS.equipmentIncidentsDeploymentUpdate,
    successMessage: 'Equipment incident deployment updated successfully.',
    rollbackErrorMessage: 'Equipment incident deployment update rollback error:',
  })
}
