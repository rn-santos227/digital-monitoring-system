import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'

export async function getRankSuggestionById(
  supabase: SupabaseClient,
  id: string,
): Promise<{ id: string; code: string; name: string; sort_order: number } | null> {
  const { data, error } = await supabase
    .from('ranks')
    .select(RANK_SUGGESTION_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected rank suggestion: ${error.message}` })
  }

  return (data as { id: string; code: string; name: string; sort_order: number } | null) ?? null
}
