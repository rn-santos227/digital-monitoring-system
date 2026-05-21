import { createError, defineEventHandler, getQuery } from 'h3'
import type { EquipmentItemListApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentItemListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchEquipmentItems } from '../../utils/equipment-items/searchEquipmentItems'

const SEARCHABLE_FIELDS = {
  equipmentCode: 'equipment_code',
  name: 'name',
  model: 'model',
  manufacturer: 'manufacturer',
} as const

export default defineEventHandler(async (event): Promise<EquipmentItemListApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  if (!term) throw createError({ statusCode: 400, statusMessage: 'Search term is required.' })
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map((field) => field.trim()) : []
  const selectedFields = rawFields.length > 0 ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS) : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>
  const filters = selectedFields.map((field) => `${SEARCHABLE_FIELDS[field]}.ilike.%${term}%`)
  if (filters.length === 0) throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchEquipmentItems(supabase, filters, rangeFrom, rangeTo)
  return { items: rows.map(mapEquipmentItemListItem), page, pageSize, totalItems, totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize) }
})
