import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ENGAGEMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { EngagementRow } from '../../shared/models'

export async function fetchEngagementSuggestions(supabase: SupabaseClient, pageSize: number, term: string, selectedId: string | null = null) {
  let query = supabase
    .from('engagements')
    .select(ENGAGEMENT_SUGGESTION_SELECT_COLUMNS)
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('engagement_title', { ascending: true })

  if (selectedId) {
    query = query.or(`id.eq.${selectedId},engagement_title.ilike.%${term}%,default_remarks.ilike.%${term}%`)
  } else if (term.length > 0) {
    query = query.or(`engagement_title.ilike.%${term}%,default_remarks.ilike.%${term}%`)
  }

  const { data, error } = await query.limit(pageSize + (selectedId ? 1 : 0))
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch engagement suggestions: ${error.message}` })
  }

  const rows = (data ?? []) as EngagementRow[]
  if (!selectedId) return rows

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, pageSize)
  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows.slice(0, pageSize)
}
