import type { H3Event } from 'h3'
import { getHeader } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface StoreSessionInput {
  userId: string
  accessToken: string
  refreshToken?: string | null
  provider: string
  expiresAt: string
}

export async function storeSession(event: H3Event, input: StoreSessionInput) {
  const supabase = (await serverSupabaseClient(event)) as any

  // NOTE: Tokens are stored in plaintext for compatibility with direct revocation checks.
  // Prefer encrypted/hardened token storage at rest where feasible.
  const payload = {
    user_id: input.userId,
    access_token: input.accessToken,
    refresh_token: input.refreshToken ?? null,
    provider: input.provider,
    ip_address: getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ?? event.node.req.socket.remoteAddress ?? null,
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
