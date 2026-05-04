import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { USER_ACCOUNT_TYPE_ID_SELECT_COLUMNS } from '../../shared/constants'

export async function getUserAccountTypeIdsByUserId(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_account_types')
    .select(USER_ACCOUNT_TYPE_ID_SELECT_COLUMNS)
    .eq('user_id', userId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read account type assignments: ${error.message}` })
  }

  return (data ?? []).map((row) => row.account_type_id)
}
