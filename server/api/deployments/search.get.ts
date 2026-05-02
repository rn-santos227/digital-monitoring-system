import { createError, defineEventHandler, getQuery } from 'h3'
import type { DeploymentListResponse } from '../../shared/responses'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentSelectListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = {
  deploymentArea: 'deployment_area',
  operationName: 'operation_name',
  location: 'location',
  assignmentRole: 'assignment_role',
  remarks: 'default_remarks',
} as const

export default defineEventHandler(async (event): Promise<DeploymentListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null
  const supervisorId = typeof query.supervisorId === 'string' && query.supervisorId.length > 0 ? query.supervisorId : null

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

  const supabase = getServiceSupabaseClient()
  let deploymentRecordQuery = supabase
    .from('deployments')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (filters.length > 0) {
    deploymentRecordQuery = deploymentRecordQuery.or(filters.join(','))
  }

  if (statusId) {
    deploymentRecordQuery = deploymentRecordQuery.eq('status_id', statusId)
  }

  if (supervisorId) {
    deploymentRecordQuery = deploymentRecordQuery.eq('supervisor_id', supervisorId)
  }

  const { data, count, error } = await deploymentRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search deployment records: ${error.message}` })
  }

  const items = (data ?? []).map(mapDeploymentSelectListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
