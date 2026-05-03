import { createError, defineEventHandler, getQuery } from 'h3'
import type { DeploymentRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchDeploymentRecords } from '../../utils/deployment-records/searchDeploymentRecords'

export default defineEventHandler(async (event): Promise<DeploymentRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const personnelId = typeof query.personnelId === 'string' && query.personnelId.length > 0 ? query.personnelId : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null
  const supervisorId = typeof query.supervisorId === 'string' && query.supervisorId.length > 0 ? query.supervisorId : null

  if (!term && !personnelId && !statusId && !supervisorId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const fields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchDeploymentRecords(supabase, {
    term,
    fields,
    personnelId,
    statusId,
    supervisorId,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapDeploymentRecordListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
