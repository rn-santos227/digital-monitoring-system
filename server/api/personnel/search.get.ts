import { createError, defineEventHandler, getQuery } from 'h3'
import type { PersonnelListCompactResponse } from '../../shared/responses'
import { PERSONNEL_PERMISSION_GROUPS, PERSONNEL_PROFILE_COMPACT_SELECT_COLUMNS } from '../../shared/constants'
import { mapPersonnelCompactListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_PERSONNEL_FIELDS = {
  personnelCode: 'personnel_code',
  serviceNumber: 'service_number',
  lastName: 'last_name',
  firstName: 'first_name',
  rankName: 'rank_name',
} as const

export default defineEventHandler(async (event): Promise<PersonnelListCompactResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''

  if (!term) {
    throw createError({ statusCode: 400, statusMessage: 'Search term is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_PERSONNEL_FIELDS => field in SEARCHABLE_PERSONNEL_FIELDS)
    : Object.keys(SEARCHABLE_PERSONNEL_FIELDS) as Array<keyof typeof SEARCHABLE_PERSONNEL_FIELDS>

  const filters = selectedFields.map(field => `${SEARCHABLE_PERSONNEL_FIELDS[field]}.ilike.%${term}%`)

  if (filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data, count, error } = await supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_COMPACT_SELECT_COLUMNS, {
      count: 'exact',
    })
    .or(filters.join(','))
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search personnel records: ${error.message}` })
  }

  const items = (data ?? []).map(mapPersonnelCompactListItem)
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
