import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { IncidentKpiResponse } from '../../shared/responses'

export const fetchIncidentKpiCounts = async (
  supabase: SupabaseClient,
): Promise<IncidentKpiResponse> => {

}
