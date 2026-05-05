import { defineEventHandler, getRouterParam } from 'h3'
import type { DeploymentPersonnelListResponse } from '../../../shared/responses'
import { DEPLOYMENT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapUnitPersonnelListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchDeploymentPersonnelByDeploymentId } from '../../../utils/deployments/fetchDeploymentPersonnelByDeploymentId'

export default defineEventHandler(async (event): Promise<DeploymentPersonnelListResponse> => {
  await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)

  const deploymentId = requireRouteId(getRouterParam(event, 'id'), 'Deployment id is required.')
  const supabase = getServiceSupabaseClient()
  const rows = await fetchDeploymentPersonnelByDeploymentId(supabase, deploymentId)
  const items = rows.map(mapUnitPersonnelListItem)

  return {
    items,
    page: 1,
    pageSize: items.length,
    totalItems: items.length,
    totalPages: items.length === 0 ? 0 : 1,
  }
})
