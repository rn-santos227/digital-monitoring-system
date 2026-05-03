import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ACCOUNT_TYPE_BASE_SELECT_COLUMNS } from '../../shared/constants'

export async function getAccountTypeById(supabase: SupabaseClient, accountTypeId: string) {
  const { data, error } = await supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_BASE_SELECT_COLUMNS)
    .eq('id', accountTypeId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read account type: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Account type not found.' })
  }

  return data
}
