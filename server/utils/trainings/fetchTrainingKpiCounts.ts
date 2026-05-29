import type { SupabaseClient } from '@supabase/supabase-js'
import type { TrainingManagementKpiCounts } from '../../shared/models'
import { countTableRows, fetchStringColumnValues } from '../kpis/countTableRows'

export const fetchTrainingKpiCounts = async (
  supabase: SupabaseClient,
): Promise<TrainingManagementKpiCounts> => {
  const [
    totalRecords,
    totalTrainings,
    totalCategories,
    categoryIds,
    usedCategoryIds,
  ] = await Promise.all([
    countTableRows(supabase, 'training_records', 'training records'),
    countTableRows(supabase, 'trainings', 'trainings'),
    countTableRows(supabase, 'training_categories', 'training categories'),
    fetchStringColumnValues(supabase, 'training_categories', 'id', 'training category ids'),
    fetchStringColumnValues(supabase, 'trainings', 'training_category_id', 'training category usage'),
  ])

  const usedCategoryIdSet = new Set(usedCategoryIds)
  const unusedCategories = categoryIds.filter((categoryId) => {
    return !usedCategoryIdSet.has(categoryId)
  }).length

  return {
    totalRecords,
    totalTrainings,
    totalCategories,
    unusedCategories: Math.max(0, unusedCategories),
  }
}
