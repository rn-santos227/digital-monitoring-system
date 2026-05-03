
import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchCompanyEquipmentAssets(supabase: SupabaseClient, companyCode: string, search: string, rangeFrom: number, rangeTo: number) {
  let query = supabase
    .from('vw_equipment_accountability')
    .select(UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('assigned_company_code', companyCode)
    .order('asset_tag', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search.length > 0) {
    query = query.or(`asset_tag.ilike.%${search}%,equipment_code.ilike.%${search}%,item_name.ilike.%${search}%,assigned_personnel_code.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company equipment assets: ${error.message}` })
  }

  return { data: data ?? [], count: count ?? 0 }
}
