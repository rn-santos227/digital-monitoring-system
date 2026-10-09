import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import { AUTH_SESSION_USER_ID_SELECT_COLUMNS } from '../../shared/constants'

export const revokeSessionByToken = async (
  supabase: SupabaseClient,
  token: string,
): Promise<string | null> => {
  const { data: currentSession, error: sessionError } = await supabase
    .from('auth_sessions')
    .select(AUTH_SESSION_USER_ID_SELECT_COLUMNS)
    .eq('access_token', token)
    .maybeSingle()

  if (sessionError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read the current session.' })
  }

  const { error: revokeError } = await supabase
    .from('auth_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('access_token', token)
    .is('revoked_at', null)

  if (revokeError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to revoke the current session.' })
  }

  return currentSession?.user_id ?? null
}
