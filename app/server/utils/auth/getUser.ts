import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import type { AuthenticatedUser } from '../../shared/models'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from './serviceClient'

interface SessionProfileRow extends AuthenticatedUser {
  is_active: boolean
}

interface SessionUserRow {
  user_id: string
  user_profiles: SessionProfileRow
}

export async function getUser(event: H3Event) {
  const token = getSessionTokenFromEvent(event)

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
      .maybeSingle<SessionUserRow>()

    if (data?.user_profiles && (data.user_profiles as any).is_active) {
      const profile = data.user_profiles as any
      return {
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name,
      }
    }
  }

  const user = await serverSupabaseUser(event)
  return user ?? null
}
