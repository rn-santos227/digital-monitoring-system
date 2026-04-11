import { AUTH_API_ENDPOINTS } from '~/constants/api.constants'
import type { LoginPayload, SessionResponse } from '~/types/domain/auth-store'
import { createSessionHeaders, saveSessionToken } from '~/utils/auth-session'

type SessionUserPayload = {
  id: string
  email: string
  fullName?: string | null
  full_name?: string | null
}

type SessionResponsePayload = {
  ok: boolean
  sessionToken?: string
  expiresAt?: string
  user: SessionUserPayload
}

const normalizeSessionResponse = (response: SessionResponsePayload): SessionResponse => {
  return {
    ok: response.ok,
    sessionToken: response.sessionToken,
    expiresAt: response.expiresAt,
    user: {
      id: response.user.id,
      email: response.user.email,
      fullName: response.user.fullName ?? response.user.full_name ?? null,
    },
  }
}

export const loginWithPasswordEndpoint = async (payload: LoginPayload): Promise<SessionResponse> => {
  const response = await $fetch<SessionResponsePayload>(AUTH_API_ENDPOINTS.login, {
    method: 'POST',
    body: payload,
  })

  saveSessionToken(response.sessionToken, response.expiresAt)
  return normalizeSessionResponse(response)
}

export const getSessionEndpoint = async (): Promise<SessionResponse> => {
  const response = await $fetch<SessionResponsePayload>(AUTH_API_ENDPOINTS.session, {
    method: 'GET',
    headers: createSessionHeaders(),
  })

  return normalizeSessionResponse(response)
}
