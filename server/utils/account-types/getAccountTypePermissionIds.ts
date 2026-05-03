import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS } from '../../shared/constants'

export async function getAccountTypePermissionIds(supabase: SupabaseClient, accountTypeId: string) {
  const { data, error } = await supabase
    .from('account_type_permissions')
    .select(ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS)
    .eq('account_type_id', accountTypeId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read existing account type permissions: ${error.message}` })
  }

  return (data ?? []).map(row => row.permission_id)
}
