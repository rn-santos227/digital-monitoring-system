import { defineEventHandler } from 'h3'
import { DEPLOYMENT_PERMISSION_GROUPS } from '../../shared/constants'
import type { DeploymentManagementKpiApiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentKpiCounts } from '../../utils/deployments/fetchDeploymentKpiCounts'

export default defineEventHandler(async (event): Promise<DeploymentManagementKpiApiResponse> => {
  await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  return await fetchDeploymentKpiCounts(getServiceSupabaseClient())
})
