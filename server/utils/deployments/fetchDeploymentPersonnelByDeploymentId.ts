import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchDeploymentPersonnelByDeploymentId(supabase: SupabaseClient, deploymentId: string) {
  const { data: deploymentRecords, error: deploymentRecordsError } = await supabase
    .from('deployment_records')
    .select('personnel_id')
    .eq('deployment_id', deploymentId)

  if (deploymentRecordsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment personnel records: ${deploymentRecordsError.message}` })
  }

  const uniquePersonnelIds = [...new Set((deploymentRecords ?? []).map(record => record.personnel_id).filter(Boolean))]

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
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment personnel profiles: ${personnelError.message}` })
  }

  return personnelProfiles ?? []
}
