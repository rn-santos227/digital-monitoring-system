import { defineEventHandler, getQuery } from 'h3'
import type { DeploymentListResponse } from '../../shared/responses'
import { DEPLOYMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapDeploymentSelectListItem } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { getDeploymentSupervisorId } from '../../utils/deployments/getDeploymentSupervisorId'
import { parseDeploymentSearchQuery } from '../../utils/deployments/parseDeploymentSearchQuery'
import { searchDeployments } from '../../utils/deployments/searchDeployments'

export default defineEventHandler(async (event): Promise<DeploymentListResponse> => {
  await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)

  const { page, pageSize, supervisorId: supervisorQuery, ...searchParams } = parseDeploymentSearchQuery(getQuery(event))
  const supabase = getServiceSupabaseClient()

  const supervisorId = await getDeploymentSupervisorId(supabase, supervisorQuery)
  const { data, count } = await searchDeployments(supabase, { ...searchParams, supervisorId })

  return {
    items: data.map(mapDeploymentSelectListItem),
    page,
    pageSize,
    totalItems: count,
    totalPages: count === 0 ? 0 : Math.ceil(count / pageSize),
  }
})
