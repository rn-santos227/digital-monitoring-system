import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { AuthDatabase, RevokeSessionInput } from '../../shared/models'

export async function revokeSession(event: H3Event, input: RevokeSessionInput) {
  const supabase = await serverSupabaseClient<AuthDatabase>(event)
  const now = new Date().toISOString()

  let query = supabase.from('auth_sessions').update({ revoked_at: now }).is('revoked_at', null)

  if (input.sessionId) {
    query = query.eq('id', input.sessionId)
  } else if (input.accessToken) {
    query = query.eq('access_token', input.accessToken)
  } else {
    throw new Error('sessionId or accessToken is required to revoke a session')
  }

  const { data, error } = await query.select('*')

  if (error) {
    throw new Error(`Failed to revoke auth session: ${error.message}`)
  }

  return data
}
