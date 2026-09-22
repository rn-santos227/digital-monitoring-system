import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentCategoryListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentCategoryListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseEquipmentCategorySearchQuery } from '../../utils/equipment-categories/parseEquipmentCategorySearchQuery'
import { searchEquipmentCategories } from '../../utils/equipment-categories/searchEquipmentCategories'

export default defineEventHandler(async (event): Promise<EquipmentCategoryListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const { page, pageSize, ...searchOptions } = parseEquipmentCategorySearchQuery(getQuery(event))
  const { rows, totalItems } = await searchEquipmentCategories(getServiceSupabaseClient(), searchOptions)

  return {
    items: rows.map(mapEquipmentCategoryListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
