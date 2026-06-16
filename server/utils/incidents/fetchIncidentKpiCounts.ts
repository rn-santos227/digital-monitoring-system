import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { IncidentKpiResponse } from '../../shared/responses'

export const fetchIncidentKpiCounts = async (
  supabase: SupabaseClient,
): Promise<IncidentKpiResponse> => {
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const monthStartDate = monthStart.toISOString().slice(0, 10)

}
