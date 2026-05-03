import { defineEventHandler, getQuery } from 'h3'
import type { DeploymentListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentSelectListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentsList } from '../../utils/deployments/fetchDeploymentsList'

export default defineEventHandler(async (event): Promise<DeploymentListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { data, count } = await fetchDeploymentsList(supabase, {
    search,
    rangeFrom,
    rangeTo,
  })

  const items = data.map(mapDeploymentSelectListItem)
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
