import type { SupabaseClient } from '@supabase/supabase-js'
import type { EngagementManagementKpiCounts } from '../../shared/models'
import { countTableRows } from '../kpis/countTableRows'

export const fetchEngagementKpiCounts = async (
  supabase: SupabaseClient,
): Promise<EngagementManagementKpiCounts> => {
  const [totalEngagements, totalEngagementRecords] = await Promise.all([
    countTableRows(supabase, 'engagements', 'engagements'),
    countTableRows(supabase, 'engagement_records', 'engagement records'),
  ])

  return {
    totalEngagements,
    totalEngagementRecords,
  }
}
