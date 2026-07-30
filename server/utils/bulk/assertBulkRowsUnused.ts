import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BulkDeleteReference } from '../../shared/models'

export async function assertBulkRowsUnused(
  supabase: SupabaseClient,
  ids: string[],
  references: readonly BulkDeleteReference[],
): Promise<void> {

}
