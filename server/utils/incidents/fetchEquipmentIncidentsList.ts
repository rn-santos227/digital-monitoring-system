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

export const fetchEquipmentIncidentsList = async (
  supabase: SupabaseClient,
  filters: EquipmentIncidentListFilters,
) => {
  let query = supabase
    .from('equipment_incidents')
    .select(EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS, { count: 'exact' })

  if (filters.search) {
    query = query.or(
      `incident_no.ilike.%${filters.search}%,location.ilike.%${filters.search}%,description.ilike.%${filters.search}%,resolution.ilike.%${filters.search}%,remarks.ilike.%${filters.search}%`,
    )
  }
}
