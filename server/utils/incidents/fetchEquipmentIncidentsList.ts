import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import { EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentIncidentRow } from '../../shared/models'

export interface EquipmentIncidentListFilters {
  search: string
  incidentTypeId: string | null
  investigationStatusId: string | null
  equipmentAssetId: string | null
  personnelId: string | null
  deploymentId: string | null
  dateFrom: string | null
  dateTo: string | null
  rangeFrom: number
  rangeTo: number
}
