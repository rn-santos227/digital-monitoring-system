import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '../../shared/constants'
import type { LoginBody } from '../../shared/models'
import { getRequestIpAddress } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: authData, error: authError } = await supabase.rpc('authenticate_local_user', {
    p_email: email,
    p_password: password,
  })

  if (authError) {
    throw createError({ statusCode: 500, statusMessage: `Login failed: ${authError.message}` })
  }

  const authenticatedUser = authData?.[0]
  if (!authenticatedUser) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  const token = generateSessionToken()
  const expiresAtDate = new Date(Date.now() + 1000 * 60 * 60 * SESSION_DURATION_HOURS)
  const userAgent = event.node.req.headers['user-agent'] ?? null
  const ipAddress = getRequestIpAddress(event)

  const { error: revokeError } = await supabase
    .from('auth_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('user_id', authenticatedUser.user_id)
    .eq('provider', 'local')
    .is('revoked_at', null)

  if (revokeError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to clear prior session: ${revokeError.message}` })
  }

  const { error: sessionError } = await supabase
    .from('auth_sessions')
    .insert({
      user_id: authenticatedUser.user_id,
      access_token: token,
      provider: 'local',
      user_agent: userAgent,
      ip_address: ipAddress,
      expires_at: expiresAtDate.toISOString(),
    })

  if (sessionError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create session: ${sessionError.message}` })
  }

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAtDate,
  })

  return {
    ok: true,
    sessionToken: token,
    user: {
      id: authenticatedUser.user_id,
      email: authenticatedUser.email,
      fullName: authenticatedUser.full_name,
    },
    expiresAt: expiresAtDate.toISOString(),
  }
})
