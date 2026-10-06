import {
  createError,
  defineEventHandler,
  getQuery,
  getRouterParam,
} from 'h3'
import type { BattalionEquipmentAssetListResponse } from '../../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapUnitEquipmentAssetListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchBattalionEquipmentAssets } from '../../../utils/battalions/fetchBattalionEquipmentAssets'
import { getBattalionSuggestionById } from '../../../utils/battalions/getBattalionSuggestionById'

export default defineEventHandler(async (event): Promise<BattalionEquipmentAssetListResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const battalionId = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const battalion = await getBattalionSuggestionById(supabase, battalionId)

  if (!battalion) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  const { rows, totalItems } = await fetchBattalionEquipmentAssets(supabase, {
    battalionCode: battalion.code,
    search,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapUnitEquipmentAssetListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
