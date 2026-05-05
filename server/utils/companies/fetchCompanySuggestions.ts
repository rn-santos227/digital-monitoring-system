import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchCompanySuggestions(supabase: SupabaseClient, term: string, pageSize: number, battalionId: string | null, selectedId: string | null = null) {
  let query = supabase
    .from('companies')
    .select(COMPANY_SUGGESTION_SELECT_COLUMNS)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (battalionId) {
    query = query.eq('battalion_id', battalionId)
  }

  if (selectedId) {
    query = query.or(`id.eq.${selectedId},code.ilike.%${term}%,name.ilike.%${term}%`)
  } else if (term.length > 0) {
    query = query.or(`code.ilike.%${term}%,name.ilike.%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company suggestions: ${error.message}` })
  }

  const rows = data ?? []
  if (!selectedId) return rows

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, pageSize)
  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows.slice(0, pageSize)
}
