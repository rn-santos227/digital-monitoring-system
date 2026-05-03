import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { DeploymentSuggestionRow } from '../../shared/models'

export async function fetchDeploymentSuggestions(supabase: SupabaseClient, pageSize: number, term: string) {
  let query = supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS)
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    query = query.or(`deployment_area.ilike.%${term}%,operation_name.ilike.%${term}%,location.ilike.%${term}%`)
  }

  const { data, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment suggestions: ${error.message}` })
  }

  return (data ?? []) as DeploymentSuggestionRow[]
}
