import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { BattalionDetailResponse } from '../../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapBattalionListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getBattalionById } from '../../../utils/battalions/getBattalionById'
import { getBattalionDetailCounts } from '../../../utils/battalions/getBattalionDetailCounts'

export default defineEventHandler(async (event): Promise<BattalionDetailResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const supabase = getServiceSupabaseClient()
  const battalion = await getBattalionById(supabase, id)

  if (!battalion) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  const counts = await getBattalionDetailCounts(supabase, id)
  const battalionItem = mapBattalionListItem(battalion)

  return {
    ...battalionItem,
    ...counts,
  }
})