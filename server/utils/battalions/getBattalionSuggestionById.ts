import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'

export async function getBattalionSuggestionById(supabase: SupabaseClient, battalionId: string) {
  const { data: battalion, error } = await supabase
    .from('battalions')
    .select(BATTALION_SUGGESTION_SELECT_COLUMNS)
    .eq('id', battalionId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate battalion reference: ${error.message}` })
  }

  return battalion
}
