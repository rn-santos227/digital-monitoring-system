import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_REFERENCE_ID_SELECT_COLUMNS } from '../../shared/constants'

export const assertBattalionExists = async (supabase: SupabaseClient, battalionId: string): Promise<void> => {
  const { data: battalion, error } = await supabase
    .from('battalions')
    .select(BATTALION_REFERENCE_ID_SELECT_COLUMNS)
    .eq('id', battalionId)
    .maybeSingle()

  if (error || !battalion) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid battalion id.' })
  }
}
