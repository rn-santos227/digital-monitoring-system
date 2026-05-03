import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { CompanyCreate } from '../../shared/models'

export async function createCompany(supabase: SupabaseClient, payload: CompanyCreate): Promise<string> {
  const { data, error } = await supabase
    .from('companies')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (error || !data?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create company: ${error?.message ?? 'Missing id.'}` })
  }

  return data.id
}
