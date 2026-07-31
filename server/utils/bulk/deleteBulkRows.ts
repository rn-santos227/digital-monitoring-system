import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteBulkRows(
  supabase: SupabaseClient,
  table: string,
  ids: string[],
): Promise<void> {

}
