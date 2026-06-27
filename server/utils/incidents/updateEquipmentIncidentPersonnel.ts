import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { AUDIT_LOG_ENDPOINTS } from '../../shared/constants'
import type { UpdateEquipmentIncidentPersonnelRequest } from '../../shared/requests'
import { buildEquipmentIncidentPersonnelUpdates } from '../../shared/validations'
import { updateEquipmentIncidentSection } from './updateEquipmentIncidentSection'


