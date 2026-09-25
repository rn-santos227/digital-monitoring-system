import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import { EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentIncidentRow, PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchEquipmentIncidentsOptions {
  searchFilters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}

export const searchEquipmentIncidents = async (
  supabase: SupabaseClient,
  options: SearchEquipmentIncidentsOptions,
) => {
  let query = supabase
    .from('equipment_incidents')
    .select(EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS, { count: 'exact' })

}
