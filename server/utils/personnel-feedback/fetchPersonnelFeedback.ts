import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_FEEDBACK_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelFeedbackRow } from '../../shared/models'
import { mapPersonnelFeedbackItem } from '../../shared/utils'

export async function fetchPersonnelFeedback(supabase: SupabaseClient, personnelId: string, rangeFrom: number, rangeTo: number) {
  const { data, count, error } = await supabase.from('personnel_performance_feedback')
    .select(PERSONNEL_FEEDBACK_SELECT_COLUMNS, { count: 'exact' }).eq('personnel_id', personnelId)
    .order('officiated_at', { ascending: false }).order('id', { ascending: false }).range(rangeFrom, rangeTo)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to load performance feedback: ${error.message}` })
  return { items: ((data ?? []) as PersonnelFeedbackRow[]).map(mapPersonnelFeedbackItem), totalItems: count ?? 0 }
}
