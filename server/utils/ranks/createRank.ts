import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { RankCreate, RankRow } from '../../shared/models'

export async function createRank(supabase: SupabaseClient, payload: RankCreate): Promise<RankRow> {
  const { data: createdRow, error: insertError } = await supabase
    .from('ranks')
    .insert(payload)
    .select(RANK_LIST_SELECT_COLUMNS)
    .maybeSingle<RankRow>()

  if (insertError || !createdRow) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create rank: ${insertError?.message ?? 'Missing id.'}` })
  }

  return createdRow
}
