import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentDetailsRequest } from '../../shared/requests'
import { buildEquipmentIncidentDetailsUpdates } from '../../shared/validations'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'

interface UpdateEquipmentIncidentDetailsOptions {
  event: H3Event
  supabase: SupabaseClient
  actorId: string
  id: string
  body: UpdateEquipmentIncidentDetailsRequest
}

