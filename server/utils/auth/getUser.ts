import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import { serverSupabaseUser } from '#supabase/server'
import type { SessionUserRow } from '../../shared/models'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getServiceSupabaseClient } from './serviceClient'

function hasSupabaseUserConfig() {
  const config = useRuntimeConfig()

  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || config.public?.supabase?.url
  const supabaseKey =
    process.env.NUXT_PUBLIC_SUPABASE_KEY ||
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
    config.public?.supabase?.key

  return Boolean(supabaseUrl && supabaseKey)
}

export async function getUser(event: H3Event) {
  const token = getSessionTokenFromEvent(event)

  if (token) {
    const supabase = getServiceSupabaseClient()
    const now = new Date().toISOString()

    const { data } = await supabase
      .from('auth_sessions')
      .select('user_id, user_profiles!inner(id, email, full_name, is_active)')
      .eq('access_token', token)
      .is('revoked_at', null)
      .gt('expires_at', now)
      .limit(1)
      .maybeSingle<SessionUserRow>()

    if (data?.user_profiles?.is_active) {
      const profile = data.user_profiles
      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
      }
    }
  }

  if (!hasSupabaseUserConfig()) {
    return null
  }

  try {
    const user = await serverSupabaseUser(event)
    return user ?? null
  } catch {
    return null
  }
}
