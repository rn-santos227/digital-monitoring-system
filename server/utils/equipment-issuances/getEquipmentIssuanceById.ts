import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ISSUANCE_DETAILS_COLUMNS } from '../../shared/constants'

export async function getEquipmentIssuanceById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('equipment_issuances')
    .select(EQUIPMENT_ISSUANCE_DETAILS_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment issuance: ${error.message}` })
  }

  return data
}
