import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchEngagementPersonnelByEngagementId(supabase: SupabaseClient, engagementId: string) {
  const { data: engagementRecords, error: engagementRecordsError } = await supabase
    .from('engagement_records')
    .select('personnel_id')
    .eq('engagement_id', engagementId)

  if (engagementRecordsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch engagement personnel records: ${engagementRecordsError.message}` })
  }

  const uniquePersonnelIds = [...new Set((engagementRecords ?? []).map(record => record.personnel_id).filter(Boolean))]

  if (uniquePersonnelIds.length === 0) {
    return []
  }

  const { data: personnelProfiles, error: personnelError } = await supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS)
    .in('id', uniquePersonnelIds)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })

  if (personnelError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch engagement personnel profiles: ${personnelError.message}` })
  }

  return personnelProfiles ?? []
}
