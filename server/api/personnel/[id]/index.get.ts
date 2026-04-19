import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { PersonnelDetailResponse } from '../../../shared/responses'
import { PERSONNEL_PERMISSION_GROUPS, PERSONNEL_PROFILE_DETAIL_SELECT_COLUMNS } from '../../../shared/constants'
import { mapPersonnelDetail } from '../../../shared/utils'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { requireRouteId } from '../../../shared/validations'

export default defineEventHandler(async (event): Promise<PersonnelDetailResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')

  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Personnel record not found.' })
  }

  return mapPersonnelDetail(data)
})
