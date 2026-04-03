import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from './requireAuth'

export async function requirePermission(event: H3Event, permissionCode: string) {
  const user = await requireAuth(event)
  const supabase = (await serverSupabaseClient(event)) as any

  const { data, error } = await supabase
    .from('user_account_types')
    .select('id, account_types!inner(account_type_permissions!inner(permissions!inner(code)))')
    .eq('user_id', user.id)
    .eq('account_types.account_type_permissions.permissions.code', permissionCode)
    .limit(1)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Permission lookup failed: ${error.message}` })
  }

  if (!data || data.length === 0) {
    throw createError({ statusCode: 403, statusMessage: `Missing required permission: ${permissionCode}` })
  }

  return user
}
