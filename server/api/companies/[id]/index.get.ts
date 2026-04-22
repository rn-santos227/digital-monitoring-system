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

  return mapCompanyListItem(data)
})
