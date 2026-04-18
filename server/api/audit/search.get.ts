import { createError, defineEventHandler, getQuery } from 'h3'
import type { AuditLogListResponse } from '../../shared/models'
import { AUDIT_LOG_LIST_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import { mapAuditLogListItem, parsePaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_AUDIT_FIELDS = {
  action: 'action',
  tableName: 'table_name',
  recordId: 'record_id',
  ipAddress: 'ip_address',
  statusCode: 'status_code',
} as const

export default defineEventHandler(async (event): Promise<AuditLogListResponse> => {
  await requirePermission(event, PERMISSION_CODES.auditView)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const userName = typeof query.userName === 'string' ? query.userName.trim() : ''
  const startDate = typeof query.startDate === 'string' ? query.startDate.trim() : ''
  const endDate = typeof query.endDate === 'string' ? query.endDate.trim() : ''

  if (!term && !userName && !startDate && !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one search filter is required (term, userName, startDate, endDate).',
    })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parsePaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const searchFilters: string[] = []
  if (term) {
    const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
    const selectedFields = rawFields.length > 0
      ? rawFields.filter((field): field is keyof typeof SEARCHABLE_AUDIT_FIELDS => field in SEARCHABLE_AUDIT_FIELDS)
      : Object.keys(SEARCHABLE_AUDIT_FIELDS) as Array<keyof typeof SEARCHABLE_AUDIT_FIELDS>

    const statusCodeTerm = Number(term)
    const numericStatusCode = Number.isInteger(statusCodeTerm) ? statusCodeTerm : null

    for (const field of selectedFields) {
      if (field === 'statusCode') {
        if (numericStatusCode !== null) {
          searchFilters.push(`${SEARCHABLE_AUDIT_FIELDS.statusCode}.eq.${numericStatusCode}`)
        }
        continue
      }

      if (field === 'ipAddress') {
        searchFilters.push(`${SEARCHABLE_AUDIT_FIELDS.ipAddress}.eq.${term}`)
        continue
      }

      searchFilters.push(`${SEARCHABLE_AUDIT_FIELDS[field]}.ilike.%${term}%`)
    }

    if (searchFilters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided for this term.' })
    }
  }

  const supabase = getServiceSupabaseClient()
  let auditSearchQuery = supabase
    .from('audit_logs')
    .select(AUDIT_LOG_LIST_SELECT_COLUMNS, {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(rangeFrom, rangeTo)

  if (searchFilters.length > 0) {
    auditSearchQuery = auditSearchQuery.or(searchFilters.join(','))
  }

  if (userName) {
    auditSearchQuery = auditSearchQuery.ilike('user_profiles.full_name', `%${userName}%`)
  }

  if (startDate) {
    auditSearchQuery = auditSearchQuery.gte('created_at', startDate)
  }

  if (endDate) {
    auditSearchQuery = auditSearchQuery.lte('created_at', endDate)
  }

  const { data, count, error } = await auditSearchQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search audit logs: ${error.message}` })
  }

  const items = (data ?? []).map(mapAuditLogListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
