import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ASSET_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetRow } from '../../shared/models'

export const fetchEquipmentAssetsList = async (
  supabase: SupabaseClient,
  search: string,
  from: number,
  to: number,
) => {
  let query = supabase
    .from('equipment_assets')
    .select(EQUIPMENT_ASSET_SELECT_COLUMNS, { count: 'exact' })

  if (search.length > 0) {
    query = query.or(`asset_tag.ilike.%${search}%,serial_no.ilike.%${search}%,batch_no.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    rows: (data ?? []) as EquipmentAssetRow[],
    totalItems: count ?? 0,
  }
}
