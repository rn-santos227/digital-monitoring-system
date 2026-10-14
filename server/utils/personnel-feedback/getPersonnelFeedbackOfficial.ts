import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_FEEDBACK_OFFICIAL_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelFeedbackOfficial, PersonnelFeedbackOfficialRow } from '../../shared/models'
import { firstRelatedItem } from '../../shared/utils'

export async function getPersonnelFeedbackOfficial(supabase: SupabaseClient, userId: string): Promise<PersonnelFeedbackOfficial> {
  const { data, error } = await supabase.from('user_profiles').select(PERSONNEL_FEEDBACK_OFFICIAL_SELECT_COLUMNS)
    .eq('id', userId).maybeSingle<PersonnelFeedbackOfficialRow>()
  if (error) throw createError({ statusCode: 500, statusMessage: 'Unable to verify the submitting official.' })
  const personnel = firstRelatedItem(data?.personnel)
  const rank = firstRelatedItem(personnel?.rank)
  if (!data?.is_active || !personnel || !personnel.service_number.trim() || !rank?.name.trim()) {
    throw createError({ statusCode: 403, statusMessage: 'Your account must be linked to a personnel record with a serial number and rank to officiate feedback.' })
  }
  return {
    userId: data.id,
    personnelId: personnel.id,
    name: [personnel.first_name, personnel.middle_name, personnel.last_name].filter(Boolean).join(' '),
    rank: rank.name,
    serialNumber: personnel.service_number,
    title: personnel.position,
  }
}
