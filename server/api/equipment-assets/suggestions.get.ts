import { defineEventHandler, getQuery } from 'h3'
import type { EquipmentAssetSuggestionApiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssetSuggestions } from '../../utils/equipment-assets/fetchEquipmentAssetSuggestions'
import { mapEquipmentAssetSuggestionItem, parseEquipmentItemSuggestionQuery } from '../../shared/utils/equipment-management'

export default defineEventHandler(async (event): Promise<EquipmentAssetSuggestionApiResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const { term, pageSize } = parseEquipmentItemSuggestionQuery({ term: query.term, pageSize: query.pageSize })
  const supabase = getServiceSupabaseClient()
  const rows = await fetchEquipmentAssetSuggestions(supabase, term, pageSize)
  return { items: rows.map(mapEquipmentAssetSuggestionItem) }
})
