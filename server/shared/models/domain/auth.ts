export interface LoginBody {
  email?: string
  password?: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  full_name: string | null
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
