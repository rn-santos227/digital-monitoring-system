import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EquipmentIncidentCreate, EquipmentIncidentUpdate } from '../../shared/models'

const assertReferenceExists = async (
  supabase: SupabaseClient,
  table: string,
  id: string,
  label: string,
): Promise<void> => {
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  if (!data?.id) {
    throw createError({ statusCode: 400, statusMessage: `Invalid ${label}.` })
  }
}

export const assertIncidentReferencesExist = async (
  supabase: SupabaseClient,
  payload: EquipmentIncidentCreate | EquipmentIncidentUpdate,
): Promise<void> => {
  const checks: Promise<void>[] = []

  if (payload.equipment_asset_id) {
    checks.push(assertReferenceExists(supabase, 'equipment_assets', payload.equipment_asset_id, 'equipment asset'))
  }

  if (payload.personnel_id) {
    checks.push(assertReferenceExists(supabase, 'personnel', payload.personnel_id, 'personnel'))
  }

  if (payload.deployment_id) {
    checks.push(assertReferenceExists(supabase, 'deployment_records', payload.deployment_id, 'deployment record'))
  }
}
