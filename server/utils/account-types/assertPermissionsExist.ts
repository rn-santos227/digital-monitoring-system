import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PRIVILEGE_BASE_SELECT_COLUMNS } from '../../shared/constants'
import type { AccountTypePermissionSummaryRow } from '../../shared/models'

export async function assertPermissionsExist(
  supabase: SupabaseClient,
  permissionIds: string[],
): Promise<AccountTypePermissionSummaryRow[]> {

}
