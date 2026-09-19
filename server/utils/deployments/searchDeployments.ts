import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { DeploymentSuggestionRow, PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchDeploymentsParams {
  filters: string[]
  statusId: string | null
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  supervisorId: string | null
  rangeFrom: number
  rangeTo: number
}

export async function searchDeployments(supabase: SupabaseClient, params: SearchDeploymentsParams) {
  let query = supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.filters.length > 0) {
    query = query.or(params.filters.join(','))
  }

  if (params.advancedFilters.length > 0) {
    query = applyPersonnelSearchFilters(query, params.advancedFilters, params.match)
  }

  if (params.statusId) {
    query = query.eq('status_id', params.statusId)
  }

  if (params.supervisorId) {
    query = query.eq('supervisor_id', params.supervisorId)
  }

  const { data, count, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search deployment records: ${error.message}` })
  }

  return { data: (data ?? []) as DeploymentSuggestionRow[], count: count ?? 0 }
}
