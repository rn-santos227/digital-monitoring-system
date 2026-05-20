import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS } from '../../shared/constants'

export async function getEquipmentCategoryUsageCounts(supabase: SupabaseClient, categoryId: string): Promise<number> {
  const { count, error } = await supabase
    .from('equipment_items')
    .select(ID_ONLY_SELECT_COLUMNS, { count: 'exact', head: true })
    .eq('category_id', categoryId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to check equipment category usage: ${error.message}` })
  }

  return count ?? 0
}
