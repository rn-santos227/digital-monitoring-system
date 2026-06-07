import type { H3Event } from 'h3'
import { getHeader } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import type { AuthDatabase, StoreSessionInput } from '../../shared/models'
import { getRequestIpAddress } from '../../shared/utils'

export async function storeSession(event: H3Event, input: StoreSessionInput) {
  const supabase = await serverSupabaseClient<AuthDatabase>(event)

  const payload = {
    user_id: input.userId,
    access_token: input.accessToken,
    refresh_token: input.refreshToken ?? null,
    provider: input.provider,
    ip_address: getRequestIpAddress(event),
    user_agent: getHeader(event, 'user-agent') ?? null,
    expires_at: input.expiresAt,
  }

  const { data, error } = await supabase
    .from('auth_sessions')
    .upsert(payload, {
      onConflict: 'user_id,provider,user_agent,ip_address',
      ignoreDuplicates: false,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to store auth session: ${error.message}`)
  }

  await supabase.from('user_profiles').update({ last_login_at: new Date().toISOString() }).eq('id', input.userId)

  return data
}
