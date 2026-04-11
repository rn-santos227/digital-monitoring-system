import type { H3Event } from 'h3'
import type { AuthenticatedUser } from '../../shared/models'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from './serviceClient'

export async function getUser(event: H3Event): Promise<AuthenticatedUser | null> {
  const sessionToken = getSessionTokenFromEvent(event)

  if (!sessionToken) {
    return null
  }

  const supabase = getServiceSupabaseClient()
  const now = new Date().toISOString()

  const { data: activeSession } = await supabase
    .from('auth_sessions')
    .select('user_id')
    .eq('access_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', now)
    .limit(1)
    .maybeSingle<{ user_id: string }>()

  if (!activeSession?.user_id) {
    return null
  }
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, email, full_name, is_active')
    .eq('id', activeSession.user_id)
    .limit(1)
    .maybeSingle<{ id: string; email: string; full_name: string | null; is_active: boolean }>()

  if (profile?.is_active) {
    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
    }
  }

  const { data: authUserData } = await supabase.auth.admin.getUserById(activeSession.user_id)
  const authUser = authUserData?.user

  if (!authUser?.email) {
    return null
  }

  return {
    id: authUser.id,
    email: authUser.email,
    full_name: (authUser.user_metadata?.full_name as string | undefined) ?? null,
  }
}
