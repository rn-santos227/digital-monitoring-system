import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_DETAIL_SELECT_COLUMNS } from '../../shared/constants'
import type { CompanyRow } from '../../shared/models'

export async function getCompanyById(supabase: SupabaseClient, id: string): Promise<CompanyRow | null> {
  const { data, error } = await supabase
    .from('companies')
    .select(COMPANY_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read company: ${error.message}` })
  }

  return data as CompanyRow | null
}
