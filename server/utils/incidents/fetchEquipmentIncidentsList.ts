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

  if (filters.incidentTypeId) query = query.eq('incident_type_id', filters.incidentTypeId)
  if (filters.investigationStatusId) {
    query = query.eq('investigation_status_id', filters.investigationStatusId)
  }
  if (filters.equipmentAssetId) query = query.eq('equipment_asset_id', filters.equipmentAssetId)
  if (filters.personnelId) query = query.eq('personnel_id', filters.personnelId)
  if (filters.deploymentId) query = query.eq('deployment_id', filters.deploymentId)
  if (filters.dateFrom) query = query.gte('incident_date', filters.dateFrom)
  if (filters.dateTo) query = query.lte('incident_date', filters.dateTo)
}
