import { defineEventHandler, getRouterParam } from 'h3'
import type { DeploymentPersonnelListResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapUnitPersonnelListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchDeploymentPersonnelByDeploymentId } from '../../../utils/deployments/fetchDeploymentPersonnelByDeploymentId'

export default defineEventHandler(async (event): Promise<DeploymentPersonnelListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

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
