import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BulkDeleteReference } from '../../shared/models'

export async function assertBulkRowsUnused(
  supabase: SupabaseClient,
  ids: string[],
  references: readonly BulkDeleteReference[],
): Promise<void> {
  const usages: string[] = []
  for (const reference of references) {
    const { data, error } = await supabase
      .from(reference.table)
      .select(reference.column)
      .in(reference.column, ids)
      .limit(1)
    if (error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to check ${reference.table} usage: ${error.message}`,
      })
    if ((data ?? []).length > 0)
      usages.push(`${reference.table}.${reference.column}`)
  }

}
