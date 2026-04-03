import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'

interface LoginBody {
  identifier?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const identifier = body.identifier?.trim()
  const password = body.password

  if (!identifier || !password) {
    throw createError({ statusCode: 400, statusMessage: 'identifier and password are required' })
  }

  const supabase = getServiceSupabaseClient()

  const { data: authRow, error: authError } = await supabase.rpc('authenticate_local_user', {
    p_identifier: identifier,
    p_password: password,
  })

  if (authError) {
    throw createError({ statusCode: 500, statusMessage: `Login failed: ${authError.message}` })
  }

  const user = authRow?.[0]
  if (!user?.user_id) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString()
  const ipAddress =
    (event.node.req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      ?.trim()
    ?? event.node.req.socket?.remoteAddress
    ?? null

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

  setCookie(event, 'dms_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  })
})
