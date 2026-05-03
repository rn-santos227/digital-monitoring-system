import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DASHBOARD_EQUIPMENT_STATUS_SELECT_COLUMNS } from '../../shared/constants'
import type { DashboardEquipmentStatusRow } from '../../shared/utils'

export async function fetchEquipmentAssets(supabase: SupabaseClient, contextLabel: string) {
  const equipmentResult = await supabase
    .from('equipment_assets')
    .select(DASHBOARD_EQUIPMENT_STATUS_SELECT_COLUMNS)

  if (equipmentResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load ${contextLabel}: ${equipmentResult.error.message}` })
  }

  return (equipmentResult.data ?? []) as DashboardEquipmentStatusRow[]
}
