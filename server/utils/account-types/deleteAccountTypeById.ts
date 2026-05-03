import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteAccountTypeById(supabase: SupabaseClient, accountTypeId: string) {
  const { error } = await supabase
    .from('account_types')
    .delete()
    .eq('id', accountTypeId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete account type: ${error.message}` })
  }
}
