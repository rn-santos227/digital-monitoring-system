import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from './requireAuth'

export async function requireRole(event: H3Event, roleCode: string) {
  const user = await requireAuth(event)
  const supabase = (await serverSupabaseClient(event)) as any

  const { data, error } = await supabase
    .from('user_account_types')
    .select('id, account_types!inner(code)')
    .eq('user_id', user.id)
    .eq('account_types.code', roleCode)
    .limit(1)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Role lookup failed: ${error.message}` })
  }

  if (!data || data.length === 0) {
    throw createError({ statusCode: 403, statusMessage: `Missing required role: ${roleCode}` })
  }

  return user
}
