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

