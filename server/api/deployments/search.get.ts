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

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null
  const supabase = getServiceSupabaseClient()
  const supervisorId = await getDeploymentSupervisorId(supabase, query.supervisorId)

  if (!term && !statusId && !supervisorId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS)
    : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>
  const filters = term ? selectedFields.map(field => `${SEARCHABLE_FIELDS[field]}.ilike.%${term}%`) : []

  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const { data, count } = await searchDeployments(supabase, {
    filters,
    statusId,
    supervisorId,
    rangeFrom,
    rangeTo,
  })

  const items = data.map(mapDeploymentSelectListItem)
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
