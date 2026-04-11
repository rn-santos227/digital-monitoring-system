import type { H3Event } from 'h3'
import { getHeader } from 'h3'
import { useRuntimeConfig } from '#imports'
import { serverSupabaseUser } from '#supabase/server'
import type { SessionUserRow } from '../../shared/models'
import { getSessionTokenFromEvent } from '../../shared/utils'
import { getPublicSupabaseClient, getServiceSupabaseClient } from './serviceClient'

function hasSupabaseUserConfig() {
  const config = useRuntimeConfig()

  const supabaseUrl =
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    config.public?.supabaseUrl ||
    config.public?.supabase?.url
  const supabaseKey =
    process.env.NUXT_PUBLIC_SUPABASE_KEY ||
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    config.public?.supabaseKey ||
    config.public?.supabase?.key

  return Boolean(supabaseUrl && supabaseKey)
}

export async function getUser(event: H3Event) {
  const token = getSessionTokenFromEvent(event)
  const authorizationHeader = getHeader(event, 'authorization')
  const oauthAccessToken = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7).trim()
    : null

  if (token) {
    const supabase = getServiceSupabaseClient()
    const now = new Date().toISOString()

    const { data } = await supabase
      .from('auth_sessions')
      .select('user_id, user_profiles(id, email, full_name, is_active)')
      .eq('access_token', token)
      .is('revoked_at', null)
      .gt('expires_at', now)
      .limit(1)
      .maybeSingle<SessionUserRow>()

    const profile = data?.user_profiles
    if (profile?.is_active) {
      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
      }
    }

   if (data?.user_id) {
      const { data: authUser } = await supabase.auth.admin.getUserById(data.user_id)

      if (authUser?.user?.email) {
        return {
          id: data.user_id,
          email: authUser.user.email,
          full_name: (authUser.user.user_metadata?.full_name as string | undefined) ?? null,
        }
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
