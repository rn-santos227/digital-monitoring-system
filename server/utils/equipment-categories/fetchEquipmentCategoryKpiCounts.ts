import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentCategoryKpiCounts } from '../../shared/models'
import { countTableRows, fetchStringColumnValues } from '../kpis/countTableRows'

export const fetchEquipmentCategoryKpiCounts = async (
  supabase: SupabaseClient,
): Promise<EquipmentCategoryKpiCounts> => {
  const [totalCategories, categoryIds, usedCategoryIds] = await Promise.all([
    countTableRows(supabase, 'equipment_categories', 'equipment categories'),
    fetchStringColumnValues(supabase, 'equipment_categories', 'id', 'equipment category ids'),
    fetchStringColumnValues(supabase, 'equipment_items', 'category_id', 'equipment item category ids'),
  ])

  const usedCategoryIdSet = new Set(usedCategoryIds)
  const unusedCategories = categoryIds.filter((categoryId) => {
    return !usedCategoryIdSet.has(categoryId)
  }).length

  return {
    totalCategories,
    unusedCategories: Math.max(0, unusedCategories),
  }
}
