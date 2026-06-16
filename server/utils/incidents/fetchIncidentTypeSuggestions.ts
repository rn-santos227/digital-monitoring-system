import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import {
  INCIDENT_SUGGESTION_PAGE_SIZE,
  INCIDENT_TYPE_SUGGESTION_SELECT_COLUMNS,
} from '../../shared/constants'
import type { IncidentTypeSuggestionItem } from '../../shared/models'

export const fetchIncidentTypeSuggestions = async (
  supabase: SupabaseClient,
  term: string,
): Promise<IncidentTypeSuggestionItem[]> => {
  let query = supabase
    .from('incident_types')
    .select(INCIDENT_TYPE_SUGGESTION_SELECT_COLUMNS)

  if (term) {
    query = query.or(`code.ilike.%${term}%,name.ilike.%${term}%`)
  }

  const { data, error } = await query
    .order('name')
    .limit(INCIDENT_SUGGESTION_PAGE_SIZE)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return (data ?? []) as IncidentTypeSuggestionItem[]
}
