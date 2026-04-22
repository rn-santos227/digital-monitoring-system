import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { BattalionDetailResponse } from '../../../shared/responses'
import { BATTALION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapBattalionListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<BattalionDetailResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('battalions')
    .select(BATTALION_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  return mapBattalionListItem(data)
})
