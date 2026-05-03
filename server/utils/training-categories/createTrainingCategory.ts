import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function createTrainingCategory(supabase: SupabaseClient, payload: Record<string, unknown>): Promise<string> {
  const { data: createdRow, error: insertError } = await supabase
    .from('training_categories')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (insertError || !createdRow?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create training category: ${insertError?.message ?? 'Missing id.'}` })
  }

  return createdRow.id
}
