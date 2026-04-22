import { createError, defineEventHandler, getQuery } from 'h3'
import type { CompanyListResponse } from '../../shared/responses'
import { COMPANY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanyListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = {
  code: 'code',
  name: 'name',
} as const

export default defineEventHandler(async (event): Promise<CompanyListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null
  const battalionId = typeof query.battalionId === 'string' && query.battalionId.length > 0 ? query.battalionId : null

  if (!term && typeof isActive !== 'boolean' && !battalionId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required (term, isActive, or battalionId).' })
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
  let companyQuery = supabase
    .from('companies')
    .select(COMPANY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (filters.length > 0) {
    companyQuery = companyQuery.or(filters.join(','))
  }

  if (typeof isActive === 'boolean') {
    companyQuery = companyQuery.eq('is_active', isActive)
  }

  if (battalionId) {
    companyQuery = companyQuery.eq('battalion_id', battalionId)
  }

  const { data, count, error } = await companyQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search companies: ${error.message}` })
  }

  const items = (data ?? []).map(mapCompanyListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
