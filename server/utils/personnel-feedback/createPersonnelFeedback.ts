import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_FEEDBACK_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelFeedbackRow, PersonnelFeedbackValues } from '../../shared/models'
import { mapPersonnelFeedbackItem, validatePersonnelFeedbackValues } from '../../shared/utils'
import { getPersonnelFeedbackOfficial } from './getPersonnelFeedbackOfficial'

export async function createPersonnelFeedback(supabase: SupabaseClient, personnelId: string, authorUserId: string, values: PersonnelFeedbackValues) {
  await getPersonnelFeedbackOfficial(supabase, authorUserId)
  const message = Object.values(validatePersonnelFeedbackValues(values))[0]
  if (message) throw createError({ statusCode: 400, statusMessage: message })
  // One insert transaction. The DB stamps the author's rank, serial number, and time.
  const { data, error } = await supabase.from('personnel_performance_feedback').insert({
    personnel_id: personnelId,
    feedback: values.feedback,
    review_date: values.reviewDate,
    rating: values.rating,
    author_user_id: authorUserId,
    authorship_confirmed: values.attestAuthorship,
  }).select(PERSONNEL_FEEDBACK_SELECT_COLUMNS).single<PersonnelFeedbackRow>()
  if (error || !data) {
    throw createError({ statusCode: error?.code === '23514' ? 409 : 500, statusMessage: `Failed to officiate performance feedback: ${error?.message ?? 'Missing officiated record.'}` })
  }
  return mapPersonnelFeedbackItem(data)
}
