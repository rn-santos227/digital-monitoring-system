import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { CompanyEquipmentAssetListResponse } from '../../../shared/responses'
import {
  COMPANY_BASE_SELECT_COLUMNS,
  UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS,
  UNIT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import {
  mapUnitEquipmentAssetListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'


export default defineEventHandler(async (event): Promise<CompanyEquipmentAssetListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const companyId = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select(COMPANY_BASE_SELECT_COLUMNS)
    .eq('id', companyId)
    .maybeSingle()

  if (companyError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate company reference: ${companyError.message}` })
  }

  if (!company) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  let assetsQuery = supabase
    .from('vw_equipment_accountability')
    .select(UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('assigned_company_code', company.code)
    .order('asset_tag', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search.length > 0) {
    assetsQuery = assetsQuery.or([
      `asset_tag.ilike.%${search}%`,
      `equipment_code.ilike.%${search}%`,
      `item_name.ilike.%${search}%`,
      `assigned_personnel_code.ilike.%${search}%`,
    ].join(','))
  }

  const { data, count, error } = await assetsQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company equipment assets: ${error.message}` })
  }

  const items = (data ?? []).map(mapUnitEquipmentAssetListItem)
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
