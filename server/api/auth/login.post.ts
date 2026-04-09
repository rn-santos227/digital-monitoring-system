import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '../../shared/constants'
import type { LoginBody } from '../../shared/models'
import { getRequestIpAddress } from '../../shared/utils'
import { getPublicSupabaseClient, getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'email and password are required' })
  }

  const publicSupabase = getPublicSupabaseClient()
  const { data: authData, error: authError } = await publicSupabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const user = authRow?.[0]
  if (!user?.user_id) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * SESSION_DURATION_HOURS).toISOString()
  const ipAddress = getRequestIpAddress(event)

  const { error: sessionError } = await supabase.from('auth_sessions').insert({
    user_id: user.user_id,
    access_token: token,
    provider: 'local',
    user_agent: event.node.req.headers['user-agent'] ?? null,
    ip_address: ipAddress,
    expires_at: expiresAt,
  })

  if (sessionError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create session: ${sessionError.message}` })
  }

  await supabase
    .from('user_profiles')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', user.user_id)

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  })

  return {
    ok: true,
    user: {
      id: user.user_id,
      email: user.email,
      fullName: user.full_name,
    },
    expiresAt,
  }
})
