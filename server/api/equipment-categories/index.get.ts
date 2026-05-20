import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentCategoryListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentCategoryListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentCategoriesList } from '../../utils/equipment-categories/fetchEquipmentCategoriesList'

export default defineEventHandler(async (event): Promise<EquipmentCategoryListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await fetchEquipmentCategoriesList(supabase, { search, rangeFrom, rangeTo })

  return {
    items: rows.map(mapEquipmentCategoryListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
