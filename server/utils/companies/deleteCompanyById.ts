import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteCompanyById(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('companies').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete company: ${error.message}` })
  }
}
