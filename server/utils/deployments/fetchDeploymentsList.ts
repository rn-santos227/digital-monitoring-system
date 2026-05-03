import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { DeploymentSuggestionRow } from '../../shared/models'

interface FetchDeploymentsListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchDeploymentsList(supabase: SupabaseClient, params: FetchDeploymentsListParams) {
  let query = supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.search) {
    query = query.or(
      `deployment_area.ilike.%${params.search}%,operation_name.ilike.%${params.search}%,location.ilike.%${params.search}%,assignment_role.ilike.%${params.search}%,default_remarks.ilike.%${params.search}%`,
    )
  }

  const { data, count, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment records: ${error.message}` })
  }

  return { data: (data ?? []) as DeploymentSuggestionRow[], count: count ?? 0 }
}
