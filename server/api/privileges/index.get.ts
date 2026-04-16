import { createError, defineEventHandler, getQuery } from 'h3'
import type { PrivilegeListResponse } from '../../shared/models'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapPrivilegeListItem } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<PrivilegeListResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const query = getQuery(event)
  const accountTypeId = typeof query.accountTypeId === 'string' ? query.accountTypeId.trim() : ''
  const supabase = getServiceSupabaseClient()

  const assignedPermissionIds = new Set<string>()

  if (accountTypeId) {
    const { data: assignedPermissions, error: assignedPermissionsError } = await supabase
      .from('account_type_permissions')
      .select('permission_id')
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
    .select('id, code, name, module')
    .order('module', { ascending: true })
    .order('name', { ascending: true })

  if (permissionsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch privileges: ${permissionsError.message}` })
  }

  return {
    items: (permissions ?? []).map(permission => mapPrivilegeListItem(permission, assignedPermissionIds)),
  }
})
