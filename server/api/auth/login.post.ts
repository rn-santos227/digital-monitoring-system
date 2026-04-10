import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '../../shared/constants'
import type { LoginBody } from '../../shared/models'
import { applyNullableFilter, getRequestIpAddress } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'email and password are required' })
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
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * SESSION_DURATION_HOURS).toISOString()
  const ipAddress = getRequestIpAddress(event)
  const userAgent = event.node.req.headers['user-agent'] ?? null

  let revokeExistingSessionQuery = supabase
    .from('auth_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('user_id', authenticatedUser.user_id)
    .eq('provider', 'local')
    .is('revoked_at', null)

  revokeExistingSessionQuery = applyNullableFilter(revokeExistingSessionQuery, 'user_agent', userAgent)
  revokeExistingSessionQuery = applyNullableFilter(revokeExistingSessionQuery, 'ip_address', ipAddress)

  const { error: revokeExistingSessionError } = await revokeExistingSessionQuery

  if (revokeExistingSessionError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to clear existing session: ${revokeExistingSessionError.message}`,
    })
  }



  const { error: sessionError } = await supabase.from('auth_sessions').insert({
    user_id: authenticatedUser.user_id,
    access_token: token,
    provider: 'local',
    user_agent: userAgent,
    ip_address: ipAddress,
    expires_at: expiresAt,
  })

  if (sessionError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create session: ${sessionError.message}` })
  }

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  })

  return {
    ok: true,
    sessionToken: token,
    user: {
      id: authenticatedUser.user_id,
      email: authenticatedUser.email,
      fullName: authenticatedUser.full_name,
    },
    expiresAt,
  }
})
