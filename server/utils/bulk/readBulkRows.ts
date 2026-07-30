import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function readBulkRows(
  supabase: SupabaseClient,
  table: string,
  ids: string[],
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.from(table).select('*').in('id', ids)
  if (error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to read ${table}: ${error.message}`,
    })
  return (data ?? []) as Record<string, unknown>[]
}
