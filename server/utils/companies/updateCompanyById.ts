import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UpdateCompanyRequest } from '../../shared/requests'

export async function updateCompanyById(supabase: SupabaseClient, id: string, updates: UpdateCompanyRequest) {
  const { error } = await supabase.from('companies').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update company: ${error.message}` })
  }
}
