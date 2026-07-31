import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateBulkRow(
  supabase: SupabaseClient,
  table: string,
  id: string,
  updates: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from(table).update(updates).eq('id', id)
  if (error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update ${table}: ${error.message}`,
    })
}
