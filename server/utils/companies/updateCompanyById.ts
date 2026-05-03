import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { CompanyUpdate } from '../../shared/models'

export async function updateCompanyById(supabase: SupabaseClient, id: string, updates: CompanyUpdate) {
  const { error } = await supabase.from('companies').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update company: ${error.message}` })
  }
}
