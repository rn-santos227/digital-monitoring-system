export interface LoginBody {
  email?: string
  password?: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  full_name: string | null
  account_type_codes: string[]
  permission_codes: string[]
}

export interface StoreSessionInput {
  userId: string
  accessToken: string
  refreshToken?: string | null
  provider: string
  expiresAt: string
}

export interface RevokeSessionInput {
  sessionId?: string
  accessToken?: string
}
