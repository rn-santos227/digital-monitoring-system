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

  if (options.searchFilters.length > 0) {
    query = query.or(options.searchFilters.join(','))
  }

  if (options.advancedFilters.length > 0) {
    query = applyPersonnelSearchFilters(query, options.advancedFilters, options.match)
  }

  const { data, count, error } = await query
    .order('incident_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(options.rangeFrom, options.rangeTo)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to search equipment incidents: ${error.message}`,
    })
  }
}
