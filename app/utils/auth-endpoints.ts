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
