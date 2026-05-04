import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_REFERENCE_ID_SELECT_COLUMNS } from '../../shared/constants'

export async function getRankById(supabase: SupabaseClient, id: string): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from('ranks')
    .select(RANK_REFERENCE_ID_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read rank: ${error.message}` })
  }

  return (data as Record<string, unknown> | null) ?? null
}
