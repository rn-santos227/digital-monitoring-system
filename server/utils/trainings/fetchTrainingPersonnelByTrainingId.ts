import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchTrainingPersonnelByTrainingId(supabase: SupabaseClient, trainingId: string) {
  const { data: trainingRecords, error: trainingRecordsError } = await supabase
    .from('training_records')
    .select('personnel_id')
    .eq('training_id', trainingId)

  if (trainingRecordsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training personnel records: ${trainingRecordsError.message}` })
  }

  const uniquePersonnelIds = [...new Set((trainingRecords ?? []).map(record => record.personnel_id).filter(Boolean))]

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
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training personnel profiles: ${personnelError.message}` })
  }

  return personnelProfiles ?? []
}
