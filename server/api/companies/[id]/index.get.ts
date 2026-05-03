import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { CompanyDetailResponse } from '../../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapCompanyListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getCompanyById } from '../../../utils/companies/getCompanyById'
import { getCompanyUsageCounts } from '../../../utils/companies/getCompanyUsageCounts'

export default defineEventHandler(async (event): Promise<CompanyDetailResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const supabase = getServiceSupabaseClient()
  const data = await getCompanyById(supabase, id)

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  const company = mapCompanyListItem(data)
  const usageCounts = await getCompanyUsageCounts(supabase, id)
  
  return {
    ...company,
    personnelCount: usageCounts.personnelCount,
    equipmentAssetCount: usageCounts.equipmentAssetCount,
  }
})
