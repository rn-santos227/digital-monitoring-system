import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchCompanySuggestions(supabase: SupabaseClient, term: string, pageSize: number, battalionId: string | null) {
  let query = supabase
    .from('companies')
    .select(COMPANY_SUGGESTION_SELECT_COLUMNS)
    .eq('is_active', true)
    .order('name', { ascending: true })
    .limit(pageSize)

  if (battalionId) {
    query = query.eq('battalion_id', battalionId)
  }

  if (term.length > 0) {
    query = query.or(`code.ilike.%${term}%,name.ilike.%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company suggestions: ${error.message}` })
  }

  return data ?? []
}
