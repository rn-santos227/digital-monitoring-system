import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentAssetKpiCounts } from '../../shared/models'

export const fetchEquipmentAssetKpiCounts = async (
  supabase: SupabaseClient,
): Promise<EquipmentAssetKpiCounts> => {
  const { count: totalAssets, error: totalError } = await supabase
    .from('equipment_assets')
    .select('id', { count: 'exact', head: true })

  if (totalError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to count equipment assets: ${totalError.message}` })
  }

  const { data: issuedStatus, error: issuedStatusError } = await supabase
    .from('asset_statuses')
    .select('id')
    .eq('name', 'Issued')
    .maybeSingle()

  if (issuedStatusError || !issuedStatus?.id) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to resolve issued asset status.' })
  }

  const { count: issuedAssets, error: issuedError } = await supabase
    .from('equipment_assets')
    .select('id', { count: 'exact', head: true })
    .eq('asset_status_id', issuedStatus.id)

  if (issuedError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to count issued equipment assets: ${issuedError.message}` })
  }

  const resolvedTotalAssets = totalAssets ?? 0
  const resolvedIssuedAssets = issuedAssets ?? 0

  return {
    totalAssets: resolvedTotalAssets,
    issuedAssets: resolvedIssuedAssets,
    notIssuedAssets: Math.max(0, resolvedTotalAssets - resolvedIssuedAssets),
  }
}
