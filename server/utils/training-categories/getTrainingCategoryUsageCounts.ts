import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getTrainingCategoryUsageCounts(supabase: SupabaseClient, id: string): Promise<number> {
  const usageChecks = await Promise.all([
    supabase.from('training_records').select('id', { count: 'exact', head: true }).eq('training_category_id', id),
    supabase.from('trainings').select('id', { count: 'exact', head: true }).eq('training_category_id', id),
  ])

  const hasErrors = usageChecks.find(result => result.error)

  if (hasErrors?.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to check training category usage: ${hasErrors.error.message}` })
  }

  return usageChecks.reduce((total, result) => total + (result.count ?? 0), 0)
}
