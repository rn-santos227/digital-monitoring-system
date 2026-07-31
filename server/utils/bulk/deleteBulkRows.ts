import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteBulkRows(
  supabase: SupabaseClient,
  table: string,
  ids: string[],
): Promise<void> {
  const { error } = await supabase.from(table).delete().in('id', ids)
  if (error)
    throw createError({
      statusCode: 409,
      statusMessage: `Failed to delete ${table}: ${error.message}`,
    })
}
