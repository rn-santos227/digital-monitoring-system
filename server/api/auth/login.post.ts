import {
  createError,
  defineEventHandler,
  readBody,
  setCookie,
} from 'h3'
import { AUDIT_LOG_OUTCOMES, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '../../shared/constants'
import type { LoginBody } from '../../shared/requests'
import { buildLoginAuditRequestData, getRequestIpAddress } from '../../shared/utils'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'
import { createLoginAuditHandlers } from '../../utils/auth/createLoginAuditHandlers'
import { fetchUserPrivilegeClaims } from '../../utils/auth/privileges'
import { updateUserLastLoginAt } from '../../utils/auth/updateUserLastLoginAt'
import { revokeSessionByToken } from '../../utils/auth/revokeSessionByToken'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const rememberSession = body.rememberSession !== false
  const requestData = buildLoginAuditRequestData(email, password)

  const { writeLoginAttempt, writeLoginSuccess } = createLoginAuditHandlers(event, requestData)

  

  

  if (!email || !password) {
    await writeLoginAttempt(400, AUDIT_LOG_OUTCOMES.failed, null, 'Email and password are required.')
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: authData, error: authError } = await supabase.rpc('authenticate_local_user', {
    p_email: email,
    p_password: password,
  })

  if (authError) {
    await writeLoginAttempt(500, AUDIT_LOG_OUTCOMES.failed, null, authError.message)
    throw createError({ statusCode: 500, statusMessage: `Login failed: ${authError.message}` })
  }

  const authenticatedUser = authData?.[0] ?? null
  if (!authenticatedUser) {
    await writeLoginAttempt(401, AUDIT_LOG_OUTCOMES.failed, null, 'Invalid email or password.')
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
    await writeLoginAttempt(500, AUDIT_LOG_OUTCOMES.failed, authenticatedUser.user_id, revokeError.message)
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
    await writeLoginAttempt(500, AUDIT_LOG_OUTCOMES.failed, authenticatedUser.user_id, sessionError.message)
    throw createError({ statusCode: 500, statusMessage: `Failed to create session: ${sessionError.message}` })
  }

  let privilegeClaims: Awaited<ReturnType<typeof fetchUserPrivilegeClaims>>
  try {
    privilegeClaims = await executeWithRollback({
      operation: async () => {
        const claims = await fetchUserPrivilegeClaims(authenticatedUser.user_id)
        await updateUserLastLoginAt(supabase, authenticatedUser.user_id)
        return claims
      },
      rollback: async () => {
        await revokeSessionByToken(supabase, token)
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to revoke an unsuccessful login session.', rollbackError)
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update last login.'
    await writeLoginAttempt(500, AUDIT_LOG_OUTCOMES.failed, authenticatedUser.user_id, message)
    throw createError({ statusCode: 500, statusMessage: message })
  }

  await writeLoginAttempt(200, AUDIT_LOG_OUTCOMES.success, authenticatedUser.user_id, 'Authentication successful.')
  await writeLoginSuccess(authenticatedUser.user_id, expiresAtDate.toISOString())
  const { accountTypeCodes, permissionCodes } = privilegeClaims

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(rememberSession ? { expires: expiresAtDate } : {}),
  })

  return {
    ok: true,
    sessionToken: token,
    user: {
      id: authenticatedUser.user_id,
      email: authenticatedUser.email,
      fullName: authenticatedUser.full_name,
      accountTypeCodes,
      permissionCodes,
    },
    expiresAt: expiresAtDate.toISOString(),
  }
})
