import { createError, defineEventHandler, getQuery } from 'h3'
import type { DeploymentListResponse } from '../../shared/responses'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentSelectListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<DeploymentListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let deploymentRecordQuery = supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    deploymentRecordQuery = deploymentRecordQuery.or(
      `deployment_area.ilike.%${search}%,operation_name.ilike.%${search}%,location.ilike.%${search}%,assignment_role.ilike.%${search}%,default_remarks.ilike.%${search}%`,
    )
  }

  const { data, count, error } = await deploymentRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment records: ${error.message}` })
  }

  const items = (data ?? []).map(mapDeploymentSelectListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
