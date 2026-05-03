import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_BASE_SELECT_COLUMNS } from '../../shared/constants'

export async function getCompanyById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select(COMPANY_BASE_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read company: ${error.message}` })
  }

  return data
}
