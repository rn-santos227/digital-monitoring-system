import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function replaceAccountTypePermissions(supabase: SupabaseClient, accountTypeId: string, permissionIds: string[]) {
  const { error: deleteError } = await supabase
    .from('account_type_permissions')
    .delete()
    .eq('account_type_id', accountTypeId)

  if (deleteError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to clear existing account type permissions: ${deleteError.message}` })
  }

  if (permissionIds.length === 0) {
    return
  }

  const { error: insertError } = await supabase
    .from('account_type_permissions')
    .insert(permissionIds.map(permissionId => ({ account_type_id: accountTypeId, permission_id: permissionId })))

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to assign account type permissions: ${insertError.message}` })
  }
}
