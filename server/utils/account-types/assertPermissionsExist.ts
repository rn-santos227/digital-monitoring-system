import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PRIVILEGE_BASE_SELECT_COLUMNS } from '../../shared/constants'
import type { AccountTypePermissionSummaryRow } from '../../shared/models'

export async function assertPermissionsExist(
  supabase: SupabaseClient,
  permissionIds: string[],
): Promise<AccountTypePermissionSummaryRow[]> {
  if (permissionIds.length === 0) {
    return []
  }

  const uniquePermissionIds = [...new Set(permissionIds)]
  const { data: permissionMatches, error: permissionLookupError } = await supabase
    .from('permissions')
    .select(PRIVILEGE_BASE_SELECT_COLUMNS)
    .in('id', uniquePermissionIds)

  if (permissionLookupError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to validate permissions: ${permissionLookupError.message}`,
    })
  }

  if ((permissionMatches ?? []).length !== uniquePermissionIds.length) {
    throw createError({ statusCode: 400, statusMessage: 'One or more permission ids are invalid.' })
  }

  return permissionMatches ?? []
}
