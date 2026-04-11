import { AUTH_API_ENDPOINTS, AUTH_HEADERS } from '../constants/api.constants'
import type { LoginPayload, SessionResponse } from '../types/domain/auth-store'
import { buildSessionHeaders } from './session-token'

export function fetchAuthSession(sessionToken: string | null): Promise<SessionResponse> {
  return $fetch<SessionResponse>(AUTH_API_ENDPOINTS.session, {
    credentials: 'include',
    headers: buildSessionHeaders(AUTH_HEADERS.sessionToken, sessionToken),
  })
}

export function postAuthLogin(payload: LoginPayload): Promise<SessionResponse> {
  return $fetch<SessionResponse>(AUTH_API_ENDPOINTS.login, {
    method: 'POST',
    credentials: 'include',
    body: {
      email: payload.email.trim(),
      password: payload.password,
    },
  })
}

export function postAuthLogout(sessionToken: string | null): Promise<{ ok: boolean }> {
  return $fetch<{ ok: boolean }>(AUTH_API_ENDPOINTS.logout, {
    method: 'POST',
    credentials: 'include',
    headers: buildSessionHeaders(AUTH_HEADERS.sessionToken, sessionToken),
  })
}
