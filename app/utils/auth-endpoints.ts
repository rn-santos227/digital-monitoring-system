import { AUTH_API_ENDPOINTS, API_LOADING_MESSAGES } from '~/constants/api.constants'
import type { LoginPayload, SessionResponse } from '~/types/domain/auth-store'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders, saveSessionToken } from '~/utils/auth-session'

type SessionUserPayload = {
  id: string
  email: string
  fullName?: string | null
  full_name?: string | null
  accountTypeCodes?: string[]
  account_type_codes?: string[]
  permissionCodes?: string[]
  permission_codes?: string[]
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
      accountTypeCodes: response.user.accountTypeCodes ?? response.user.account_type_codes ?? [],
      permissionCodes: response.user.permissionCodes ?? response.user.permission_codes ?? [],
    },
  }
}

export const loginWithPasswordEndpoint = async (payload: LoginPayload): Promise<SessionResponse> => {
  const response = await withApiLoading(async () => {
    return await $fetch<SessionResponsePayload>(AUTH_API_ENDPOINTS.login, {
      method: 'POST',
      body: payload,
    })
  }, API_LOADING_MESSAGES.authenticate)

  saveSessionToken(response.sessionToken, response.expiresAt)
  return normalizeSessionResponse(response)
}

export const getSessionEndpoint = async (): Promise<SessionResponse> => {
  const response = await withApiLoading(async () => {
    return await $fetch<SessionResponsePayload>(AUTH_API_ENDPOINTS.session, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchSession)

  return normalizeSessionResponse(response)
}

export const logoutEndpoint = async (): Promise<{ ok: boolean }> => {
  const response = await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(AUTH_API_ENDPOINTS.logout, {
      method: 'POST',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.logout)

  saveSessionToken()
  return response
}
