import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DASHBOARD_OPERATIONAL_TIME_MONITORING_SELECT_COLUMNS } from '../../shared/constants'

export interface OperationalTimeDeploymentRow {
  start_date: string
  end_date: string | null
}

export async function fetchOperationalTimeDeployments(supabase: SupabaseClient, todayIsoDate: string, limit: number) {
  const operationalTimeResult = await supabase
    .from('deployment_records')
    .select(DASHBOARD_OPERATIONAL_TIME_MONITORING_SELECT_COLUMNS)
    .eq('deployment_statuses.name', 'Active')
    .or(`end_date.is.null,end_date.gte.${todayIsoDate}`)

  if (operationalTimeResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load operational time monitoring metrics: ${operationalTimeResult.error.message}` })
  }

  return (operationalTimeResult.data ?? []) as OperationalTimeDeploymentRow[]
}
