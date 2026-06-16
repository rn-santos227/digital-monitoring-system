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

  const [totalResult, unresolvedResult, monthResult] = await Promise.all([
    supabase.from('equipment_incidents').select('id', { count: 'exact', head: true }),
    supabase.from('equipment_incidents').select('id', { count: 'exact', head: true }).is('resolution', null),
    supabase
      .from('equipment_incidents')
      .select('id', { count: 'exact', head: true })
      .gte('incident_date', monthStartDate),
  ])

  const error = totalResult.error ?? unresolvedResult.error ?? monthResult.error

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

}
