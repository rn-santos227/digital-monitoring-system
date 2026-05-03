import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PrivilegeListResponse } from '../../shared/models'
import {
  ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS,
  PRIVILEGE_BASE_SELECT_COLUMNS,
} from '../../shared/constants'
import { mapPrivilegeListItem } from '../../shared/utils'

export async function fetchPrivilegeList(
  supabase: SupabaseClient,
  accountTypeId: string,
): Promise<PrivilegeListResponse> {
  const assignedPermissionIds = new Set<string>()

  if (accountTypeId) {
    const { data: assignedPermissions, error: assignedPermissionsError } = await supabase
      .from('account_type_permissions')
      .select(ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS)
      .eq('account_type_id', accountTypeId)

    if (assignedPermissionsError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch assigned privileges: ${assignedPermissionsError.message}` })
    }

    assignedPermissions?.forEach((assignedPermission) => {
      if (assignedPermission.permission_id) {
        assignedPermissionIds.add(assignedPermission.permission_id)
      }
    })
  }

  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select(PRIVILEGE_BASE_SELECT_COLUMNS)
    .order('module', { ascending: true })
    .order('name', { ascending: true })

  if (permissionsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch privileges: ${permissionsError.message}` })
  }

  return {
    items: (permissions ?? []).map(permission => mapPrivilegeListItem(permission, assignedPermissionIds)),
  }
}
