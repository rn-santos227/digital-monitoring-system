import type { H3Event } from 'h3'
import { getCookie, getHeader } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { getServiceSupabaseClient } from './serviceClient'

export async function getUser(event: H3Event) {
  const bearer = getHeader(event, 'authorization')
  const tokenFromHeader = bearer?.startsWith('Bearer ') ? bearer.slice(7).trim() : null
  const token = tokenFromHeader || getCookie(event, 'dms_session')

  if (token) {
    const supabase = getServiceSupabaseClient()
    const now = new Date().toISOString()

    const { data } = await supabase
      .from('auth_sessions')
      .select('user_id, user_profiles!inner(id, username, full_name, is_active)')
      .eq('access_token', token)
      .is('revoked_at', null)
      .gt('expires_at', now)
      .limit(1)
      .maybeSingle()

  }
}
