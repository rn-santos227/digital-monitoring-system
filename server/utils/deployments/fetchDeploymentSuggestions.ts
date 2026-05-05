import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { DeploymentSuggestionRow } from '../../shared/models'

export async function fetchDeploymentSuggestions(supabase: SupabaseClient, pageSize: number, term: string, selectedId: string | null = null) {
  let query = supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS)
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })

  if (selectedId) {
    query = query.or(`id.eq.${selectedId},deployment_area.ilike.%${term}%,operation_name.ilike.%${term}%,location.ilike.%${term}%`)
  } else if (term.length > 0) {
    query = query.or(`deployment_area.ilike.%${term}%,operation_name.ilike.%${term}%,location.ilike.%${term}%`)
  }

  const { data, error } = await query.limit(pageSize + (selectedId ? 1 : 0))
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment suggestions: ${error.message}` })
  }

  const rows = (data ?? []) as DeploymentSuggestionRow[]
  if (!selectedId) return rows

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, pageSize)
  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows.slice(0, pageSize)
}
