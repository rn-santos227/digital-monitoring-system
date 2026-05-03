import { defineEventHandler, getQuery } from 'h3'
import type { DeploymentRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentRecordSelectListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentRecordsList } from '../../utils/deployment-records/fetchDeploymentRecordsList'

export default defineEventHandler(async (event): Promise<DeploymentRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchDeploymentRecordsList(supabase, { search, rangeFrom, rangeTo })

  const items = rows.map(mapDeploymentRecordSelectListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
