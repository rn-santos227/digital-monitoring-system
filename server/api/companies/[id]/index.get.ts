import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { CompanyDetailResponse } from '../../../shared/responses'
import { COMPANY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapCompanyListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<CompanyDetailResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select(COMPANY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  const [personnelResult, assetsResult] = await Promise.all([
    supabase.from('vw_personnel_profile').select('id', { count: 'exact', head: true }).eq('company_id', id),
    supabase.from('equipment_assets').select('id', { count: 'exact', head: true }).eq('assigned_company_id', id),
  ])

  if (personnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company personnel count: ${personnelResult.error.message}` })
  }

  if (assetsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company equipment asset count: ${assetsResult.error.message}` })
  }

  const company = mapCompanyListItem(data)

  return {
    ...company,
    personnelCount: personnelResult.count ?? 0,
    equipmentAssetCount: assetsResult.count ?? 0,
  }
})
