import { createError, defineEventHandler, getQuery } from 'h3'
import type { CompanyListResponse } from '../../shared/responses'
import { COMPANY_SEARCHABLE_FIELD_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanyListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchCompanies } from '../../utils/companies/searchCompanies'

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

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS)
    : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>
   
  if (term && selectedFields.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const result = await searchCompanies(supabase, {
    term,
    isActive,
    battalionId,
    rangeFrom,
    rangeTo,
    fields: selectedFields.map(field => SEARCHABLE_FIELDS[field]),
  })

  const items = result.data.map(mapCompanyListItem)
  const totalPages = result.count === 0 ? 0 : Math.ceil(result.count / pageSize)

  return { items, page, pageSize, totalItems: result.count, totalPages }
})
