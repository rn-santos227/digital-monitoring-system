import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionListResponse } from '../../shared/responses'
import { BATTALION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = {
  code: 'code',
  name: 'name',
} as const

export default defineEventHandler(async (event): Promise<BattalionListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null

  if (!term && typeof isActive !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required (term or isActive).' })
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
  let battalionQuery = supabase
    .from('battalions')
    .select(BATTALION_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (filters.length > 0) {
    battalionQuery = battalionQuery.or(filters.join(','))
  }

  if (typeof isActive === 'boolean') {
    battalionQuery = battalionQuery.eq('is_active', isActive)
  }

  const { data, count, error } = await battalionQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search battalions: ${error.message}` })
  }

  const items = (data ?? []).map(mapBattalionListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
