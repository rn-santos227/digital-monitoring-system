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

}: UpdateEquipmentIncidentStatusOptions): Promise<void> => {

}
