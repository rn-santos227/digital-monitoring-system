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
