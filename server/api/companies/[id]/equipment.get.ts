import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { CompanyEquipmentAssetListResponse } from '../../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapUnitEquipmentAssetListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchCompanyEquipmentAssets } from '../../../utils/companies/fetchCompanyEquipmentAssets'
import { getCompanyById } from '../../../utils/companies/getCompanyById'

export default defineEventHandler(async (event): Promise<CompanyEquipmentAssetListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const companyId = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })

  const supabase = getServiceSupabaseClient()
  const company = await getCompanyById(supabase, companyId)

  if (!company) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  const result = await fetchCompanyEquipmentAssets(supabase, company.code, search, rangeFrom, rangeTo)
  const items = result.data.map(mapUnitEquipmentAssetListItem)
  const totalPages = result.count === 0 ? 0 : Math.ceil(result.count / pageSize)

  return { items, page, pageSize, totalItems: result.count, totalPages }
})
