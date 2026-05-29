import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PersonnelKpiCounts } from '../../shared/models'
import { countTableRows, fetchStringColumnValues, resolveCountResult } from '../kpis/countTableRows'

const fetchDeployedServiceStatusIds = async (supabase: SupabaseClient): Promise<string[]> => {
  const { data, error } = await supabase
    .from('service_statuses')
    .select('id')
    .ilike('name', '%deployed%')
    .returns<Array<{ id: string }>>()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to resolve deployed service statuses: ${error.message}`,
    })
  }

  return (data ?? []).map((row) => row.id)
}

const countDeployedPersonnel = async (
  supabase: SupabaseClient,
  deployedServiceStatusIds: string[],
): Promise<number> => {
  if (deployedServiceStatusIds.length === 0) {
    return 0
  }

  const result = await supabase
    .from('personnel')
    .select('id', { count: 'exact', head: true })
    .in('service_status_id', deployedServiceStatusIds)

  return resolveCountResult(result, 'deployed personnel')
}

export const fetchPersonnelKpiCounts = async (
  supabase: SupabaseClient,
): Promise<PersonnelKpiCounts> => {
  const [
    totalPersonnel,
    totalRanks,
    rankIds,
    usedRankIds,
    deployedServiceStatusIds,
  ] = await Promise.all([
    countTableRows(supabase, 'personnel', 'personnel records'),
    countTableRows(supabase, 'ranks', 'rank records'),
    fetchStringColumnValues(supabase, 'ranks', 'id', 'rank ids'),
    fetchStringColumnValues(supabase, 'personnel', 'rank_id', 'personnel rank ids'),
    fetchDeployedServiceStatusIds(supabase),
  ])

  const deployedPersonnel = await countDeployedPersonnel(supabase, deployedServiceStatusIds)
  const usedRankIdSet = new Set(usedRankIds)
  const unusedRanks = rankIds.filter((rankId) => !usedRankIdSet.has(rankId)).length

  return {
    totalPersonnel,
    deployedPersonnel,
    totalRanks,
    unusedRanks: Math.max(0, unusedRanks),
  }
}
