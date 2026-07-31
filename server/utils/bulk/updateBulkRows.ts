import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateBulkRow(
  supabase: SupabaseClient,
  table: string,
  id: string,
  updates: Record<string, unknown>,
): Promise<void> {

}
