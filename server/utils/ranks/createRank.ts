import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RankCreate } from '../../shared/models'

export async function createRank(supabase: SupabaseClient, payload: RankCreate): Promise<string> {
  const { data: createdRow, error: insertError } = await supabase
    .from('ranks')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (insertError || !createdRow?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create rank: ${insertError?.message ?? 'Missing id.'}` })
  }

  return createdRow.id
}
