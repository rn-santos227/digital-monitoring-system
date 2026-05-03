import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_DETAIL_SELECT_COLUMNS } from '../../shared/constants'
import type { BattalionRow } from '../../shared/models'

export async function getBattalionById(supabase: SupabaseClient, id: string): Promise<BattalionRow | null> {
  const { data: battalion, error } = await supabase
    .from('battalions')
    .select(BATTALION_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read battalion: ${error.message}` })
  }

  return (battalion as BattalionRow | null)
}
