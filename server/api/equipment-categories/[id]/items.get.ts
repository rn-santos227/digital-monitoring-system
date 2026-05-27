import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { EquipmentItemListApiResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentItemListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchEquipmentItemsByCategoryId } from '../../../utils/equipment-categories/fetchEquipmentItemsByCategoryId'
import { getEquipmentCategoryById } from '../../../utils/equipment-categories/getEquipmentCategoryById'

export default defineEventHandler(async (event): Promise<EquipmentItemListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const categoryId = requireRouteId(
    getRouterParam(event, 'id'),
    'Equipment category id is required.',
  )
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const category = await getEquipmentCategoryById(supabase, categoryId)

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment category not found.' })
  }

  const { rows, totalItems } = await fetchEquipmentItemsByCategoryId(supabase, {
    categoryId,
    search,
    rangeFrom,
    rangeTo,
  })

  return {
    items: rows.map(mapEquipmentItemListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
