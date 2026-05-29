import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentManagementKpiCounts } from '../../shared/models'
import { countTableRows } from '../kpis/countTableRows'

export const fetchDeploymentKpiCounts = async (
  supabase: SupabaseClient,
): Promise<DeploymentManagementKpiCounts> => {
  const [totalDeployments, totalDeploymentRecords] = await Promise.all([
    countTableRows(supabase, 'deployments', 'deployments'),
    countTableRows(supabase, 'deployment_records', 'deployment records'),
  ])

  return {
    totalDeployments,
    totalDeploymentRecords,
  }
}
