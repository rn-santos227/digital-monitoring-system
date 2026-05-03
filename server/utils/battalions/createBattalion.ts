import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BattalionCreate } from '~~/server/shared/models'

export async function createBattalion(supabase: SupabaseClient, payload: BattalionCreate): Promise<string> {
  const { data: createdRow, error: insertError } = await supabase
    .from('battalions')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (insertError || !createdRow?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create battalion: ${insertError?.message ?? 'Missing id.'}` })
  }

  return createdRow.id
}
